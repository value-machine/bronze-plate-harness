-- In-app user feedback — consolidated schema.
-- Contract: documentation/DOC_ERROR_LOGGING_CONTRACT.md § Feedback
--
-- Rebuilt from the MILA app_feedback migrations (20260915103407 … 20261015160000), final state,
-- with these deliberate deltas:
--   * Chat-specific columns (message_id, assistant_id, message_context, bug_id) replaced by a
--     generic `context jsonb`; no bugs table.
--   * app_id is any short label (length check) instead of a fixed allowlist.
--   * Submitters may update `status` only; `submitter_resolution` is stamped by the guard trigger.
--   * Handled rows nobody acknowledges auto-complete after 14 days (scheduled with retention).
-- Requires 20261021120000_error_logs.sql (is_admin_user, cleanup_old_error_logs).
-- Status lifecycle: open → (agent) review → (admin) handled | dismissed | open
--                   handled → (submitter) completed | open (reopened).
-- Replay-safe: every statement is idempotent.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.app_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  environment text,
  submitter_resolution jsonb NOT NULL DEFAULT '{}'::jsonb,
  app_id text NOT NULL DEFAULT 'app',
  CONSTRAINT app_feedback_status_allowed
    CHECK (status IN ('open', 'review', 'handled', 'dismissed', 'completed')),
  CONSTRAINT app_feedback_body_len CHECK (char_length(body) BETWEEN 1 AND 10000),
  CONSTRAINT app_feedback_context_len CHECK (octet_length(context::text) <= 262144),
  CONSTRAINT app_feedback_submitter_resolution_len
    CHECK (octet_length(submitter_resolution::text) <= 4096),
  CONSTRAINT app_feedback_app_id_len CHECK (char_length(app_id) BETWEEN 1 AND 64)
);

COMMENT ON TABLE public.app_feedback IS
  'User-submitted feedback. Submitters insert open rows and acknowledge handled ones; admins triage.';
COMMENT ON COLUMN public.app_feedback.user_name IS 'Self-reported (JWT user_metadata); user_email is verified.';

CREATE INDEX IF NOT EXISTS idx_app_feedback_status_created
  ON public.app_feedback (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_feedback_user_created
  ON public.app_feedback (user_id, created_at);

DROP TRIGGER IF EXISTS app_feedback_set_updated_at ON public.app_feedback;
CREATE TRIGGER app_feedback_set_updated_at
  BEFORE UPDATE ON public.app_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Insert triggers (fire in name order: bind before cap). DEFINER so the cap sees every row.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.app_feedback_bind_submitter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := coalesce(nullif((SELECT auth.jwt()) ->> 'email', ''), 'unknown');
BEGIN
  NEW.user_id := (SELECT auth.uid());
  NEW.user_email := v_email;
  NEW.user_name := left(coalesce(
    nullif((SELECT auth.jwt()) -> 'user_metadata' ->> 'full_name', ''),
    nullif((SELECT auth.jwt()) -> 'user_metadata' ->> 'name', ''),
    v_email
  ), 200);
  NEW.status := 'open';
  NEW.submitter_resolution := '{}'::jsonb;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.app_feedback_cap_per_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN NEW;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('app_feedback_cap'), hashtext(v_uid::text));
  SELECT count(*) INTO v_count
  FROM public.app_feedback
  WHERE user_id = v_uid
    AND created_at > now() - interval '24 hours';
  IF v_count >= 100 THEN
    RAISE EXCEPTION 'Feedback limit reached. Try again later.' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.app_feedback_bind_submitter() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.app_feedback_cap_per_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_feedback_bind_submitter() TO service_role;
GRANT EXECUTE ON FUNCTION public.app_feedback_cap_per_user() TO service_role;

DROP TRIGGER IF EXISTS app_feedback_bind_submitter ON public.app_feedback;
CREATE TRIGGER app_feedback_bind_submitter
  BEFORE INSERT ON public.app_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.app_feedback_bind_submitter();

DROP TRIGGER IF EXISTS app_feedback_cap_per_user ON public.app_feedback;
CREATE TRIGGER app_feedback_cap_per_user
  BEFORE INSERT ON public.app_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.app_feedback_cap_per_user();

-- ---------------------------------------------------------------------------
-- Submitter acknowledgement guard: handled → completed | open; every other column frozen.
-- Admins, service_role and migration/scheduler runners bypass it.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.app_feedback_submitter_ack_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := (SELECT auth.uid());
BEGIN
  IF v_actor IS NULL
     AND (current_user IN ('postgres', 'supabase_admin')
          OR coalesce((SELECT auth.jwt()) ->> 'role', '') = 'service_role') THEN
    RETURN NEW;
  END IF;
  IF public.is_admin_user(v_actor) THEN
    NEW.submitter_resolution := OLD.submitter_resolution;
    RETURN NEW;
  END IF;
  IF OLD.status IS DISTINCT FROM 'handled' OR NEW.status NOT IN ('completed', 'open') THEN
    RAISE EXCEPTION 'app_feedback submitter ack requires handled to completed or open'
      USING ERRCODE = '42501';
  END IF;
  NEW := jsonb_populate_record(NEW, to_jsonb(OLD) - 'status' - 'updated_at');
  NEW.submitter_resolution := jsonb_build_object(
    'action', CASE WHEN NEW.status = 'completed' THEN 'completed' ELSE 'reopened' END,
    'at', now(),
    'user_id', v_actor
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.app_feedback_submitter_ack_guard() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS app_feedback_submitter_ack_guard ON public.app_feedback;
CREATE TRIGGER app_feedback_submitter_ack_guard
  BEFORE UPDATE ON public.app_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.app_feedback_submitter_ack_guard();

-- ---------------------------------------------------------------------------
-- RLS: one policy per action.
-- ---------------------------------------------------------------------------
ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own open app_feedback" ON public.app_feedback;
CREATE POLICY "Users insert own open app_feedback"
  ON public.app_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()) AND status = 'open');

-- Submitters read all their own rows: UPDATE re-checks the new row against this policy, so a
-- status-limited read would reject the submitter's own completed/reopened ack.
DROP POLICY IF EXISTS "Admins or submitter read app_feedback" ON public.app_feedback;
CREATE POLICY "Admins or submitter read app_feedback"
  ON public.app_feedback
  FOR SELECT
  TO authenticated
  USING (public.is_admin_user((SELECT auth.uid())) OR user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins or submitter update app_feedback" ON public.app_feedback;
CREATE POLICY "Admins or submitter update app_feedback"
  ON public.app_feedback
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin_user((SELECT auth.uid()))
    OR (user_id = (SELECT auth.uid()) AND status = 'handled')
  )
  WITH CHECK (
    public.is_admin_user((SELECT auth.uid()))
    OR (user_id = (SELECT auth.uid()) AND status IN ('completed', 'open'))
  );

REVOKE ALL ON TABLE public.app_feedback FROM anon, authenticated;
GRANT SELECT ON TABLE public.app_feedback TO authenticated;
GRANT INSERT (body, context, environment, app_id) ON TABLE public.app_feedback TO authenticated;
GRANT UPDATE (status) ON TABLE public.app_feedback TO authenticated;

-- ---------------------------------------------------------------------------
-- Handled rows the submitter never acknowledged auto-complete (service_role / scheduler only).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.autocomplete_stale_feedback(after_days integer DEFAULT 14)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE public.app_feedback
  SET status = 'completed',
      submitter_resolution = jsonb_build_object('action', 'auto_completed', 'at', now())
  WHERE status = 'handled'
    AND updated_at < now() - make_interval(days => greatest(after_days, 1));
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;

REVOKE ALL ON FUNCTION public.autocomplete_stale_feedback(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.autocomplete_stale_feedback(integer) TO service_role;

-- ---------------------------------------------------------------------------
-- Daily signal maintenance when pg_cron is enabled (named job: re-running updates it).
-- Without pg_cron, schedule both calls as service_role elsewhere (see contract doc).
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup_signals',
      '17 3 * * *',
      'SELECT public.cleanup_old_error_logs(90); SELECT public.autocomplete_stale_feedback(14);'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Realtime (admin inbox + submitter "handled" tray). RLS applies per subscriber.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_feedback'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_feedback;
  END IF;
END
$$;

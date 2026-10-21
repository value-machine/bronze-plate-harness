-- Error logging (Bug Triage) — consolidated schema.
-- Contract: documentation/DOC_ERROR_LOGGING_CONTRACT.md
--
-- Rebuilt from the MILA error_logs migrations (20250319100000 … 20261015160000), final state,
-- with these deliberate deltas:
--   * The fingerprint hash is computed here, from type + normalised message + context. Clients no
--     longer send a fingerprint source, so they cannot target another reporter's cluster.
--   * SELECT is admin-only (MILA also let a user read "own" rows; shared hashes made that leak).
--   * A resolved/review cluster reopens only when it recurs on a different app version than the
--     one it was closed on (old tabs on the fixed release do not reopen it).
--   * Per-user cap on new clusters (200 per 24h); length checks on every free-text column.
--   * cleanup_old_error_logs is service_role only; no anon grants; no bugs / bug_error_hashes;
--     no view-as hook; is_admin_user reads the JWT and is created only if missing.
-- Replay-safe: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- Admin check (policy helper). Kept if the project already defines it.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regprocedure('public.is_admin_user(uuid)') IS NULL THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_admin_user(user_id uuid)
      RETURNS boolean
      LANGUAGE sql
      STABLE
      SECURITY INVOKER
      SET search_path = public
      AS $body$
        -- The argument is the caller's uid (policy-helper convention); the role comes from the
        -- caller's JWT app_metadata, which users cannot edit. Changes apply after token refresh.
        SELECT user_id IS NOT NULL
          AND user_id = (SELECT auth.uid())
          AND coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') IN ('admin', 'super-admin');
      $body$
    $fn$;
  ELSIF pg_get_functiondef('public.is_admin_user(uuid)'::regprocedure) NOT LIKE '%app_metadata%' THEN
    RAISE WARNING 'public.is_admin_user(uuid) already exists and was kept. Check that it matches the JWT app_metadata.role contract.';
  END IF;
END
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hash text NOT NULL UNIQUE,
  message text NOT NULL,
  stack text,
  context text,
  type text NOT NULL,
  route text,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  browser_info jsonb,
  count integer NOT NULL DEFAULT 1,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  app_version text NOT NULL,
  status_version text,
  status text NOT NULL DEFAULT 'open',
  environment text NOT NULL DEFAULT 'unknown',
  resolved boolean NOT NULL DEFAULT false,
  fingerprint_version integer NOT NULL DEFAULT 1,
  CONSTRAINT error_logs_status_check CHECK (status IN ('open', 'muted', 'review', 'resolved')),
  CONSTRAINT error_logs_environment_check
    CHECK (environment IN ('local_dev', 'preview', 'staging', 'production', 'unknown')),
  CONSTRAINT error_logs_fingerprint_version_check CHECK (fingerprint_version > 0),
  CONSTRAINT error_logs_lengths_check CHECK (
    char_length(message) BETWEEN 1 AND 10000
    AND char_length(coalesce(stack, '')) <= 20000
    AND char_length(coalesce(context, '')) <= 500
    AND char_length(coalesce(route, '')) <= 500
    AND char_length(type) <= 64
    AND char_length(app_version) BETWEEN 1 AND 64
    AND octet_length(coalesce(browser_info, '{}'::jsonb)::text) <= 4096
  )
);

COMMENT ON TABLE public.error_logs IS
  'Deduplicated runtime errors (one row per cluster hash). Written only via upsert_error_log; read by admins.';
COMMENT ON COLUMN public.error_logs.status_version IS
  'app_version current when the cluster moved to review/resolved; recurrence on another version reopens it.';

CREATE INDEX IF NOT EXISTS idx_error_logs_status_last_seen
  ON public.error_logs (status, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_first_seen_at
  ON public.error_logs (first_seen_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_first_seen
  ON public.error_logs (user_id, first_seen_at);

-- status <-> resolved stay in sync; status_version records the version a cluster was closed on.
CREATE OR REPLACE FUNCTION public.sync_error_logs_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.resolved AND NOT OLD.resolved THEN
    NEW.status := 'resolved';
  END IF;
  NEW.resolved := NEW.status = 'resolved';
  IF NEW.status IN ('review', 'resolved')
     AND (TG_OP = 'INSERT' OR OLD.status NOT IN ('review', 'resolved')) THEN
    NEW.status_version := NEW.app_version;
  ELSIF NEW.status NOT IN ('review', 'resolved') THEN
    NEW.status_version := NULL;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_error_logs_status() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_sync_error_logs_status ON public.error_logs;
CREATE TRIGGER trg_sync_error_logs_status
  BEFORE INSERT OR UPDATE ON public.error_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_error_logs_status();

-- ---------------------------------------------------------------------------
-- RLS: admins read; nobody writes the table directly.
-- ---------------------------------------------------------------------------
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read error_logs" ON public.error_logs;
CREATE POLICY "Admins read error_logs"
  ON public.error_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin_user((SELECT auth.uid())));

REVOKE ALL ON TABLE public.error_logs FROM anon, authenticated;
GRANT SELECT ON TABLE public.error_logs TO authenticated;

-- ---------------------------------------------------------------------------
-- Fingerprint (server-side). Version 1: type + normalised message + context.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.normalize_error_message(p_message text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT btrim(regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              lower(coalesce(p_message, '')),
              '[a-z][a-z0-9+.-]*://[^\s''")]+', ':url', 'g'),
            '[^\s@]+@[^\s@]+\.[a-z]{2,}', ':email', 'g'),
          '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', ':uuid', 'g'),
        '\d{4}-\d{2}-\d{2}t[\d:.]+z?', ':timestamp', 'g'),
      '\m(0x)?[0-9a-f]{16,}\M|\m\d{5,}\M', ':id', 'g'),
    '\s+', ' ', 'g'));
$$;

REVOKE ALL ON FUNCTION public.normalize_error_message(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.normalize_error_message(text) TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Write path. Only signed-in users (JWT) or service_role; anon is a silent no-op.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.upsert_error_log(
  p_message text,
  p_stack text,
  p_context text,
  p_type text,
  p_route text DEFAULT NULL,
  p_browser_info jsonb DEFAULT NULL,
  p_app_version text DEFAULT 'unknown',
  p_environment text DEFAULT 'unknown'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := (SELECT auth.uid());
  v_environment text;
  v_version text := left(coalesce(nullif(btrim(p_app_version), ''), 'unknown'), 64);
  v_type text := left(coalesce(nullif(btrim(p_type), ''), 'log_error'), 64);
  v_context text := left(p_context, 500);
  v_hash text;
  v_new_clusters integer;
BEGIN
  IF v_user_id IS NULL AND coalesce((SELECT auth.jwt()) ->> 'role', '') <> 'service_role' THEN
    RETURN;
  END IF;

  v_environment := coalesce(nullif(btrim(p_environment), ''), 'unknown');
  IF v_environment NOT IN ('local_dev', 'preview', 'staging', 'production', 'unknown') THEN
    v_environment := 'unknown';
  END IF;

  v_hash := encode(sha256(convert_to(
    'v1|' || v_type || '|' || public.normalize_error_message(p_message) || '|' || coalesce(v_context, ''),
    'UTF8')), 'hex');

  UPDATE public.error_logs
  SET count = count + 1,
      last_seen_at = now(),
      app_version = v_version,
      environment = v_environment,
      route = coalesce(left(p_route, 500), route),
      status = CASE
        WHEN status IN ('review', 'resolved') AND status_version IS DISTINCT FROM v_version THEN 'open'
        ELSE status
      END
  WHERE hash = v_hash;

  IF FOUND THEN
    RETURN;
  END IF;

  IF v_user_id IS NOT NULL THEN
    SELECT count(*) INTO v_new_clusters
    FROM public.error_logs
    WHERE user_id = v_user_id
      AND first_seen_at > now() - interval '24 hours';
    IF v_new_clusters >= 200 THEN
      RETURN;
    END IF;
  END IF;

  INSERT INTO public.error_logs (
    hash, message, stack, context, type, route, user_id, browser_info, app_version, environment
  )
  VALUES (
    v_hash,
    left(coalesce(nullif(p_message, ''), 'Unknown error'), 10000),
    left(p_stack, 20000),
    v_context,
    v_type,
    left(p_route, 500),
    v_user_id,
    CASE WHEN octet_length(coalesce(p_browser_info, '{}'::jsonb)::text) <= 4096 THEN p_browser_info END,
    v_version,
    v_environment
  )
  ON CONFLICT (hash) DO UPDATE SET
    count = public.error_logs.count + 1,
    last_seen_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_error_log(text, text, text, text, text, jsonb, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.upsert_error_log(text, text, text, text, text, jsonb, text, text)
  TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Admin status changes (resolve / mute / review / reopen).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_update_error_log_status(p_error_log_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user((SELECT auth.uid())) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE = '42501';
  END IF;
  IF p_status IS NULL OR p_status NOT IN ('open', 'muted', 'review', 'resolved') THEN
    RAISE EXCEPTION 'Invalid status' USING ERRCODE = '22023';
  END IF;
  UPDATE public.error_logs SET status = p_status WHERE id = p_error_log_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'error_log not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_error_log_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_error_log_status(uuid, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Retention (service_role / scheduler only). Scheduled in the app_feedback migration.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cleanup_old_error_logs(retention_days integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.error_logs
  WHERE last_seen_at < now() - make_interval(days => greatest(retention_days, 1));
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_error_logs(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_error_logs(integer) TO service_role;

-- ---------------------------------------------------------------------------
-- Realtime (admin triage list). RLS applies per subscriber.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'error_logs'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.error_logs;
  END IF;
END
$$;

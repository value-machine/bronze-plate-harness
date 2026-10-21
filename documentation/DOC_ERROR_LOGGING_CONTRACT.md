# Error logging and feedback contract (SSOT)

Runtime errors and user feedback are **signals**: they land in Supabase whenever it is connected, admins triage them in the app, and agents link them to tasks (`.agents/skills/backlog-management/SKILL.md`). Without Supabase everything below is a silent no-op.

## Surfaces → helpers

| Surface | Use | Entry file |
|---------|-----|------------|
| Web app (React, hooks, services) | `logError(context, error)` in catch blocks; `logAppError(error, context, type)` when you already show the error | `src/shared/services/errorLoggingService.ts` |
| Uncaught errors / unhandled rejections | Automatic (`registerGlobalErrorHandler` in `src/main.tsx`) | same |
| React render errors | Automatic (`QueryErrorBoundary onError` in `src/App.tsx`) | same |
| Edge Function, signed-in caller | `logEdgeError(authHeader, { error, context })` | `supabase/functions/_shared/errorLogging.ts` |
| Edge Function, no user (webhook, cron, worker) | `logServiceError({ error, context })` | same |
| User feedback | "Send feedback" in the profile menu | `src/features/feedback/` |

Do not call `upsert_error_log` directly from app code; keep one pattern so reviewers can grep the helpers. Rule: `.cursor/rules/code-style/RULE.mdc` § Error Handling (every runtime `console.error` is paired with central logging).

**`context`** is stable and names the code, not the data: `TasksService.load`, `send-email:deliver`. Repeats with the same type, normalised message and context group into one row.

## Grouping, reopen and volume

- The **database** computes the cluster hash: `sha256("v1|" + type + "|" + normalised message + "|" + context)`. The normaliser replaces urls, emails, uuids, timestamps and long numbers/hex. Stacks are **not** part of the hash (production builds are minified, so frames change every deploy).
- A repeat bumps `count`, `last_seen_at`, `app_version`, `environment`.
- **Reopen:** a `review` or `resolved` cluster goes back to `open` only when it recurs on a **different `app_version`** than the one it was closed on (`status_version`). Old tabs still on the broken release do not reopen it. `muted` stays muted.
- **Client throttle:** one send per error group per 10 s and at most 50 sends per page session.
- **Server caps:** 200 new clusters per user per 24 h (excess no-ops); 100 feedback rows per user per 24 h (error `P0001`).

## Identity and access

| Who | `error_logs` | `app_feedback` |
|-----|--------------|----------------|
| `anon` | nothing (pre-login failures stay in the console — known gap) | nothing |
| Signed-in user | write via RPC only; **cannot read** | insert own rows (`body`, `context`, `environment`, `app_id`); read own rows; answer ✓ / ✗ on own `handled` rows |
| Admin (JWT `app_metadata.role` = `admin` / `super-admin`) | read; change status via `admin_update_error_log_status` | read; set `open` / `handled` / `dismissed` |
| `service_role` | write via RPC; retention | everything |

Admin rights come from `app_metadata`, which users cannot edit. Set it in the Supabase dashboard (Authentication → Users → user → app_metadata `{"role": "admin"}`); it applies after the user's next sign-in or token refresh. `is_admin_user()` is created only if the project has none; an existing one is kept with a warning.

## Payload and privacy

Never send secrets, tokens, passwords, raw prompts, document bodies or unneeded PII.

- **Scrubbed before sending** (web and Edge): JWT-like tokens, `Bearer …`, emails, URL query strings and fragments, 32+ char hex.
- **Route:** path only, no query or hash (OAuth `?code=` never leaves the browser).
- **Browser info:** `userAgent`, `language` only.
- **Lengths:** message ≤ 10 000, stack ≤ 20 000, context ≤ 500 (enforced in the client and by table checks).
- **Feedback context:** `{ route, appVersion }`. `user_name` is self-reported; `user_email` is verified.

## Statuses

| Signal | Statuses | Who moves it |
|--------|----------|--------------|
| `error_logs` | `open` → `review` (agent shipped a fix) → `resolved` (admin); `muted` parks noise | agents: `review` (finish), `resolved` (backlog catch-up with clear evidence); admins: any |
| `app_feedback` | `open` → `review` (agent) → `handled` / `dismissed` (admin) → `completed` (submitter ✓) or `open` (submitter ✗) | handled rows nobody answers auto-complete after 14 days |

`review` means "resolved in the next release, awaiting confirmation"; `completed` means "the reporter confirmed".

## Environment and version

- `environment`: `local_dev` on localhost; otherwise `VITE_APP_ENVIRONMENT` (`preview` | `staging` | `production`) or `unknown`. Edge: `ERROR_LOG_ENVIRONMENT`.
- `app_version`: `VITE_APP_VERSION`, defaulting to the `package.json` version at build time. Edge: `APP_VERSION`, else `edge`.

## Retention

`cleanup_old_error_logs(90)` deletes clusters not seen for 90 days; `autocomplete_stale_feedback(14)` closes unanswered handled feedback. With `pg_cron` enabled, the migration schedules both daily as job `cleanup_signals`. Without it, call both as `service_role` from any scheduler.

## Plans and reviews

New or changed user-visible or Edge failure surfaces reach `error_logs` through the helpers above, or the plan states an **allowed `N/A`** with a reason (for example: failure is already shown to the user and is expected input validation; pre-login flow; logging infrastructure itself). Lint and CI do not prove wiring; reviewers check it (`.cursor/rules/workflow/RULE.mdc` review checklist).

## Known gaps

- Pre-login and signed-out failures are not stored (anon has no write access by design).
- Production stacks are minified; there is no source-map upload. Use `context`, `route` and `app_version` to locate code.
- `dismissed` feedback does not notify the submitter.

## Opting out

A fork that does not want signals removes these touch points (`purge-skill` can drive it):

| Area | Path |
|------|------|
| Migrations | `supabase/migrations/*_error_logs.sql`, `*_app_feedback.sql` (or never apply them) |
| Edge helper | `supabase/functions/_shared/errorLogging.ts` |
| Web logging | `src/shared/services/errorLoggingService.ts`, `registerGlobalErrorHandler()` in `src/main.tsx`, `onError` on `QueryErrorBoundary` in `src/App.tsx` |
| Feedback | `src/features/feedback/`, `src/shared/types/feedback.types.ts`, "Send feedback" in `src/layouts/ProfileMenu/`, `HandledFeedbackMenu` in `src/layouts/Topbar/Topbar.tsx` |
| Admin | `src/features/admin/feedback/`, `src/features/admin/error-logs/`, `src/shared/types/errorLog.types.ts`, `src/pages/admin/`, `src/routes/guards/RequireAdmin.tsx`, `/admin/*` routes in `src/App.tsx`, admin menu items |
| Shared helpers (keep if used elsewhere) | `src/shared/hooks/useTableSubscription.ts`, `src/shared/utils/appEnvironment.ts`, `src/shared/utils/authRole.ts` |
| Guidance | `.cursor/rules/code-style/RULE.mdc` § Error Handling paragraph, `workflow` checklist lines, `platform` env lines, `database` signal-tables note; `backlog-management` § Configure (set signals off); `finish` § Backlog review handoff; `debug` signal-ref slot |
| Env | `VITE_APP_ENVIRONMENT`, `VITE_APP_VERSION` define in `vite.config.ts`, `VITE_APP_ID` |

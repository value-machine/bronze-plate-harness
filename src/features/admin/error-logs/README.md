# Admin: error triage

## Purpose

Admins review runtime error clusters from `error_logs` (one row per fingerprint). Default view: `open` and `review` (an agent shipped a fix). Actions: resolve, mute (with confirmation), reopen, "Copy for agent" (`## error_logs` packet). A resolved or reviewed cluster reopens by itself when it recurs on a different app version. Route: `/admin/errors` behind `RequireAdmin`; only admins can read the table.

## Structure

| Layer      | Path                                                   | Purpose                                                                                                       |
| ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| API        | `api/keys.ts`                                          | Query keys                                                                                                    |
| Services   | `services/errorLogsAdminService.ts`                    | `listErrorLogs` (projected columns, cap 200), `updateErrorLogStatus` (admin RPC), `formatErrorLogAgentPacket` |
| Hooks      | `hooks/useErrorTriage.ts`                              | Live list (`useTableSubscription`, 3 s debounce for error storms), show-closed toggle, status mutation        |
| Components | `components/ErrorTriageList.tsx`, `ErrorTriageRow.tsx` | List, row actions, mute confirmation                                                                          |

Shared row types: `src/shared/types/errorLog.types.ts`. Page: `src/pages/admin/AdminErrorsPage.tsx`.

## Dependencies

- `supabase/migrations/*_error_logs.sql` (`admin_update_error_log_status`, admin-only SELECT).
- Writes come from `src/shared/services/errorLoggingService.ts` and `supabase/functions/_shared/errorLogging.ts`. Contract: `documentation/DOC_ERROR_LOGGING_CONTRACT.md`.
- Kit: `Badge`, `Button`, `Alert`, `ConfirmDialog`, `StatusAlert`, `PageLoadingState`.
- The agent packet format has a second copy in `features/admin/feedback` (marked in both services).

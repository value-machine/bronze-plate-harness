# Admin: feedback inbox

## Purpose

Admins read user feedback that is `open` or `review` (an agent shipped a fix) and set it to `handled`, `dismissed` or back to `open`. "Copy for agent" puts an `## app_feedback` markdown packet on the clipboard for an agent chat (the `debug` skill reads it). Route: `/admin/feedback` behind `RequireAdmin`; the database enforces admin access (`is_admin_user`).

## Structure

| Layer      | Path                               | Purpose                                                                                               |
| ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| API        | `api/keys.ts`                      | Query keys                                                                                            |
| Services   | `services/adminFeedbackService.ts` | `listFeedbackInbox` (projected columns, cap 200), `updateFeedbackStatus`, `formatFeedbackAgentPacket` |
| Hooks      | `hooks/useFeedbackInbox.ts`        | Live list (`useTableSubscription`), selection, status mutation merged into the cache                  |
| Components | `components/FeedbackInbox*.tsx`    | List, detail, status buttons, dismiss confirmation                                                    |

Shared row types: `src/shared/types/feedback.types.ts`. Page: `src/pages/admin/AdminFeedbackPage.tsx`.

## Dependencies

- `supabase/migrations/*_app_feedback.sql` (RLS: admins read and update).
- `@/shared/services/supabaseService`, `@/shared/hooks/useTableSubscription`, `@/shared/hooks/useCopyToClipboard`.
- Kit: `Badge`, `Button`, `Alert`, `ConfirmDialog`, `StatusAlert`, `PageLoadingState`.
- The agent packet format has a second copy in `features/admin/error-logs` (marked in both services).

## Notes

- Shown name is self-reported; the email is verified.
- `dismissed` does not notify the submitter (by design for now).

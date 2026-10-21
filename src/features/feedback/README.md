# Feedback (`app_feedback`)

## Purpose

Signed-in users send free-text feedback from the profile menu ("Send feedback"). When an admin marks it **handled**, the submitter sees it in the Topbar tray and answers ✓ (fixed → `completed`) or ✗ (not fixed → back to `open`). Handled rows nobody answers auto-complete after 14 days (database job).

Agents read open feedback through Supabase MCP and link it to tasks (`.agents/skills/backlog-management/SKILL.md`). Contract: `documentation/DOC_ERROR_LOGGING_CONTRACT.md` § Feedback.

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| API | `api/keys.ts` | Query keys |
| Services | `services/feedbackService.ts` | `sendFeedback`, `listHandledFeedbackForMe`, `ackFeedback`, body validation, error copy |
| Hooks | `hooks/useSendFeedback.ts` | Submit mutation |
| Hooks | `hooks/useHandledFeedback.ts` | Live handled list (via `useTableSubscription`) + optimistic ack |
| Components | `components/FeedbackDialog.tsx` | Submit form (kit `Modal` + `Textarea`) |
| Components | `components/HandledFeedbackMenu.tsx` | Topbar ✓ / ✗ tray; renders nothing when empty |

Row and status types live in `src/shared/types/feedback.types.ts` (shared with `features/admin/feedback`).

## Dependencies

- Tables and rules: `supabase/migrations/*_app_feedback.sql` (identity bound from the JWT, 100 per user per 24h, submitter may only ack handled rows).
- `@/shared/services/supabaseService`, `@/shared/hooks/useTableSubscription`, `@/shared/utils/appEnvironment`, `@/shared/context/AuthContext`.
- Kit: `Modal`, `Textarea`, `Button`, `Alert`, `DropdownMenu`, `Tooltip`, `StatusAlert`.
- Hidden when Supabase is not configured or the user is signed out (no session → no menu item, no tray).

## Privacy

The insert sends only `body`, `context` (`route` path without query string, `appVersion`), `environment` and `app_id`. The database fills identity from the JWT; `user_name` is self-reported, `user_email` is verified.

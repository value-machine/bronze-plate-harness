---
name: backlog-management
description: >-
  Router default when there is no clear objective (bare /router on an idle thread). Catches up
  src/config/app-tasks.json against landed work and, when signals are on, against open error_logs
  clusters and app_feedback rows; links open signals to tasks; proposes the full task order
  (order = priority); then starts the confirmed top task in the same chat. Also on
  /backlog-management. Not for one chosen defect (debug) or task-board UI work (tasks feature).
disable-model-invocation: false
---

# backlog-management

Use when **router** finds no active thread work and no substantive request, or the owner runs `/backlog-management`.

**Backlog SSOT:** `src/config/app-tasks.json` (active, order = priority) + `src/config/app-tasks-archive.json`. Shape, `links` and status vocabulary: `src/features/tasks/README.md` § Task shape and status vocabulary. Signal contract: `documentation/DOC_ERROR_LOGGING_CONTRACT.md`.

User-test gate: `.cursor/rules/agent-behavior/RULE.mdc` § Success Validation. Landing and production timing: `.cursor/rules/git-workflow/RULE.mdc` § Mode behavior table.

## Configure

Fill once per fork; read at the start of every run.

| Setting | Value | Notes |
|---------|-------|-------|
| **Signals** | on when **both**: Supabase is configured (`.env`) **and** Supabase MCP answers for each project below | Otherwise run tasks-only: steps 1–2 on tasks and git evidence, skip 3–4. Never block on a missing MCP. |
| **Projects** | `production: <project ref>`; optional `staging: <project ref>` | Single-project forks list production only. `local_dev` rows land in whichever project local `.env` points at. |
| **Feedback `app_id`** | `app` (or the fork's `VITE_APP_ID`) | Filter for `app_feedback`. |
| **Write mode** | `mcp` (default) \| `migration` \| `handoff` | How signal status changes ship (step 3). |
| **Evidence branch** | the repo's default branch | Per the Mode behavior table **daily branch** / **how work lands** rows. |

**Write mode rules:**

- `mcp`: run the `UPDATE` through Supabase MCP on the project the signal belongs to. Confirm the target project with the owner before writing **production**. List every changed hash / id in the commit message of the run.
- `migration`: write `supabase/migrations/<UTC YYYYMMDDHHMMSS>_backlog_sync.sql` with the statements below; it lands with the run's commit and reaches each project with normal migration deploys.
- `handoff`: never write. Print the SQL for the owner to run.

## Signals and statuses

| Signal | Open | Agent writes | Admin terminal |
|--------|------|--------------|----------------|
| `error_logs` (cluster by `hash`) | `open` (`muted` = parked) | catch-up `resolved`; finish `review` | `resolved` |
| `app_feedback` | `open` | catch-up `handled`; finish `review` | `handled` / `dismissed` |

- `review` = an agent shipped a fix and the admin checks it ("resolved in next release"). The admin moves it to the terminal status. Never write `completed` (submitter-only).
- A `review` / `resolved` cluster that recurs on a **different app version** reopens to `open` on its own (`upsert_error_log`).
- `review` rows are the admin's queue: do not move them.

## Flow

### 1) Read

- Tasks: active + archive JSON (the archive is read here only, as evidence).
- Signals (when on), per project, projected columns only, never `SELECT *`:
  - `error_logs` where `status IN ('open','review')` ordered by `last_seen_at DESC` limit 200: `hash, message, type, context, environment, status, count, app_version, last_seen_at`.
  - `app_feedback` where `app_id = <app_id> AND status IN ('open','review')` ordered by `created_at DESC` limit 200: `id, created_at, body, status, environment, context`. Leave `user_email` out unless the owner asks.
- Evidence: `git log --oneline` on the evidence branch since the oldest open signal (or the oldest active task), `CHANGELOG.md` / the version source per the Mode behavior table, the task archive.

### 2) Catch up

For each active task and each open signal, decide from evidence:

- **Clearly landed** (code on the evidence branch; changelog or archive names the fix): archive the task (move the whole row incl. `links`, `status: done`, one-line reason appended to `description`). Queue linked or matching error hashes → `resolved`, feedback ids → `handled`.
- **In doubt:** investigate (read the code path; compare `last_seen_at` and `app_version` with the fix commit; a cluster still firing on the fixed version is not fixed).
- **Still in doubt:** update only the task description to the real state. Leave signal statuses unchanged.
- **Onboarding tasks** (seeded by `start`: Supabase, hosting, vision, theme) are never archived or reordered here; `start` and `finish` § Onboarding task sync own them.
- **Production follow-up:** `finish` leaves production signals open until the fix reaches production (Mode behavior table **production** row: the PR is merged, or the promotion ran). Once the evidence shows that, move those linked production signals to `review` (not `resolved`).

No cap: finish the whole pass.

### 3) Write signal statuses (when anything is queued)

Per **Write mode**. Statements are replay-safe; at most 200 values per `IN` list (split longer lists):

```sql
-- Backlog catch-up <date>: <one line per group, why>
UPDATE public.error_logs SET status = 'resolved'
WHERE hash IN ('<hash>') AND status IN ('open', 'muted');

UPDATE public.app_feedback SET status = 'handled'
WHERE id IN ('<uuid>') AND status = 'open';
```

Hashes are shared across projects on purpose; feedback ids from another project no-op.

### 4) Connect

For each signal still open:

- Matches an existing task → add the link to that task (`{ "kind": "error", "hash" }` or `{ "kind": "feedback", "env", "id" }`). Check no active or recent archived task already links it.
- Orphan → draft one suggested task per root cause (title, description, links). Several hashes with one cause share one task.

Suggested tasks are written only after the owner accepts them in step 5.

### 5) Prioritize (order = priority)

Rank every active task plus suggestions by user impact × frequency × recency, cheapest high-value first. Onboarding tasks keep their place.

1. Show the full proposed order with a one-line reason per moved row.
2. Ask with **AskQuestion** (multiple choice) before setting a new **top** task: the proposed top first (Recommended), the next 1–2 contenders, and "keep current order".
3. One confirm covers the whole order and the accepted suggestions. Nothing moves before it.
4. A task already `in-progress`: still run the full catch-up and order, then ask whether to leave it. Default: continue it.

Write the JSON after the confirm (dev API `/__dev/tasks` or a direct file edit; same validation either way).

### 6) Hand off

Set the confirmed top task `in-progress` and start it in the same chat:

- Runtime defect with signals → `debug` (signal ref = the linked hash / feedback id).
- Small change → `quick-piv`. Larger → `plan`.

At `finish`, linked errors and feedback go to `review` (`finish` § Backlog review handoff).

## Output

Short report: archived tasks (title, reason), signal status changes (counts per status and project, write mode used), new links, accepted order, the task now started.

## Boundaries

| Use this | Not this |
|----------|----------|
| Grooming the whole backlog against evidence and signals | `debug` — one chosen defect |
| Linking signals to tasks, ordering | `finish` — archiving the task this session completed |
| Signal status catch-up | Admin pages — human triage (`/admin/errors`, `/admin/feedback`) |

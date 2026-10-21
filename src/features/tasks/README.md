# Dev task backlog (`/tasks`)

In-repo development backlog for coding agents and local UI.

## Purpose

- Dev-only task board at `/tasks` for onboarding and agent work
- SSOT for active and archived tasks in JSON files
- Pre-seeded onboarding checklist on fresh clones (Supabase, Hosting, App vision, Theme)

**Intentional exception:** This feature uses local React state + `fetch` (not TanStack Query) because it is a dev-only tool backed by the Vite dev plugin, not user-facing server state.

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| Components | `components/` | `TasksBacklogPanel`, `ActiveTaskList`, `ArchiveTaskList`, task rows, `TasksAutosaveIndicator`, `TasksListEmptyState`, `taskStatusUi`, `DevTasksFab` |
| Hooks | `hooks/` | `useAppTasksBacklog` — CRUD, reorder, archive/restore, dirty-aware text autosave |
| Services | `services/` | `appTasksDomain` (validation/logic), `appTasksApiService` (HTTP to dev API) |
| Types | `types/` | `AppTask`, `ActiveTaskStatus`, file path constants |

**Config SSOT:** `src/config/app-tasks.json` (active), `src/config/app-tasks-archive.json` (done).

## Task shape and status vocabulary

`AppTask`: `{ title, description, status, links? }`.

- **Order = priority:** file order of the active list is the work order.
- **`status`:** `to-do` | `in-progress` (active file) and `done` (archive only). Extra roles live in the text: `needs-info` → description section `Waiting on:`; human-only → `HITL` in title or description; won't fix → archive with `wontfix: <reason>`; type or priority → title prefix `[bug]`, `[enhancement]`, `[P0]`.
- **`links`** (optional, omitted when empty): runtime signals the task covers. `{ "kind": "error", "hash": "<cluster hash>" }` (same in every environment) or `{ "kind": "feedback", "env": "staging" | "production", "id": "<uuid>" }`. Many per task. Archive and restore keep links. Catch-up, linking and ordering: `.agents/skills/backlog-management/SKILL.md`.
- **Headless agents** edit the JSON directly (validated by `services/appTasksDomain.ts`, same parser the dev API uses). Land backlog changes with the normal commit flow; never a dedicated bot commit.

**Dev API (Vite serve only):** `vite-plugin-dev-tasks.ts` — `/__dev/tasks`, `/__dev/tasks/archive`, `/__dev/tasks/restore`.

**UI entry:** `DevTasksFab` (floating pill `Button` link) on all routes in dev; route `/tasks` with minimal chrome (card rows, toolbar autosave chip, no column headers).

**Bundle:** Task UI components import kit components from `src/components/common/` and icons from `lucide-react` (named, tree-shaken imports) to keep the lazy `/tasks` chunk lean in dev and production.

## User feedback policy

- **Mutation/async errors:** single fixed top `Alert` via `TasksFeedback` (tasks pattern is SSOT for non-form mutations).
- **Initial load failures:** same feedback path via `reloadForView` try/catch.

## Testing

Colocated `*.test.ts` under `services/`; shared wrappers in `tests/test-utils.tsx`. See `documentation/DOC_TESTING.md`.

## Dependencies

- `vite-plugin-dev-tasks.ts` (project root)
- shadcn/ui kit (`src/components/common/`), lucide-react, dnd-kit (reorder). Styling uses theme token utilities only (`elevation-*`, `duration-(--duration-*)`, color tokens), so rows follow the active theme and light/dark mode.
- Agent skills: `.agents/skills/start/SKILL.md`, `router`, `finish` for task sync

## Onboarding

Fresh clones ship four pre-seeded tasks in `app-tasks.json`. Agents sync status at session boundaries per start/router/finish skills.

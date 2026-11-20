#!/usr/bin/env bash
# Fixture for this case: sources the shared scaffold (meta-write-skill/scripts/eval-scaffold.sh,
# copied into the eval plugin by run-evals.sh), then sets up the situation the prompt assumes.
source "$(dirname "$0")/../../lib/eval-scaffold.sh"
csv_lap "CSV serializer for title and status" done checkout done
csv_built
# The mistake signal the lesson starts from. The defect is no longer in the tree (the lap fixed it);
# `pnpm lint` and `pnpm arch:check` pass with it, and one more entry in the feature-components
# `no-restricted-imports` group in eslint.config.js ('@/shared/services') turns it into a lint error.
cat >> documentation/jobs/temp_job_tasks-csv-export/DEVELOPMENT_PLAN.md <<'MD'
- Mistake (phase 1): the new `src/features/tasks/components/TasksExportButton.tsx` imported `isSupabaseConfigured` from `@/shared/services/supabaseService` to disable the button. `pnpm lint` and `pnpm arch:check` both passed; the owner's review caught it. Fix: the hook `useAppTasksBacklog` now exposes the flag and the component file is gone (the button lives in `TasksBacklogPanel`). Lesson → enforce?
MD
commit_all "feat(tasks): csv export (phases 2-3)"

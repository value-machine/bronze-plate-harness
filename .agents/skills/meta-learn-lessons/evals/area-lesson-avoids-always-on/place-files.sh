#!/usr/bin/env bash
# Fixture for this case: sources the shared scaffold (meta-write-skill/scripts/eval-scaffold.sh,
# copied into the eval plugin by run-evals.sh), then sets up the situation the prompt assumes.
source "$(dirname "$0")/../../lib/eval-scaffold.sh"
csv_lap "CSV serializer for title and status" done checkout done
csv_built
# The mistake signal the lesson starts from: a fact about one feature, which no existing check can hold.
cat >> documentation/jobs/temp_job_tasks-csv-export/DEVELOPMENT_PLAN.md <<'MD'
- Mistake (phase 3): the export fetched the tasks again through `appTasksApiService` and assumed the request knows what the board shows. It doesn't: which list is visible (active / archive) is local state in `useAppTasksBacklog` (`view`), and no request carries it. The CSV held active tasks while the owner looked at the archive. Fix: the export takes the visible list from the hook.
MD
commit_all "feat(tasks): csv export (phases 2-3)"

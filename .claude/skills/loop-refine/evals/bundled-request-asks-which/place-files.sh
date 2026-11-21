#!/usr/bin/env bash
# Fixture for this case: sources the shared scaffold (meta-write-skill/scripts/eval-scaffold.sh,
# copied into the eval plugin by run-evals.sh), then sets up the situation the prompt assumes.
source "$(dirname "$0")/../../lib/eval-scaffold.sh"
top_task "Export tasks to CSV and email reminders for overdue tasks" "Users want to download their task list as a CSV file, and they want an email when a task is overdue."
commit_all "chore(tasks): queue bundled request"

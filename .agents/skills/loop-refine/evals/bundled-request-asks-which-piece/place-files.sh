#!/usr/bin/env bash
# Fixture: a top backlog task that bundles three independent outcomes.
source "$(dirname "$0")/../../lib/eval-scaffold.sh"
top_task "Export tasks as CSV, add dark mode to the settings page, and show the app version in the profile menu" "Three things in one go: a CSV export button on the tasks panel, a dark mode toggle in settings, and the version from package.json in the profile menu."
commit_all "chore: bundled backlog task"

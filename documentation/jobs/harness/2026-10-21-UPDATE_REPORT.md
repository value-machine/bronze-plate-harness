# Harness update report — 2026-10-21

## Summary

- **Inbox cleared:** n/a (sources read in place from the MILA repo, read-only; nothing dropped in `.agents/harness-inbox/`)
- **Items:** 6
- **Applied:** 5 | **Rejected:** 1 | **Deferred:** 0
- **Job:** `documentation/jobs/temp_job_signal-backlog/` (plan, `DECISIONS.md` D1–D17)

## Disposition table

| # | origin | source | license | summary | overlap | disposition | target | decision | applied |
|---|--------|--------|---------|---------|---------|-------------|--------|----------|---------|
| 1 | TMI-apps/MILA | `.agents/skills/backlog-management/SKILL.md` | internal (same owner) | Backlog catch-up vs landed work + error/feedback signals, linking, ordering | `router` § App task backlog (first-to-do intake) | new skill; router intake delegates to it | `.agents/skills/backlog-management/SKILL.md`, `router` | owner D1, D2 | yes |
| 2 | TMI-apps/MILA | `.agents/skills/finish/SKILL.md` § Backlog review handoff | internal | Linked signals → `review` at finish | `finish` § App task backlog | merge into existing skill; mode-aware timing | `finish`, `bundle-ship` | owner D4; review amendment 6 | yes |
| 3 | TMI-apps/MILA | `.agents/skills/bugs/SKILL.md` | internal | Reproduce-and-fix one defect across environments | `debug` | rejected; signal intake merged into `debug` § Chat intake instead | `debug` | owner D4 | yes (debug slot) |
| 4 | TMI-apps/MILA | `.claude/rules/code-style.md` + `workflow.md` error-logging paragraphs | internal | Every runtime `console.error` pairs with central logging; review checklist | `code-style` § Error Handling, `workflow` checklist | merge into existing rules | `.cursor/rules/code-style`, `workflow`, `platform`, `database` | owner D1 | yes |
| 5 | TMI-apps/MILA | `documentation/DOC_ERROR_LOGGING_CONTRACT.md` | internal | Error logging contract | none | new permanent doc (owner approved) | `documentation/DOC_ERROR_LOGGING_CONTRACT.md` | owner 2026-10-21 | yes |
| 6 | TMI-apps/MILA | `docs/agents/issue-tracker.md`, `task-status.md` | internal | Backlog transport + status vocabulary | `src/features/tasks/README.md` | merged into the feature README (no `docs/agents/`) | `src/features/tasks/README.md` | clear-winner | yes |

## Notes

- Secret scan: pass (no keys or tokens in the copied guidance).
- MILA-only wording removed: `app_id = 'mila'`, Lane A, `db:push-staging`, changesets / `changelog-public`, `bugs` / `bug_error_hashes`, drift-audit task, Dutch copy, `develop` as fixed evidence branch, `scripts/dev-tasks/` paths.
- Protected writes (owner request "ingest … ask me on forks", 2026-10-21): `.agents/skills/{backlog-management,router,finish,bundle-ship,debug,start}/SKILL.md`, `.cursor/rules/{code-style,workflow,platform,database}/RULE.mdc`, `eslint.ignores.js` (owner OK).

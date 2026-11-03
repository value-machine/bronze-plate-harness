# Decisions — temp_job_feedback-hooks

Job: `temp_job_feedback-hooks`
Updated: 2026-11-03

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D2 | Tool invocation on Windows | closed | Node API / `node node_modules/...` (no pnpm spawn) | loop-refine | clear winner: avoids `.cmd` shim spawn and ~1 s pnpm overhead; alt: `pnpm exec` |
| D3 | Stop loop guard | closed | skip when tree fingerprint unchanged since last pass; on `stop_hook_active` with the same failure fingerprint, allow stop | loop-refine | clear winner over relying on the 8-cap alone |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|
| D1 | Which hooks | open | (a) PostToolUse lint+format / (b) Stop type-check+tests / both | plan |

## Log

- 2026-11-03 — D2, D3 closed via loop-refine (clear-winner)

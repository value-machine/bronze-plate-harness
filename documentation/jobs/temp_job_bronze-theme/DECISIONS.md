# Decisions — Bronze default theme

Job: `temp_job_bronze-theme`
Updated: 2026-10-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Replace vs add | closed | Bronze **replaces** the current magenta/pink default in `src/index.css` (`:root` light + `.dark`). No magenta preset is kept. | plan-grill | clear-winner. Request says "restyle the default app". Lost: (B) keep magenta as a named alternative preset (no consumer; a second built-in palette pair is a runtime-theming D7 deferred non-goal); (C) bronze as an `applyTheme()` override example only (default stays magenta; does not restyle the app). |
| D2 | Where the work lands | closed | Session branch `claude/exciting-clarke-oz8liv`, so it rides open PR #7 (runtime theming) unless #7 merges first; then a fresh branch from `main` | plan-grill | clear-winner. The session is pinned to that branch. Bronze only touches token values, which #7 introduced. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-20 — D1, D2 closed via plan-grill (clear-winner)

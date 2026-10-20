# Decisions — Bronze default theme

Job: `temp_job_bronze-theme`
Updated: 2026-10-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Replace vs add | closed | Bronze **replaces** the current magenta/pink default in `src/index.css` (`:root` light + `.dark`). No magenta preset is kept. | plan-grill | clear-winner. Request says "restyle the default app". Lost: (B) keep magenta as a named alternative preset (no consumer; a second built-in palette pair is a runtime-theming D7 deferred non-goal); (C) bronze as an `applyTheme()` override example only (default stays magenta; does not restyle the app). |
| D2 | Where the work lands | superseded by D4 | Session branch `claude/exciting-clarke-oz8liv`, so it rides open PR #7 (runtime theming) unless #7 merges first; then a fresh branch from `main` | plan-grill | clear-winner. The session is pinned to that branch. Bronze only touches token values, which #7 introduced. |
| D3 | How far the restyle goes | closed | **Full identity**: bronze palette (light + dark) + metallic finish on the primary button + new font(s) + new corner style | plan-grill | Owner picked option 3. Lost: palette only; palette + metallic finish (agent recommendation); bronze as material (textures/emboss). |
| D4 | Where the work lands (replaces D2) | closed | PR #7 merged (`c4ce5c1`, includes DTCG tokens). Session branch `claude/exciting-clarke-oz8liv` restarted from `main`; bronze is a new PR. Values change only in `src/shared/theme/tokens/*.tokens.json` (+ font loading in `index.html`) | plan-grill | clear-winner: merged PRs are not reused; DTCG files are the token SSOT (`temp_job_dtcg-tokens` D2). |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-20 — D1, D2 closed via plan-grill (clear-winner)
- 2026-10-20 — D3 closed (owner); D4 closed via plan-grill (clear-winner), supersedes D2

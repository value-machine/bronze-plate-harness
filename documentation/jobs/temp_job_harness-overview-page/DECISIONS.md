# Decisions — harness-overview-page

Job: `temp_job_harness-overview-page`
Updated: 2026-10-26

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Format of the public page | closed | Static `public/harness.html` (clear-winner) | loop-refine | Rejected: React page under `pages/` or a feature (client-rendered so weaker for search, needs feature README + layer rules, ships as product code in every fork). `public/*.html` is already whitelisted; a real asset wins over the SPA fallback in `wrangler.jsonc`. |
| D2 | README image format | closed | PNG at `public/harness-overview.png` (clear-winner) | loop-refine | Rejected: SVG (web fonts do not load when GitHub shows it as an image), Mermaid (loses the design), inline HTML (GitHub strips it). `public/*.png` is whitelisted. Same file serves as the share-preview image. |
| D3 | Fonts on the static page | closed | Keep Google Fonts with system fallbacks (clear-winner) | loop-refine | Rejected: system-only (flatter result). `index.html` already loads Google Fonts, so no new external service. |
| D4 | PNG regeneration | closed | One-off screenshot of the page with the preinstalled Chromium; no script, no new dependency (clear-winner) | loop-refine | A repo script would add Playwright to `package.json` (stop-list: new dependency), so a regen script is deferred. |
| D5 | Content ownership | closed | Page is a hand-written snapshot labelled with the harness version (clear-winner) | loop-refine | Rejected: generating it from `catalog.md` (new tooling, protected skill files). Drift risk accepted and noted in the brief. |
| D6 | Vision / recorded-decision conflicts | closed | None found (clear-winner) | loop-refine | `DOC_APP_VISION.md` is `DRAFT` (`vision-deferred`); no README or rule records a "no public pages" decision. |
| D7 | Where the live app shows the page | closed | A welcome card on the home page (`/`), shown to signed-out and signed-in visitors on the preview URL and on the first local run, linking to `/harness.html` | owner | Owner message: users should stumble on it on the preview URL and after first setup. Rejected: redirecting `/` (the Google sign-in return lands on `/`, #29), iframe of the static page (double scroll, fixed height on phones), React copy of the content (drift), footer or profile-menu link (not seen on first open). |
| D8 | Home integration shape | closed | New feature `src/features/harness-overview/` (one card component, README; no barrel); `HomePage` renders it; sign-in controls stay on the first screen (clear-winner) | loop-refine | Pages stay thin (architecture rule); one bounded concept. The card shows the PNG preview and one button, with no copied content. |
| D9 | How a fork removes it | closed | Delete the feature folder and its one line in `HomePage`; no config flag (clear-winner) | loop-refine | Rejected: a flag (extra code and a third state). A new onboarding task, 'Remove the harness overview card', carries the step. |

## Open

_None._

## Log

- 2026-10-26 — D1–D6 closed via loop-refine (clear-winner)
- 2026-10-26 — D7 closed via owner message; D8, D9 closed via loop-refine (clear-winner)

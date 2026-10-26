# Brief — Show the harness overview on the app's home page and README

Task: Show the harness overview on the app's home page and README · Lap: temp_job_harness-overview-page · Harness: v0.43.0

## Problem
People who find the repo (GitHub, Google) or open a fresh preview or first local run see no explanation of the agent harness, so its loop, skills and guardrails stay invisible to non-technical users.

## Success check
After `pnpm build`, `dist/harness.html` and `dist/harness-overview.png` exist; the home page (`/`) renders a card whose button links to `/harness.html` for both signed-out and signed-in users; the first image in `README.md` is `public/harness-overview.png` linking to the same page; and `pnpm validate:structure`, `pnpm lint`, `pnpm type-check` and `pnpm arch:check` pass.

## In scope
- `public/harness.html`: self-contained, theme-aware flowchart page (the designed overview: loop stages, helper skills, guardrails, upkeep skills), with title, meta description and share-preview tags, labelled with the harness version.
- `public/harness-overview.png`: screenshot of that page, used by the README, the home card and share previews.
- `src/features/harness-overview/`: one card component (PNG preview, short line, one button to `/harness.html`) and a feature `README.md`; no barrel (pages import feature components directly, as `HomePage` does for `SignInPanel`). Rendered by `HomePage` for every visitor; sign-in controls stay on the first screen on phones.
- `README.md`: the PNG near the top, linking to `/harness.html` (and a plain text link for the live URL once known).
- `documentation/DOC_INDEX.md` row and a one-line `ARCHITECTURE.md` mention.
- Backlog: this task, plus the to-do 'Remove the harness overview card before launching your product' (already added).
- Hand-off to the owner (not repo work): set the GitHub repo's Website field to the live `/harness.html` URL and upload the PNG as the social preview image, with direct links.

## Out of scope
- Will NOT do: a script to regenerate the PNG — deferred (needs Playwright as a dependency, stop-list).
- Will NOT do: `robots.txt` or a sitemap — deferred.
- Will NOT do: generating the page from the skill catalog — excluded for now (drift accepted, versioned label instead).
- Will NOT touch: auth flow, the Google sign-in return to `/` (#29), Topbar, ProfileMenu, `SignInPanel`.
- Will NOT touch: `wrangler.jsonc`, `.agents/skills/**`, `.claude/rules/**`, `projectStructure.config.cjs` (the whitelist already allows `public/*.html` and `public/*.png`).

## Edges
| Feature area | Loop today | Hook point | Ride / new |
|---|---|---|---|
| `public/` static assets | Vite copies files to `dist/`; Worker serves real assets before the SPA fallback | add `harness.html`, `harness-overview.png` | new — whitelisted, no code |
| Home page (`src/pages/HomePage.tsx`) | `/` shows sign-in panel (signed out) or a welcome line (signed in); also the Google sign-in return target | render the new card above the existing content | ride — one added line |
| New feature `harness-overview` | Not found | card component + README | new — one bounded concept, deletable |
| Root docs (`README.md`, `ARCHITECTURE.md`, `documentation/DOC_INDEX.md`) | Text only | image and links | ride |
| Dev task backlog (`src/config/app-tasks.json`) | Tasks board reads it | two task rows | ride |

Overrun rule (skill-loop D51): a diff that touches a feature area **not** in this table stops the lap.

## Size
S — one new tiny feature, one page edit, two static assets and doc links; no migration, no auth or data change.
Cut into laps: none

## Requirements
Not needed (size S).

## Decisions
`DECISIONS.md` D1–D9, all closed. D7 is the owner's message (card on the home page). Risks to check in `loop-plan`: Worker serves `/harness.html` ahead of the SPA fallback; the card respects light and dark themes and the kit components (`Card`, `Button`); the PNG is lazy-loaded and small enough not to slow the sign-in screen.

## Plan

Size S, short plan. Acceptance tests (written first, failing): `src/features/harness-overview/components/HarnessOverviewCard.test.tsx` (link to `/harness.html`, preview image) and `src/pages/HomePage.test.tsx` (card for signed-out and signed-in visitors). The build and structure checks in the Phase 4 gate cover the static assets and README.

### Conflict & compliance

- Applicable rules: `architecture` (page → feature component, pages stay thin), `file-placement` (static files in `public/` match the whitelist; feature needs `README.md`), `code-style` § Naming (role name `HarnessOverviewCard`, no duplicate yet), `testing` (colocated tests, `should … when …`), `security` (static page has no secrets and one tiny inline script), `git-workflow` (Model C: PR to `main`, conventional title, `## Preview` section in the PR body).
- File placements: `public/harness.html`, `public/harness-overview.png`, `src/features/harness-overview/{README.md,components/HarnessOverviewCard.tsx,components/HarnessOverviewCard.test.tsx}`, `src/pages/HomePage.test.tsx`. Confirm with `pnpm validate:structure`.
- Reuse / packages: `spec-reuse-package` skipped (no generic subsystem). Reuses kit `Card` and `Button asChild` (same link-button pattern as `DevTasksFab`), and `renderWithProviders` / `createDefaultAuthContextValue` in tests.
- Foundation cleanup: none. `HomePage` gets one line; nothing shallow or duplicated on the path.
- Risks: (1) `/harness.html` must be served ahead of the SPA fallback (verify with a `vite build` listing and a local `vite preview` request); (2) the card must not push the sign-in button off the first phone screen (lazy PNG, short height, `object-cover object-top` crop); (3) README link target: use the live URL only after it answers HTTP 200, else link the PNG; (4) `og:image` needs an absolute URL, so it is left out (deferred until the production domain is known).
- Standards diversions: none. Pattern precedent: a welcome card linking to docs is the common starter-app pattern, so no precedent review (not a material design).

### Phases

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Static page and PNG | `ls public` shows both files; page opens in Chromium with no console errors in light and dark | Done |
| 2 | Feature card and home integration | Acceptance tests green; `pnpm lint`, `pnpm type-check`, `pnpm arch:check`, `pnpm validate:structure`, `pnpm validate:feature-docs:strict`, `pnpm validate:feature-size` | Done |
| 3 | README, docs, version label | `pnpm validate:docs`; README image resolves to `public/harness-overview.png` | Done |
| 4 | Whole-lap verification | `pnpm build` then `ls dist/harness.html dist/harness-overview.png`; `pnpm test:run`; phone-width screenshot of `/` shows the sign-in controls and the card | Done |

1. **Phase 1.** Port the artifact page to `public/harness.html` as a full document: `lang`, charset, viewport, title, meta description, `twitter:card` summary, "Harness v0.43.0" label, a "Back to the app" link to `/`, and a small inline script that applies the app's saved `color-mode` (`light` / `dark` / `system`) before paint. Screenshot it with the preinstalled Chromium to `public/harness-overview.png` (light, 880px wide, full page). No script or dependency is added (D4).
2. **Phase 2.** Add `HarnessOverviewCard.tsx` (kit `Card` full width up to the form width, preview `<img loading="lazy">` with alt text, one `Button asChild` anchor "See how the harness works" to `/harness.html`) and the feature `README.md` (Purpose, Structure, Dependencies; says how to delete it, D9). Render it from `HomePage` for every visitor, above the existing content, and make the two acceptance tests pass.
3. **Phase 3.** Add the PNG, linked, below the intro paragraph of `README.md`; add the `DOC_INDEX.md` row and one `ARCHITECTURE.md` line.
4. **Phase 4.** Run the Phase 4 gate; then hand off to `loop-check`.

### Notes during development

- The live production URL answers HTTP 200 for `/harness.html` today, but with the SPA's `index.html` (title 'Plate Harness'), because the page is not deployed yet. The README therefore links the image to the PNG, not to a live URL. After the merge, check `https://bronze-plate-harness.tom-fab.workers.dev/harness.html` shows the title 'Plate Harness Overview'.
- `vite preview` of the build serves `/harness.html` (title 'Plate Harness Overview') ahead of the SPA fallback; the Google sign-in button sits at y=432 on a 390x780 phone, so sign-in stays on the first screen in light and dark.
- The preview PNG is light-only, so it shows as a light thumbnail in dark mode. It is 328 KB and lazy-loaded.
- `pnpm lint` shows 20 pre-existing warnings, none in this lap's files. `pnpm arch:check` reports one pre-existing info row (`themeTokens.ts` orphan).

### Decisions made

- Link the README image to `public/harness-overview.png` rather than to a not-yet-live URL.
- Leave `og:image` out of the static page (needs an absolute URL; deferred until the production domain is final).

## Change round 1 (owner verdict at Stop 2: Change)

Feedback: the overview should be part of the app and styled in the bronze theme; expanding the theme tokens is allowed. This section replaces the static-page parts of the brief above (D12–D15 in `DECISIONS.md`).

- **Now in scope:** route `/harness` (`src/pages/HarnessOverviewPage.tsx`, lazy-loaded in `src/App.tsx`) rendering `HarnessOverviewView` from the `harness-overview` feature (content as data, `HarnessLoopStage`, theme tokens only); the home card links to `/harness` with a router link; `public/harness-overview.png` is a fresh screenshot of the route; `public/harness.html` is deleted.
- **Success check now:** `/harness` renders every skill folder in `.agents/skills/` (guarded by `harnessOverviewContent.test.ts`) in the bronze theme in light and dark; the card links to `/harness`; the pre-existing checks still pass.
- **Edges added:** `src/App.tsx` (one route), `src/pages/` (one page). Size stays S: presentational components and data, no migration.
- **Done in this round:** acceptance tests written first (card link, page content, content drift); `pnpm build`; phone and desktop screenshots in light and dark with no console errors.

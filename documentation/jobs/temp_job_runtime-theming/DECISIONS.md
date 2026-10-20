# Decisions — Runtime theming (app-wide customizable styling)

Job: `temp_job_runtime-theming`
Updated: 2026-10-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | What drives per-login restyling | closed | Boilerplate provides the mechanism only; no specific policy. Org branding, user preference, and org-then-user must all be buildable on top. | grill-me | Owner: the three expectations (dark mode in a few lines, global radius via theme, restyle per login) illustrate flexibility needs of apps built on this boilerplate, not features to ship now. |
| D2 | What the boilerplate ships as reference | closed | Mechanism (token contract, runtime `applyTheme` API, radius fully token-driven, docs) **plus** a light palette next to the dark one and a toggle that remembers the choice per device | grill-me | Owner picked both. Deferred non-goal: example that loads a theme from the logged-in user's profile (per-login path stays possible via the API, not demoed). Rejected: CSS-only `data-theme` blocks without a JS API (can't apply arbitrary per-org values). |
| D3 | First-visit mode | closed | Follow the OS (`prefers-color-scheme`); toggle offers Light / Dark / System | grill-me | Rejected: dark by default; per-app configurable default; no visible toggle. |
| D4 | What a theme may change | closed | Colors (incl. gradient), typography (font families: body, heading, mono), radius, spacing density (`--spacing`), shadows, motion (duration/easing). Not themeable: breakpoints, z-index, type scale (Tailwind default). | grill-me | Owner picked brand+density+effects, asked if complete vs MUI's theme; agent mapped every MUI section (palette, typography, spacing, shape, shadows, transitions themeable; breakpoints are build-time and z-index is structure). Per-component overrides decided separately (D5). |
| D5 | Per-component restyling | closed | A few component tokens (e.g. `--button-radius`, `--card-radius`), each defaulting to the shared token; typed list, grows only when a real need appears | grill-me | Owner chose after shadcn research + pros/cons matrix. Rejected: global-only (no brand-specific shapes), full MUI-style overrides (against shadcn's own-the-source model), structure-as-code only (weak for per-login brands). |
| D6 | Where a theme is authored | closed | CSS-first: built-in light/dark palettes in `src/index.css` (`:root` / `.dark`, shadcn convention); a typed token-name list in TS is the single contract; `applyTheme()` accepts only those names; a unit test checks every name is defined in both palettes | grill-me | Owner asked for agent recommendation. Rejected: TS-first theme file (needs anti-flash inline script, breaks shadcn preset paste), DTCG JSON + build step (tooling cost for a boilerplate). |
| D7 | Runtime brand × light/dark | closed | Deferred. v1 `applyTheme(partialTokens)` overrides tokens on top of the active mode (covers accent-only brands). Per-mode brand palettes and mode-locking brands are deferred non-goals until a real app needs them; additive later, no API break. | grill-me | Owner: most apps (≈9/10) won't use per-login branding; per plan-grill § Generality no speculative machinery. |
| D8 | Toggle placement | superseded by D11 | 'Appearance' item (Light / Dark / System) in the profile avatar menu; works signed in or out | grill-me | Rejected: top-bar icon button, both, no toggle (would reverse D2). |
| D9 | Avoiding a wrong-theme flash on load | closed | Tiny inline script in `index.html` sets the `.dark` class from the stored choice / OS before first paint (next-themes pattern) | plan-grill | clear-winner. Lost: CSS-only `@media (prefers-color-scheme)` (duplicates the dark palette and cannot honor a stored manual choice); React effect only (visible flash for users whose choice differs from the OS). |
| D10 | Which palette is the base | closed | `:root` = light, `.dark` = dark (shadcn convention); current brand palette moves to `.dark` unchanged; light palette keeps brand primary/secondary/gradient on light surfaces | plan-grill | clear-winner. Lost: dark as `:root` with a `.light` class (breaks shadcn presets and its `dark:` variant). Light values are agent-chosen starting values, tweakable in `index.css`. |
| D11 | Mode control (replaces D8) | closed | One icon button in the top bar that cycles Light → Dark → System; icon shows the current mode; hover text (tooltip + accessible name) says `Theme: <current> (click for <next>)`. No Appearance radios in the profile menu. | owner | Owner, mid-implementation: "way cleaner, just one icon that cycles, only hover text". Uses the kit's Radix `Tooltip`. Not on `/tasks` (no top bar there). |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-20 — D1 closed via grill-me (asked)
- 2026-10-20 — D2 closed via grill-me (asked)
- 2026-10-20 — D3 closed via grill-me (asked)
- 2026-10-20 — D4 closed via grill-me (asked; scope completed by agent mapping)
- 2026-10-20 — D5 closed via grill-me (asked, after shadcn research and matrix)
- 2026-10-20 — D6 closed via grill-me (owner delegated; agent recommendation)
- 2026-10-20 — D7 closed via grill-me (deferred per owner: speculative consumer)
- 2026-10-20 — D8 closed via grill-me (asked)
- 2026-10-20 — D9, D10 closed via plan-grill (clear-winner)
- 2026-10-20 — D11 closed via owner instruction (supersedes D8)

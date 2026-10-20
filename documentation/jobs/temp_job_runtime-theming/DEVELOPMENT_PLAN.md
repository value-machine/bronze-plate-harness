# Development plan: Runtime theming (app-wide customizable styling)

## Summary

- **Goal:** Make the whole app restyleable from a theme: light/dark (Light / Dark / System, follows OS by default), one-token radius and density, themeable fonts/shadows/motion, a few component tokens, and a typed `applyTheme()` runtime override that a future per-login restyle can use.
- **Why:** Boilerplate users must be able to do dark mode in a few lines, change corner radius app-wide via the theme, and restyle per login without touching components (owner, `DECISIONS.md` D1).
- **Complexity:** M — several phases, cross-cutting styling across the kit, one new shared module, no backend.
- **Plan review:** Done 2026-10-20
- **Plan validate:** Done 2026-10-20
- **Scope / constraints:** Product decisions in sibling `DECISIONS.md` (D1–D10). No per-login policy, no profile-driven theme example, no per-mode brand palettes (deferred). No MUI-style component override layer. Breakpoints, z-index and type scale stay out of themes.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Token contract: full token set in `index.css` (light `:root`, dark `.dark`), typed token list, contract test | Contract tooling gate; app looks unchanged in dark | Done |
| 2 | Kit follows tokens: radius, component tokens, shadows, motion, overlay | Contract tooling gate; changing `--radius` / `--button-radius` visibly reshapes the kit | Done |
| 3 | Color mode: inline anti-flash script, `useColorMode`, Appearance item in profile menu | Contract tooling gate; Light / Dark / System switch works, persists per device, no flash on reload | Done |
| 4 | Runtime override: `applyTheme()` / `clearTheme()` | Contract tooling gate; unit tests; a manual override restyles live | Done |
| 5 | Docs: theming guide, README, ARCHITECTURE, code-style styling section | Docs validators green | Done (except rule edit) |

## Conflict & compliance

- **Applicable rules:** `architecture` (shared layer, stack ports), `file-placement` + `projectStructure.config.cjs`, `code-style` (styling scope section — SSOT for where styling lives; complexity limits; PascalCase/camelCase), `testing` (unit test for deterministic token contract), `agent-behavior` (protected files), `git-workflow` (mode `model-c`), `security` (inline script: static, no user input).
- **File placements (confirmed against whitelist, no config change):**
  - Tokens + palettes: `src/index.css`.
  - Theme module: `src/shared/theme/themeTokens.ts` (typed token-name list, `applyTheme`, `clearTheme`), `src/shared/theme/colorMode.ts` (mode type, storage key, resolve + apply class). Tests colocated: `src/shared/theme/themeTokens.test.ts`, `src/shared/theme/colorMode.test.ts`.
  - Hook: `src/shared/hooks/useColorMode.ts`.
  - Kit: extend `src/components/common/DropdownMenu/DropdownMenu.tsx` with radio group/item (+ sub-menu if used).
  - Profile menu: `src/layouts/ProfileMenu/AppearanceMenuItems.tsx` (new), wired in `ProfileMenuContent.tsx`.
  - Anti-flash script: inline in `index.html` (root file, not under `src/`).
  - Docs: `documentation/DOC_THEMING.md` (new, `DOC_` prefix per documentation whitelist — verify with `pnpm validate:structure`).
- **Names (name-the-mechanism):** role names, not caller names — `themeTokens`, `colorMode`, `useColorMode`, `applyTheme`, `AppearanceMenuItems`. One consumer each today; no extraction thresholds hit.
- **Reuse / packages (`dont-reinvent-the-wheel`):** `next-themes` considered for color mode — rejected: it targets Next.js/SSR, its value here is the anti-flash script + a hook (~40 lines), and the repo already owns tokens. Pattern copied (inline script + class on `<html>`), not the package. Token override = plain `style.setProperty` on `document.documentElement`; no library needed.
- **Risks / attention points:**
  - Tailwind v4 `@theme inline` maps utilities to variables at build time; runtime overrides work only for tokens exposed as CSS variables (all of ours). Shadows and fonts must move from literal values to variables for `applyTheme` to reach them.
  - Light palette contrast: brand magenta `#cf13b3` on white must meet WCAG AA for text/buttons; check with a contrast tool, adjust `--primary` for light only if needed.
  - Brand surfaces (`bg-brand-gradient`, `bg-foreground-sweep`) must read their colors from tokens so light mode works.
  - `rounded-full` pills become `--button-radius` (default keeps pills: `--button-radius: 9999px`) so today's look is preserved.
  - Inline script runs before React; must not throw when `localStorage` is unavailable (private mode) — wrap in try/catch.
- **Standards diversions:** none (shadcn convention for `:root`/`.dark`; next-themes pattern for anti-flash).
- **Open questions:** none.
- **Protected files:** `.cursor/rules/code-style/RULE.mdc` (styling section update in Phase 5) needs explicit user approval at that step. No other protected file is touched.

## Review contract

- **Rules pinned:** `rules@c3d2220` — `.cursor/rules/architecture/RULE.mdc`, `.cursor/rules/file-placement/RULE.mdc`, `.cursor/rules/code-style/RULE.mdc`, `.cursor/rules/testing/RULE.mdc`, `.cursor/rules/agent-behavior/RULE.mdc`, `.cursor/rules/security/RULE.mdc`
- **Required lenses:** Pattern & precedent (M), Reuse / packages, Feature decomposition (no new feature folder — shared theme module), Name the mechanism.
- **Tooling gate:** `validate` § Tooling pass (contract gate list) + `pnpm build`.
- **Locked decisions:** sibling `DECISIONS.md` (D1–D10) + **Decisions made** below + Amendments.

### Amendments

| # | Date | Source | Change | Applied to |
|---|------|--------|--------|------------|
| 1 | 2026-10-20 | review-dev-plan (tests) | `tests/setup.ts` gets a configurable `matchMedia` stub; add `src/shared/hooks/useColorMode.test.ts` (OS listener only while `system`, cleanup, storage-throws fallback) | Phase 3 |
| 2 | 2026-10-20 | review-dev-plan (delivery) | Gates compare against named Playwright baselines `scratchpad/theme/base-*.png` captured before Phase 1 | Phase 1, 2 gates |
| 3 | 2026-10-20 | review-dev-plan (scale) | Test that reads `index.html` and asserts the inline script uses the `colorMode.ts` storage key and mode values | Phase 3 |
| 4 | 2026-10-20 | review-dev-plan (a11y, adopted advisory) | Light palette: darker `--secondary`, `--success`, `--warning`, `--info` for AA; solid focus ring; scrollbar colors become `--scrollbar` tokens; `prefers-reduced-motion` zeroes motion tokens and brand-surface transitions | Phase 1 |
| 5 | 2026-10-20 | review-dev-plan (precedent, adopted advisory) | Mode switch sets `style.colorScheme`, briefly disables transitions to avoid cross-fade; cross-tab `storage` event sync | Phase 3 |
| 6 | 2026-10-20 | review-dev-plan (UX, adopted advisory) | Appearance uses Radix radio group (`menuitemradio` + `aria-checked`, visible check) and renders in all three menu states; tests cover all three | Phase 3 |
| 7 | 2026-10-20 | review-dev-plan (delivery) | Phases 1–5 land together in one PR (Phase 1's temporary `class="dark"` never ships alone) | All |
| 9 | 2026-10-20 | owner (D11) | Mode control becomes a cycling icon button with tooltip in the top bar (`src/layouts/Topbar/ColorModeToggle.tsx`); Appearance radios, `AppearanceMenuItems` and the dropdown radio primitives removed; amendment 6 no longer applies | Phase 3 |
| 8 | 2026-10-20 | validate plan-review (security) | No CSP today; document that a future CSP needs the inline script's hash | Phase 5 |

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | App-wide theme tokens with light/dark/system mode and runtime token overrides |
| **Precedents** | shadcn/ui theming (CSS variables, `:root`/`.dark`); next-themes (class on `<html>`, inline anti-flash script, system mode); GitHub / Vercel dashboards (Light / Dark / System in account menu) |
| **Aspects reviewed** | Token convention; mode default and persistence; toggle placement; runtime overrides; component-level customization |
| **Findings** | Tokens and `.dark` — aligns. Follow OS + 3-way choice persisted per device — aligns. Appearance in account menu — aligns (GitHub, Vercel). Runtime overrides via CSS variables on `<html>` — common in multi-tenant SaaS theming. Component tokens instead of an override layer — aligns with shadcn's own-the-source model. |
| **Verdict** | Aligns with precedent |

## Phase 1 — Token contract

**Goal:** every themeable value is a named CSS variable, defined for light (`:root`) and dark (`.dark`), with one typed list of names.

**Steps:**
1. `src/index.css`: move today's palette to `.dark` unchanged (D10); add a light palette in `:root` (white/neutral surfaces, brand primary/secondary/gradient, success/warning/info/destructive tuned for light; check AA contrast).
2. Add token groups to both blocks where values differ, else once in `:root`: fonts (`--font-body`, `--font-heading`, `--font-mono`), radius (`--radius` kept), density (`--spacing` override of Tailwind's base), shadows (`--shadow-sm|md|lg|xl`, `--shadow-brand`), motion (`--duration-fast|normal|slow`, `--ease-standard`), overlay (`--overlay`), component tokens (`--button-radius`, `--card-radius`, `--input-radius`) defaulting to shared tokens.
3. `@theme inline`: expose new tokens (`--font-sans: var(--font-body)`, `--font-heading`, `--font-mono`, shadow and motion mappings, `--radius-button` etc.) so utilities exist.
4. Brand utilities (`bg-brand-gradient`, `bg-foreground-sweep`) read only tokens.
5. `color-scheme`: `light` on `:root`, `dark` on `.dark`.
6. `src/shared/theme/themeTokens.ts`: `THEME_TOKENS` (readonly tuple of token names) + `ThemeTokenName` type.
7. `src/shared/theme/themeTokens.test.ts`: parses `src/index.css` and asserts every `THEME_TOKENS` name is defined in `:root`, and every color token is also defined in `.dark`.
8. Temporarily add `class="dark"` to `<html>` in `index.html` so the app keeps today's dark look until Phase 3.

**Gate:** contract tooling gate + `pnpm build`; screenshots match today's dark look.

## Phase 2 — Kit follows tokens

**Goal:** changing a token reshapes/recolors every kit component; no fixed literal styles left for themeable aspects.

**Steps:**
1. Button: `rounded-full` → `rounded-button` (default `--button-radius: 9999px` keeps pills); brand shadow → `shadow-brand`; transitions use motion tokens.
2. Card: `rounded-2xl` → `rounded-card`; shadows → shadow tokens; duration → motion token.
3. Input, Textarea, Select trigger: radius → `rounded-input`.
4. Modal overlay `bg-black/60` → `bg-overlay`; Modal/Card durations → motion tokens.
5. Topbar, tasks rows, feedback, Fab, menus, tooltip: shadows → shadow tokens; durations → motion tokens.
6. Headings use `font-heading`; `code`/`pre` use `font-mono`.
7. Lint rule check: no new raw colors.

**Gate:** contract tooling gate + `pnpm build`; manual check (Playwright screenshot) that overriding `--radius`, `--button-radius`, `--spacing`, `--primary` in devtools restyles the kit; dark look unchanged at defaults.

## Phase 3 — Color mode

**Goal:** Light / Dark / System, follows OS by default, persists per device, no flash.

**Steps:**
1. `src/shared/theme/colorMode.ts`: `ColorMode = "light" | "dark" | "system"`, storage key, `resolveColorMode(mode, prefersDark)`, `applyColorMode(resolved)` (toggles `.dark` on `<html>`), safe storage read/write.
2. `index.html`: replace the Phase 1 hardcoded `class="dark"` with a small inline script that reads the stored mode (fallback `system`) and the OS preference and sets `.dark` before paint (D9); try/catch around storage. Keep the logic identical to `colorMode.ts` (comment points to it).
3. `src/shared/hooks/useColorMode.ts`: returns `{ mode, resolvedMode, setMode }`; persists; listens to OS changes while `system`.
4. Kit: add `DropdownMenuRadioGroup` / `DropdownMenuRadioItem` (and `DropdownMenuSub*` if the submenu reads better) to `DropdownMenu.tsx`.
5. `src/layouts/ProfileMenu/AppearanceMenuItems.tsx`: "Appearance" with Light / Dark / System radio items; rendered in `ProfileMenuContent` for every state (signed in, signed out, not configured).
6. Tests: `colorMode.test.ts` (resolve + storage fallbacks); extend `ProfileMenu.test.tsx` — Appearance options visible and selecting one sets the mode.

**Gate:** contract tooling gate + `pnpm build`; browser: switch modes, reload keeps choice, `system` follows emulated OS change, no dark→light flash on reload (Playwright with `colorScheme` emulation).

## Phase 4 — Runtime override API

**Goal:** apps can restyle at runtime (e.g. per login later) with typed token overrides.

**Steps:**
1. `themeTokens.ts`: `applyTheme(overrides: Partial<Record<ThemeTokenName, string>>)` sets inline CSS variables on `<html>` (on top of the active mode, D7); `clearTheme()` removes them. Unknown names are a type error.
2. Unit tests: applies/clears only listed tokens; does not touch the `.dark` class.
3. No UI and no profile wiring (D2 deferred).

**Gate:** contract tooling gate; unit tests green; browser check calling `applyTheme({ primary: "#2563eb", radius: "0" })` from the console restyles live.

## Phase 5 — Docs

**Goal:** a developer can theme an app from the docs alone.

**Steps:**
1. `documentation/DOC_THEMING.md`: token list (from `THEME_TOKENS`), how to change a palette, add dark/light values, add a component token (the "real need" rule, D5), use `applyTheme`, and what is not themeable (D4).
2. README "Theme customization", `ARCHITECTURE.md` styling bullets, `documentation/DOC_INDEX.md` link.
3. `.cursor/rules/code-style/RULE.mdc` § Styling: point to `DOC_THEMING.md`, mention component tokens and modes — **protected file: ask for approval at this step**.

**Gate:** `pnpm validate:docs`, `pnpm validate:structure`.

## Notes during development

- Plan review ran as 3 parallel sub-agents (naming/rebel/scale, precedent/UX/tests, repo-rules validate); a worker restart interrupted two, whose checks (file placement, security, protected files, Tailwind v4 runtime-variable behavior) were completed inline by the planning agent. Not adopted: per-mode `<meta name="theme-color">` (no PWA/mobile chrome need yet).
- Tailwind v4: spacing and shadow utilities read `var(--spacing)` / `var(--shadow-*)` at runtime, so runtime overrides work for them; fonts are currently `@theme inline` literals and must become non-inline variable mappings.
- Phase 1: Tailwind v4 bakes `shadow-*` values in at build time (verified in built CSS), so shadows are `--elevation-*` tokens with `elevation-*` utilities that keep Tailwind's ring layering. Font tokens are `--body-font`, `--heading-font`, `--mono-font` (not `--font-*`) so `@theme inline` never emits a self-referencing variable. Gate: screenshots pixel-identical to the pre-change baseline on all 6 views.
- Phase 2: `cn()` now uses `extendTailwindMerge` so `elevation-*` and `rounded-{button,card,input}` resolve conflicts like built-ins (found via a screenshot diff on the dev Tasks button; covered by `cn.test.ts`). Gate: screenshots pixel-identical to baseline at defaults; live override of radius, button/card radius, spacing, primary, font and brand elevation restyles `/tasks` without reload. Badges and avatars keep `rounded-full` (circles/pills by design, not theme radius).
- Phase 3: the mode lives in `ColorModeProvider` (`src/shared/context/ColorModeContext.tsx`, same pattern as `AuthContext`) instead of a standalone `src/shared/hooks/useColorMode.ts`, because the Appearance items mount only while the menu is open and the mode must track OS/other-tab changes app-wide; `useColorMode` is exported from the context file. Tests: `colorMode.test.ts` (incl. index.html script sync), `ColorModeContext.test.tsx` (OS listener only in system, cleanup, cross-tab, storage-throws), `ProfileMenu.test.tsx` Appearance in all 3 states. `installMatchMediaMock` lives in `tests/test-utils.tsx`, installed per test in `tests/setup.ts`. Browser gate (Playwright, OS light/dark emulation): correct class before the bundle runs on both, pick Dark persists across reload, stored light wins over OS, system follows an OS flip.
- Phase 4: `applyTheme` / `clearTheme` in `themeTokens.ts`; unknown token names fail type-check (verified with a probe). `clearTheme` removes only theme tokens (other inline variables like `--status-w` stay).
- D11 change: toggle tested in `ColorModeToggle.test.tsx` (cycle order, persistence, tooltip text); browser check shows icon per mode, tooltip on hover, Light→Dark→System cycle with correct class.
- Phase 5: `documentation/DOC_THEMING.md` (tokens, common changes, runtime overrides, color mode, CSP note), README, ARCHITECTURE, DOC_INDEX and the "Configure Theme" onboarding task updated. The `.cursor/rules/code-style/RULE.mdc` styling-section update is protected and was not made; it awaits owner approval (current text stays accurate, it just doesn't mention modes/component tokens).

## Decisions made

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|
| 2 | Color mode state home | `ColorModeProvider` in `src/shared/context/` (not a hook in `shared/hooks/`) so it runs app-wide | Yes (`AuthContext`) |
| 1 | Plan review / validate acceptance | agent-accept 2026-10-20 — owner said proceed, fix the plan, implement fully without questions | n/a |

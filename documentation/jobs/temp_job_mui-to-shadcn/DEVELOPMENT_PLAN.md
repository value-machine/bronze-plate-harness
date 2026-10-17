# Development plan: MUI → shadcn/ui migration

## Summary

- **Goal:** Replace every MUI / Emotion usage with a shadcn/ui kit (Tailwind v4 + Radix + lucide), surface by surface, then remove `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`.
- **Why:** User request — move the UI kit to shadcn and drop the MUI dependency.
- **Complexity:** L — cross-cutting dependency swap (~40 files, theme, app shell, tests, docs).
- **Plan review:** Done 2026-10-17
- **Plan validate:** Done 2026-10-17
- **Scope / constraints:** Product decisions in sibling `DECISIONS.md` (D1–D20). Brand look preserved (D8). Each phase leaves the app building, tests green, and MUI + shadcn coexisting until Phase 5. No protected-file edits (D19). No changelog/version bump (`finish`).

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Foundation: Tailwind v4 + shadcn tokens + `cn()` + deps, coexisting with MUI | Contract tooling gate; `pnpm build`; app renders unchanged | Done |
| 2 | Kit primitives + auth surfaces (all `Button`/`Input` consumers) | Contract tooling gate; `SignInPanel` test green; login/home/reset render | Done |
| 3 | App shell + ProfileMenu (App, MainLayout, Topbar, PageLoadingState, QueryErrorBoundary, DevTasksFab, ProfileMenu/*) | Contract tooling gate; `ProfileMenu` test green; menu opens in browser | Pending |
| 4 | Tasks page + tasks feature components | Contract tooling gate; `/tasks` add / edit / reorder / status / archive / restore work | Pending |
| 5 | Remove MUI: theme files, providers, deps, vitest inline config, docs | `grep -r "@mui\|@emotion" src tests` empty; contract tooling gate; `pnpm build` | Pending |

## Conflict & compliance

- **Applicable rules:** `architecture` (layers, stack ports, feature granularity), `file-placement` + `projectStructure.config.cjs`, `code-style` (PascalCase components, complexity ≤10/15/100, double quotes), `testing` (existing tests are the behavioral contract), `agent-behavior` (protected files), `git-workflow` (mode `model-b`; see D20), `security` (no change — `target="_blank"` links keep `rel="noopener noreferrer"`).
- **File placements (all confirmed against whitelist, no config change):**
  - Kit components: `src/components/common/<Name>/<Name>.tsx` + `index.ts` — `Alert`, `Avatar`, `Badge`, `Button`, `Card`, `DropdownMenu`, `Input`, `Label`, `FormField`, `Modal` (Dialog), `Select`, `Separator`, `Spinner`, `Tabs`, `Textarea`, `ToggleGroup`, `Tooltip`.
  - `cn()`: `src/shared/utils/cn.ts`. Global CSS + tokens: `src/index.css` (whitelisted root src file).
  - Layout class constants: `src/shared/theme/appViewLayout.ts` (kept, D14). `defaultTheme.ts`, `theme.ts`, `themeLoader.ts` deleted in Phase 5 (D9).
  - Removed: `src/components/common/ProfileMenu/anchorMenuProps.ts`, `src/shared/hooks/useAnchorMenuState.ts` (D13).
- **Reuse / packages (`dont-reinvent-the-wheel`):** shadcn/ui itself is the reuse — vendored component source; deps `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`. No custom generic subsystem.
- **Risks / attention points:**
  - CSS precedence during coexistence: Tailwind emits into `@layer`s; Emotion injects unlayered styles, which win. MUI widgets keep their look until migrated; Tailwind preflight is harmless next to `CssBaseline`.
  - Radix in jsdom: menus/selects need `hasPointerCapture`, `scrollIntoView`, `ResizeObserver` shims in `tests/setup.ts`.
  - Accessible names in tests: keep `Sign in` / `Sign up` as buttons (ToggleGroup items may render `role="radio"` — verify; adjust markup, not test intent).
  - Complexity limits: `ActiveTaskRow` is already large; keep the Tailwind port within existing limits (extract class constants, not logic).
- **Standards diversions:** No `components.json` (D6) and PascalCase kit filenames (D5) diverge from shadcn defaults to match repo rules — confirmed via D5/D6.
- **Open questions:** none (auto mode).

## Review contract

- **Rules pinned:** `rules@8083ee4` — `.cursor/rules/architecture/RULE.mdc`, `.cursor/rules/file-placement/RULE.mdc`, `.cursor/rules/code-style/RULE.mdc`, `.cursor/rules/testing/RULE.mdc`, `.cursor/rules/agent-behavior/RULE.mdc`, `.cursor/rules/git-workflow/RULE.mdc`
- **Required lenses:** Pattern & precedent (L), Reuse / packages, Feature decomposition (no new feature folder — skipped modularity-review for features; new UI vendor noted for `stack-port` follow-up D19), Name the mechanism.
- **Tooling gate:** `validate` § Tooling pass (contract gate list) — phase gates cite this list. Lint gate = 0 errors (warnings at or below baseline 39).
- **Locked decisions:** sibling `DECISIONS.md` + **Decisions made** below + Amendments.

### Amendments

| # | Date | Source | Change | Applied to |
|---|------|--------|--------|------------|
| 1 | 2026-10-17 | review-dev-plan (naming lens) | Kit components named by role (`Spinner`, `FormField`, `DropdownMenu`), not by first caller; layout class constants keep generic names (`appViewportClassName`) | File placements |
| 2 | 2026-10-17 | review-dev-plan (delivery lens) | Each phase must keep `pnpm build` green (not only type-check) because Tailwind/Vite plugin errors surface only at build | Phase gates 1–5 |
| 3 | 2026-10-17 | validate plan-review (file-placement) | Feature README updates (`src/features/auth/README.md`, `src/features/tasks/README.md`) when they mention MUI, in the phase that changes that feature | Phases 2, 4 |

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Swap the app's component kit from MUI to shadcn/ui with no product behavior change |
| **Precedents** | Strangler-fig UI migrations (incremental kit swap behind wrappers); shadcn's own "Vite" install guide (Tailwind v4 + `@tailwindcss/vite`); common MUI → shadcn migrations in React/Vite apps |
| **Aspects reviewed** | Migration strategy (incremental vs big-bang); theming (CSS variables vs JS theme); component ownership (vendored source vs package); icon set |
| **Findings** | Incremental with coexistence — aligns. CSS-variable theming — aligns with shadcn. Vendored source in repo-convention paths — aligns (shadcn is designed to be copied); filename casing diverges by repo rule (D5). lucide — aligns |
| **Verdict** | Aligns with precedent |

## Phase 1 — Foundation

**Goal:** Tailwind v4 + shadcn token layer available app-wide; MUI untouched.

**Steps:**
1. `pnpm add tailwindcss @tailwindcss/vite tw-animate-css radix-ui class-variance-authority clsx tailwind-merge lucide-react`.
2. `vite.config.ts`: add `tailwindcss()` plugin.
3. `src/index.css`: `@import "tailwindcss"; @import "tw-animate-css";`, `@custom-variant dark`, `:root` shadcn tokens mapped to D8 brand (background, foreground, card, popover, primary, secondary, muted, accent, destructive, success, warning, border, input, ring, radius), `@theme inline` mapping, `--app-toolbar-height: 64px`, base layer (body font Montserrat, scrollbar styles ported from `MuiCssBaseline`).
4. `src/shared/utils/cn.ts` (`clsx` + `tailwind-merge`).
5. `src/main.tsx`: `import "./index.css"` (before MUI provider so ordering is stable).

**Gate:** contract tooling gate + `pnpm build`; app renders as before.

## Phase 2 — Kit primitives + auth surfaces

**Goal:** shadcn primitives exist; every consumer of `Button` / `Input` (auth feature + Home/Login/Reset pages) is on the kit.

**Steps:**
1. Vendor shadcn source (adapted to repo style, double quotes) into D5 paths: `Button` (brand variants: `default` gradient pill, `outline` white-sweep pill, `ghost`, `link`, `secondary`, `destructive`; sizes `default`/`sm`/`lg`/`icon`), `Input`, `Label`, `FormField` (Label + Input composition), `Alert` (variants `default`/`destructive`/`success`/`warning`/`info`), `Separator`, `ToggleGroup`, `Spinner` (lucide `Loader2Icon` spin), `Card`, `Modal` (Dialog) — D7/D16.
2. Port `GoogleIcon` to plain `<svg>` (`className` prop).
3. Port `SignInPanel`, `EmailAuthForm`, `HomePage`, `LoginPage`, `ResetPasswordPage` to the kit + Tailwind; convert `appViewLayout.ts` to class-string exports (D14). Remove its MUI type import.
4. Keep `SignInPanel.test.tsx` assertions unchanged; add Radix jsdom shims to `tests/setup.ts` if needed.
5. Update `src/features/auth/README.md` if it references MUI.

**Gate:** contract tooling gate + `pnpm build`; `SignInPanel` tests green; Home / Login / Reset render.

## Phase 3 — App shell + ProfileMenu

**Goal:** Everything outside `features/tasks` + `pages/tasks` is off MUI except `main.tsx` provider.

**Steps:**
1. Kit additions: `Avatar`, `Badge`, `Tooltip`, `DropdownMenu`.
2. Port `App.tsx` (top padding via `--app-toolbar-height`, drop `useTheme`), `MainLayout`, `Topbar` (fixed header, `z-40`), `PageLoadingState` (`Spinner`), `QueryErrorBoundary` (`Alert` + `Button`), `DevTasksFab` (pill `Button asChild` + `Link`, `variant="secondary"`).
3. Port `ProfileMenu` to `DropdownMenu` (D13): delete `anchorMenuProps.ts`, `useAnchorMenuState.ts`; `ProfileMenuTrigger` = `DropdownMenuTrigger` (`aria-label` "Account"/"Sign in" + `Tooltip`); `ProfileMenuContent`/`SignInMenuItems` → `DropdownMenuItem`; `ProfileInfo`/`ProfileName`/`ProfileEmail`/`ProfileChips` → Tailwind + `Avatar`/`Badge`/`Spinner`; lucide icons.
4. Keep `ProfileMenu.test.tsx` assertions; shims as needed.

**Gate:** contract tooling gate + `pnpm build`; `ProfileMenu` tests green; menu opens and items fire in browser.

## Phase 4 — Tasks

**Goal:** `/tasks` and `features/tasks/components/**` on the kit.

**Steps:**
1. Kit additions: `Select`, `Tabs`, `Textarea`.
2. Port `TasksPage`, `TasksBacklogPanel` (Tabs + Add button), `ActiveTaskList`/`ArchiveTaskList` (flex column gap), `ActiveTaskRow` (grid via Tailwind, `Select`, `Input`, `Textarea`, conditional description D18, lucide `GripVertical`/`Trash2`), `ArchiveTaskRow`, `TasksAutosaveIndicator` (`Badge` + spinning `RefreshCw`), `TasksFeedback` (fixed `Alert`, D12), `TasksListEmptyState` (lucide `ClipboardList`/`Archive`).
3. `taskStatusUi.ts`: `TASK_STATUS_COLOR` → Tailwind text classes (`text-muted-foreground`, `text-warning`, `text-success`).
4. Update `src/features/tasks/README.md` if it references MUI.

**Gate:** contract tooling gate + `pnpm build`; in `pnpm dev`, `/tasks` add / inline edit / drag reorder / status change / archive / restore work.

## Phase 5 — Remove MUI

**Goal:** zero MUI/Emotion in code and `package.json`.

**Steps:**
1. `main.tsx`: drop `ThemeProvider`/`CssBaseline`. Delete `defaultTheme.ts`, `theme.ts`, `themeLoader.ts` (D9).
2. `pnpm remove @mui/material @mui/icons-material @emotion/react @emotion/styled`.
3. `vitest.config.ts`: drop MUI `server.deps.inline` and MUI comment.
4. Docs: `ARCHITECTURE.md` (theme/toolchain lines), `AGENTS.md` stack line, `documentation/DOC_TESTING.md` / `DOC_REACT_PERF.md` MUI mentions.
5. Record D19 follow-ups in Notes.

**Gate:** `grep -rE "@mui|@emotion" src tests vite.config.ts vitest.config.ts package.json` empty; contract tooling gate + `pnpm build`.

## Notes during development

- Plan review and plan validate were run inline by the planning agent (single-agent lenses: naming, rebel, scale/modularity, industry precedent, delivery, tests; validate rules: architecture, file-placement, code-style, agent-behavior). Advisory, not promoted: (rebel) consider Base UI instead of Radix — D4 stands; (scale) add a `stack-port-radix` cruiser rule — D19 follow-up.

- Phase 2: `MainLayout` ported here (not Phase 3) because it consumed the converted `appViewLayout` constants. MUI `ToggleButtonGroup` replaced by a `SegmentedControl` (buttons with `aria-pressed`) instead of Radix `ToggleGroup`, whose single mode renders `role="radio"`; keeps the same semantics MUI had. Button text is sentence case (MUI uppercased by default).

## Decisions made

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|
| 1 | Plan review / validate acceptance | agent-accept 2026-10-17 — plan-grill-auto | n/a |
| 2 | Branch gate (model-b, unnamed branch) | Proceed on session-assigned `claude/exciting-clarke-oz8liv` (D20) | Cloud session branch assignment |

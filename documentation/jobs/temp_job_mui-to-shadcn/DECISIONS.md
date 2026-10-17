# Decisions — MUI → shadcn/ui migration

Job: `temp_job_mui-to-shadcn`
Updated: 2026-10-17

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Job slug | closed | `mui-to-shadcn` | plan-grill-auto | agent-pick; derived from request ("refactor the MUI dependency to a shadcn ui kit") |
| D2 | Perimeter / end state | closed | Full migration in this job, delivered as ordered phases that each leave the app working (MUI + shadcn coexist until the last phase), ending with `@mui/*` + `@emotion/*` removed from `package.json` | plan-grill-auto | agent-pick. Lost: (B) foundation + one slice only, rest later — fails "so we can drop the MUI dep"; (C) big-bang single rewrite — fails "piece by piece". challenge rejected: "piece by piece means separate jobs" — phases with gates + per-phase commits give the same reviewable increments |
| D3 | Styling engine | closed | Tailwind CSS v4 via `@tailwindcss/vite`, CSS-first config in `src/index.css` (no `tailwind.config.*`, no PostCSS file) | plan-grill-auto | clear-winner. Lost: Tailwind v3 (needs root `tailwind.config.js` + `postcss.config.js`, not in root whitelist → protected `projectStructure.config.cjs` change); CSS Modules (not what shadcn ships) |
| D4 | Headless primitive layer | closed | `radix-ui` unified package (current shadcn default) | plan-grill-auto | agent-pick. Lost: Base UI (newer shadcn option, less precedent/examples); per-package `@radix-ui/react-*` (more deps, same code) |
| D5 | Placement + file naming of kit components | closed | Repo convention: `src/components/common/<Name>/<Name>.tsx` + `index.ts` (PascalCase), `cn()` in `src/shared/utils/cn.ts` | plan-grill-auto | clear-winner. Lost: shadcn-native `src/components/ui/button.tsx` (folder not whitelisted → protected config change); `src/components/common/ui/button.tsx` (whitelisted but breaks PascalCase component file naming in `code-style`) |
| D6 | shadcn CLI / `components.json` | closed | No `components.json`; vendor shadcn component source by hand into D5 paths | plan-grill-auto | clear-winner. `components.json` is not in the root whitelist (protected). CLI only saves copy-paste. challenge rejected: "CLI needed for upgrades" — upstream diffs stay possible by reading shadcn source; whitelisting can be asked later |
| D7 | Wrapper prop API (`Button`, `Input`, …) | closed | Adopt shadcn API (`variant: default/outline/ghost/link/destructive/secondary`, `size`, `className`, `asChild`); update every call site. `Input` = plain input; labels via `Label` + a small `FormField` composition | plan-grill-auto | agent-pick. Lost: keep MUI-shaped props (`contained/outlined/text`, `fullWidth`, `label`, `sx`) via adapter — keeps MUI vocabulary forever and fights shadcn upstream. Only 6 call sites |
| D8 | Visual design | closed | Preserve current brand as shadcn CSS variables: dark-only, Montserrat, bg `#070614`, card `#1C1B29`, primary `#CF13B3`, secondary `#E6196B`, pill buttons with gradient (default) and white-sweep (outline) | plan-grill-auto | clear-winner `[Wins: UX]` matches live surfaces. Lost: stock shadcn neutral theme (visible regression). Non-goal: light mode / theme toggle |
| D9 | Runtime custom theme (`custom_mui_theme` localStorage loader, `saveCustomTheme` etc.) | closed | Remove; no consumer outside `src/shared/theme/` | plan-grill-auto | clear-winner (Generality: no consumer → no machinery). Deferred non-goal: runtime theme overrides via CSS variables |
| D10 | Icon set | closed | `lucide-react` (shadcn default) | plan-grill-auto | clear-winner. Lost: keep `@mui/icons-material` (blocks D2); hand-inlined SVGs (more code). `GoogleIcon` stays a local inline SVG (brand mark, not in lucide) |
| D11 | Stack boundary for new vendors | closed | `radix-ui` imported only from `src/components/common/**`; `lucide-react` allowed anywhere (leaf icon dep, shadcn convention) | plan-grill-auto | agent-pick. Mirrors existing `stack-port-mui` intent. Enforcement rule in `.dependency-cruiser.cjs` is a protected-file follow-up (D19) |
| D12 | Tasks save/error toast (`Snackbar`) | closed | Fixed-position `Alert` driven by existing `feedback` state (same behavior), no toast library | plan-grill-auto | agent-pick `[Wins: least code]`. Lost: `sonner` (imperative toast API; would need effect bridging from controlled state + new dep) |
| D13 | ProfileMenu external-anchor mode (`anchorEl`/`onClose` props, `useAnchorMenuState`, `anchorMenuProps`) | closed | Remove; menu becomes trigger-based Radix `DropdownMenu` with internal open state | plan-grill-auto | clear-winner: no caller passes `anchorEl` (only `<ProfileMenu />` in `Topbar`). Radix menus are trigger-anchored |
| D14 | Layout tokens (`src/shared/theme/appViewLayout.ts` `sx` objects) | closed | Keep the file as the layout SSOT, convert exports to Tailwind class strings (`appViewportClassName`, …); toolbar height becomes CSS var `--app-toolbar-height` | plan-grill-auto | agent-pick (ride the neighbor). Lost: new layout components `<AppViewport>` etc. (more code, same result) |
| D15 | Generality | closed | Composition: generic shadcn primitives in `src/components/common/`, callers compose; no plugin/registry machinery | plan-grill-auto | clear-winner per `plan-grill` § Generality |
| D16 | Unused wrappers `Card`, `Modal` | closed | Port to shadcn `Card` / `Dialog` under the same public names | plan-grill-auto | agent-pick. Lost: delete (shrinks harness starter surface that `ARCHITECTURE.md` advertises) |
| D17 | Select controls (task status, restore) | closed | shadcn `Select` (Radix) | plan-grill-auto | agent-pick `[Wins: UX]` closest to current MUI menu-style select. Lost: native `<select>` (less code, different look) |
| D18 | Expand/collapse (`Collapse`) | closed | Conditional render (no animation primitive) | plan-grill-auto | agent-pick `[Wins: least code]`. Lost: Radix `Collapsible` with height animation (extra primitive for a dev-only page) |
| D19 | Protected files touched by the migration | closed | Not edited in this job; listed as follow-ups needing explicit user approval: `.dependency-cruiser.cjs` (`stack-port-mui` → `stack-port-radix`), `.dependency-cruiser-baseline.json` regen, `eslint.config.js` (`sx` hard-coded-style rules → Tailwind equivalent), `.cursor/rules/code-style` + `testing` MUI wording, `projectStructure.config.cjs` (optional `components.json`) | plan-grill-auto | clear-winner: protected-file consent is never auto-answered. Stale rules are harmless no-ops once MUI is gone |
| D20 | Commit cadence | closed | One commit per phase on the session branch `claude/exciting-clarke-oz8liv`, pushed; no version bump / changelog (that is `finish`) | plan-grill-auto | agent-pick. Session branch is the one this cloud session was assigned; container is ephemeral so unpushed work is lost. Landing on `develop` + bump stays with `finish` |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-17 — D1–D20 closed via plan-grill-auto (D3, D5, D6, D8, D9, D10, D13, D15, D19 clear-winner; rest agent-pick)

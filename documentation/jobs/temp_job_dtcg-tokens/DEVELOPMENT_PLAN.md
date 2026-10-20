# Development plan: W3C DTCG design tokens as the theme source

## Summary

- **Goal:** Move every theme token value out of hand-written CSS into W3C Design Tokens Community Group (DTCG) **2025.10** files (Format + Color + Resolver modules). Terrazzo generates the CSS variables the app already uses. Every token file is checked against the official JSON Schemas.
- **Why:** Owner wants "a max compatibility W3C Design Tokens (DTCG) Format". DTCG is the closest thing to a universal token standard, so design tools (Tokens Studio, Penpot, Figma via importers) can read and write the same files. This job comes before `temp_job_bronze-theme`, which then restyles by editing token files only.
- **Complexity:** M — new build tool and devDeps, one protected whitelist change, and a change of source of truth (supersedes runtime-theming D6). No runtime API change.
- **Plan review:** Waived — owner grilled every fork live (`DECISIONS.md` D1–D11); a scratch POC proved the tool, the schemas and the mode output.
- **Plan validate:** Done 2026-10-20 — tooling pass green (lint 0 errors, type-check, arch:check, build, format:check, test:run 101, test:classify 104, validate:structure/docs).
- **Scope / constraints:**
  - In: all current tokens (26 colors × light/dark; fonts, radius, spacing, toolbar height, component radii, motion, elevation), light/dark and reduced-motion through resolver modifiers, generated CSS, spec and drift tests, docs.
  - Out:
    - Changing any token value: the result must be pixel-identical; bronze is the next job.
    - Breakpoints, z-index and the type scale (theming D4).
    - Design-tool sync setup, e.g. a Tokens Studio GitHub sync. The docs say how; nothing is configured.
    - The `oklch` color space (D7).
  - Unchanged: CSS variable names, the `applyTheme()` / `clearTheme()` API, the `.dark` class, the `index.html` anti-flash script, the Tailwind `@theme inline` mapping (except the D10 fallbacks).

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Tooling: Terrazzo, vendored schemas, whitelist, `tokens:build` | `pnpm tokens:build` runs on a stub resolver; `validate:structure` passes | Done |
| 2 | Author DTCG tokens with today's exact values; generate CSS; `index.css` imports it | Generated file defines every token; build and dev load clean | Done |
| 3 | Contract tests: schema, drift, name contract | New tests pass; tests fail when a token file is broken or edited without regenerating | Done |
| 4 | Prove nothing changed visually | Computed values for every token match `main` in light, dark and reduced motion; screenshot diff is 0 px on 6 views × 2 modes | Done |
| 5 | Docs | DOC_THEMING, ARCHITECTURE, DOC_INDEX, theming ledger note; `validate:docs` passes | Done |

## Conflict & compliance

- **Applicable rules:**
  - `.cursor/rules/architecture/RULE.mdc`: `src/shared/theme/` owns the token contract; no feature imports.
  - `.cursor/rules/file-placement/RULE.mdc` + `projectStructure.config.cjs`.
  - `.cursor/rules/code-style/RULE.mdc` (styling section, complexity limits).
  - `.cursor/rules/testing/RULE.mdc`: colocated `*.test.ts`.
  - `.cursor/rules/agent-behavior/RULE.mdc`: protected files.
  - `.cursor/rules/git-workflow/RULE.mdc`: model C, session branch.
- **File placements (D11):**
  - `src/shared/theme/tokens/base.tokens.json`: typography, shape, spacing, layout, motion and elevation shared by both modes.
  - `src/shared/theme/tokens/light.tokens.json`, `dark.tokens.json`: colors, plus the dark brand elevations.
  - `src/shared/theme/tokens/reduced-motion.tokens.json`: duration overrides.
  - `src/shared/theme/tokens/theme.resolver.json`: set `base`; modifiers `mode` (light default / dark) and `motion` (default / reduced); `resolutionOrder` base → mode → motion.
  - `src/shared/theme/tokens/tokens.generated.css`: generated, committed, "DO NOT EDIT" header.
  - `src/shared/theme/dtcgTokens.test.ts`: schema check, drift check and name contract. It replaces the `index.css` parsing in `themeTokens.test.ts`; the apply/clear tests stay there.
  - `scripts/terrazzo.config.js`: ESM (`"type": "module"`); paths relative to the repo root.
  - `scripts/dtcg-schemas-2025.10.json`: `{ source, commit: "882ebd6716abef9a46d8ef5fb12e82009d6cee2e", schemas: { <$id>: <schema> } }`, bundled from `design-tokens/community-group/schemas/src/2025.10`.
  - **Needs config change (protected, owner approval):** `projectStructure.config.cjs` → `src/shared/theme` gets child `{ name: "tokens", children: [{ name: "*.tokens.json" }, { name: "*.resolver.json" }, { name: "tokens.generated.css" }] }`. Everything else is already whitelisted (`scripts/*.js`, `scripts/*.json`, `src/shared/theme/*.ts`).
- **Reuse / packages (`dont-reinvent-the-wheel`):**
  - `@terrazzo/cli` + `@terrazzo/plugin-css` 2.9.x: full 2025.10 support including resolvers. POC built light/dark/reduced-motion permutations correctly.
  - `ajv` 8 + `ajv-formats` 3: JSON Schema draft-07 validation, the format the official schemas use.
  - Rejected: Style Dictionary 5.7 (no resolver-document support found in its source); a custom generator.
  - All three go in as **devDependencies** only, so nothing new ships in the bundle.
- **Risks / attention points:**
  - **Partial permutations (POC finding).** Full permutations re-declare every token per block. The reduced-motion `:root` block would then override `.dark` colors (same specificity, later in the file). Use `only: { modifiers: [...], sets: [] }` per non-default permutation. A test asserts that the `.dark` block holds only mode tokens and the motion block only durations.
  - **Exact color output.** Prefer `legacyHex: true` so generated colors are byte-identical hex/hex8. Otherwise verify that rounded `rgb(%)` values resolve to the same 8-bit channels (Phase 4 computed-value check).
  - **Shadows.** `elevation-*` are layered shadows, so the DTCG shadow value is an array. Confirm that Terrazzo emits them in order with the alpha intact.
  - **Fonts.** `fontFamily` arrays are emitted quoted (`"Montserrat", sans-serif`); `heading-font` stays an alias (`{…body-font}` → `var(--body-font)`).
  - **D10 fallbacks.** `card-radius` and `input-radius` leave the token files. `@theme inline` becomes `--radius-card: var(--card-radius, calc(var(--radius) + 0.375rem))` and `--radius-input: var(--input-radius, calc(var(--radius) - 2px))`. `THEME_SHARED_TOKENS` keeps both names, so `applyTheme` still accepts them, and the contract test lists them as optional.
  - **Vite/Tailwind.** `@import "./shared/theme/tokens/tokens.generated.css"` must come after `@import "tailwindcss"`. The `@source not "./config"` guard is unaffected.
  - **The schemas URL is half-hosted.** `designtokens.org/schemas/2025.10/format.json` is served but its sub-schemas 404. Validation therefore uses only the vendored bundle; no network in tests.
- **Open questions:** none. Protected-file approval is the only owner action (see Present).
- **Standards diversions:**
  - Token names are full CSS names under category groups (e.g. `color.primary-foreground`, `motion.duration-fast`) rather than path-derived names (D6). This is valid DTCG and done on purpose, to keep the shadcn/`applyTheme` names.
  - No `$schema` key in `*.tokens.json`: the spec doesn't define one, and the hosted format schema is incomplete. The resolver keeps its official `$schema`.

## Review contract

- **Rules pinned:** `rules@c3d2220`: architecture, file-placement, code-style, testing, agent-behavior, git-workflow.
- **Required lenses:**
  - Pattern & precedent (below).
  - Reuse / packages (above).
  - Feature decomposition: skipped, no `src/features/` module.
  - Name the mechanism (`.agents/skills/name-the-mechanism/SKILL.md`): file and test names describe the category (`dtcgTokens`, `tokens.generated.css`), not this palette.
- **Tooling gate:** `validate` § Tooling pass (lint, type-check, test:run, arch:check, build, format:check, validate:structure, validate:docs).
- **Locked decisions:** `DECISIONS.md` D1–D11 + **Decisions made** below + Amendments.

### Amendments

| # | Date | Source | Change | Applied to |
|---|------|--------|--------|------------|

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Design tokens authored in the W3C DTCG format, compiled to CSS custom properties, with light/dark as resolver modes |
| **Precedents** | Terrazzo docs (resolver → CSS permutations); Style Dictionary + Tokens Studio pipelines (DTCG JSON → CSS vars); shadcn/ui (CSS vars + `.dark` class + `@theme inline`) |
| **Aspects reviewed** | Source of truth; mode mechanism; generated-artifact handling; naming; spec conformance |
| **Findings** | Source of truth: aligns (tokens JSON is master in all pipelines). Modes: aligns with the 2025.10 resolver; `.dark` class output matches shadcn. Generated CSS committed + drift test: common (also Style Dictionary repos); build-time generation is the other common choice. Naming: product-specific, kept for shadcn compatibility. Conformance: stronger than usual (official schema test). |
| **Verdict** | Aligns with precedent |

## Phase 1 — Tooling

**Goal:** Token build and spec check run, with no token values moved yet.

**Steps:**
1. Protected-file change, once the owner approves: add the `tokens` child under `src/shared/theme` in `projectStructure.config.cjs` (Conflict & compliance § File placements).
2. `pnpm add -D @terrazzo/cli@2.9 @terrazzo/plugin-css@2.9 ajv@8 ajv-formats@3`.
3. Bundle the official schemas: copy `schemas/src/2025.10/**` at commit `882ebd6…` into `scripts/dtcg-schemas-2025.10.json`, keyed by `$id`, with a `source` + `commit` header.
4. `scripts/terrazzo.config.js`:
   - `tokens: ["./src/shared/theme/tokens/theme.resolver.json"]`, `outDir: "./src/shared/theme/tokens/"`.
   - `css({ filename: "tokens.generated.css", legacyHex: true, variableName: (t) => "--" + lastSegment(t.id), permutations: [...] })`, where `lastSegment` maps a `$root` token to its group name.
   - The `permutations` array:
     - `{ input: {}, prepare: :root }`
     - `{ input: { mode: "dark" }, only: { modifiers: ["mode"], sets: [] }, prepare: .dark }`
     - `{ input: { motion: "reduced" }, only: { modifiers: ["motion"], sets: [] }, prepare: @media (prefers-reduced-motion: reduce) { :root } }`
5. `package.json`: `"tokens:build": "tz build -c scripts/terrazzo.config.js"`, `"tokens:check": "tz check -c scripts/terrazzo.config.js"`.

**Gate:** `pnpm tokens:build` succeeds on a one-token stub resolver; `pnpm validate:structure` passes; lint and type-check are clean.

## Phase 2 — Author tokens (values unchanged)

**Goal:** The DTCG files hold every current value, and `index.css` loads the generated CSS instead of the hand-written blocks.

**Steps:**
1. `base.tokens.json`, grouped with `$type` on each group:
   - `font` (`fontFamily`): `body-font`, `heading-font` = `{font.body-font}`, `mono-font`.
   - `shape` (`dimension`): `radius` 0.625rem, `button-radius` 9999px.
   - `spacing` (`dimension`): `spacing` 0.25rem.
   - `layout` (`dimension`): `app-toolbar-height` 64px.
   - `motion`: `duration-fast` / `duration-normal` / `duration-slow` (`duration`), `ease-standard` (`cubicBezier`).
   - `elevation` (`shadow` arrays): `elevation-sm` … `elevation-xl`, plus the light `elevation-brand` and `elevation-brand-active`.
   - Each token gets a `$description` taken from the current CSS comments.
2. `light.tokens.json` / `dark.tokens.json`:
   - `color` group (`$type: color`): all 26 tokens as `{ colorSpace: "srgb", components, alpha?, hex }`, converted from today's hex/rgba values with a small one-off script, rounded to 4 decimals.
   - The `dark` file also sets `elevation-brand` and `elevation-brand-active`.
3. `reduced-motion.tokens.json`: the three durations = 0.01ms.
4. `theme.resolver.json` per D5 (`version: "2025.10"`, official `$schema`).
5. Run `pnpm tokens:build`.
6. `src/index.css`: delete the `:root`, `.dark` and reduced-motion token blocks; add `@import "./shared/theme/tokens/tokens.generated.css";`; apply the D10 fallbacks in `@theme inline`; update the header comment to point to the DTCG files.
7. `themeTokens.ts`: update the header comment to name the token files; lists and API unchanged.

**Gate:** The generated `:root` declares every `THEME_TOKENS` name except `card-radius` and `input-radius`; `.dark` holds only colors and brand elevations; the motion block holds only durations. `pnpm build` passes, and `pnpm dev` shows the app with no console errors.

## Phase 3 — Contract tests

**Goal:** Spec conformance and generated output are enforced on every commit.

**Steps:**
1. `src/shared/theme/dtcgTokens.test.ts`:
   - **Schema:** every file in `tokens/` passes the vendored official schema (`format.json` for `*.tokens.json`, `resolver.json` for `*.resolver.json`). Plus a negative case: an in-memory token with `$type: "string"`, or a color without `colorSpace`, fails.
   - **Drift:** a fresh Terrazzo build of `theme.resolver.json` into a temp dir equals the committed `tokens.generated.css`. On failure, the message says "run pnpm tokens:build".
   - **Names:** all generated CSS names are unique; they equal `THEME_TOKENS` minus the optional set {`card-radius`, `input-radius`}; `.dark` names ⊆ color tokens ∪ brand elevations; reduced-motion names are the durations only.
2. Trim `themeTokens.test.ts` to the apply/clear behavior; the `index.css` parsing moves into the name contract above.
3. Add `src/shared/theme/tokens/**` and `scripts/terrazzo.config.js` to the staged-test mapping, if `scripts/test-staged.cjs` needs it, so that token edits run the contract test before commit.

**Gate:** The tests pass. Editing a value in `light.tokens.json` without rebuilding makes the drift test fail; an invalid token makes the schema test fail (checked by hand, then reverted).

## Phase 4 — No visual change

**Goal:** Prove the move changes nothing that renders.

**Steps:**
1. Playwright against `main` and against this branch: read `getComputedStyle(documentElement)` for every `THEME_TOKENS` name, in light, dark and dark + emulated reduced motion. The values must be identical (colors compared as resolved rgb).
2. Screenshot diff on the 6 views used in the runtime-theming job, in both modes: 0 changed pixels.
3. Check that `applyTheme({ radius: "0" })` still squares cards and inputs, and that `applyTheme({ "card-radius": "0" })` squares only cards.

**Gate:** All three checks pass.

## Phase 5 — Docs

**Goal:** People and agents edit tokens in the right place.

**Steps:**
1. `documentation/DOC_THEMING.md`: the token source is now DTCG. Cover:
   - The file map and how to edit and rebuild (`pnpm tokens:build`).
   - Which modifier holds what.
   - How to add a token (the JSON plus the `THEME_TOKENS` list).
   - The optional component radii (D10).
   - Pointing a design tool at `src/shared/theme/tokens/` and the resolver.
   - The spec version and the schema test.
2. `ARCHITECTURE.md`, `documentation/DOC_INDEX.md`, `README.md` (theming lines): change "tokens in `src/index.css`" to the DTCG files.
3. `documentation/jobs/temp_job_runtime-theming/DECISIONS.md`: mark D6 `superseded by temp_job_dtcg-tokens D2`.
4. Follow-up for the owner (protected): the `.cursor/rules/code-style/RULE.mdc` styling section should name the DTCG files as the token source. It joins the PR #7 open item.

**Gate:** `pnpm validate:docs` passes; the `validate` tooling pass is green.

## Notes during development

- Phase 4 evidence: Playwright against a pre-DTCG build (`6709f31`) and this build. Computed values for all 43 generated tokens plus `rounded-card/input/button/lg`, in light/dark × motion default/reduced: 0 differences. Screenshots of home, login, reset, signup, profile menu and mobile home, in light and dark: 0 changed pixels each. `--radius: 1rem` moves card/input/lg identically, and a `--card-radius: 0px` override squares only cards, as before.
- Hex8 alpha (`legacyHex: true`) quantizes alpha to 1/255 (e.g. 0.06 → `0f`). Chrome renders and serializes it identically to the old `rgb(... / 0.06)`, so it was kept for readability.
- The hosted `designtokens.org/schemas/2025.10/*` sub-schemas 404, so the bundle is vendored from the repo at `882ebd6`.
- The `dtcgTokens.test.ts` drift check shells out to `tz build` with `TOKENS_OUT_DIR` set to a temp dir (~1 s). Token edits under `src/shared` already trigger the full suite in pre-commit.
- `arch:check` reports `info no-orphan-modules: themeTokens.ts`. This is pre-existing (same on `6709f31`): `applyTheme` is public API with no in-app caller.

## Decisions made

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|
| 1 | Hex fallback consistency | Added a test: every `hex` equals `round(components × 255)` (tools that read only `hex` must see the same color) | No (spec allows drift; max-compat guard) |
| 2 | Test environment | Default jsdom (global setup needs `window`); node APIs still available | Repo setup |
| 3 | Plan wording fix | Phase 4 step 3: `radius: 0` gives cards `0.375rem`, not square (same as before); verified with `radius: 1rem` + `card-radius: 0px` instead | — |

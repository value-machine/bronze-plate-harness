# Decisions — W3C DTCG design tokens

Job: `temp_job_dtcg-tokens`
Updated: 2026-10-20

Precedes `temp_job_bronze-theme` (owner: "First, i want careful implementation of a max compatibility W3C Design Tokens (DTCG) Format").

Sources: https://www.designtokens.org/TR/2025.10/ (format, color, resolver), https://github.com/design-tokens/community-group (`/schemas`, `/test-suite`), living draft https://www.designtokens.org/tr/drafts/format/.

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Spec version to target | closed | DTCG **2025.10** stable: Format + Color + Resolver modules (`.tokens.json`, `.resolver.json` with `"version": "2025.10"`) | plan-grill | clear-winner `[Wins: compatibility]`. Lost: living draft (dated 2026-09-08; says "Do not attempt to implement this version"); older editors' drafts (pre-color-module, string colors). Validation against the official JSON schemas in the community-group repo `/schemas`. |
| D2 | Token SSOT | closed | DTCG files are the master (`*.tokens.json` + `.resolver.json`, hand-edited); CSS custom properties are **generated** and drift-checked. **Supersedes runtime-theming D6** (CSS-first). | plan-grill | Owner picked option 1. Lost: CSS master + DTCG export (design-tool edits cannot flow back); DTCG read at runtime (runtime dep, reworks anti-flash script). |
| D3 | Token build tool | closed | **Terrazzo** (`@terrazzo/cli` + `@terrazzo/plugin-css`, 2.9.x) reads the `.resolver.json` and writes the CSS | plan-grill | clear-winner after POC (scratch build: light/dark/reduced-motion permutations, aliases emitted as `var()`, shadows, alpha colors). Lost: Style Dictionary 5.7 (no resolver-document support found in its source: no `resolutionOrder`; would need a hand-rolled resolver); custom script (reinvents alias/resolver/color handling). Terrazzo's author edits the DTCG spec. |
| D4 | Spec conformance check | closed | Validate every `*.tokens.json` / `*.resolver.json` against the **official DTCG 2025.10 JSON Schemas** (vendored from `design-tokens/community-group` `schemas/src/2025.10`, pinned commit) in a unit test; Terrazzo's own parse is the second check | plan-grill | clear-winner `[Wins: compatibility]`. Terrazzo alone accepts non-spec extras (custom `string`/`boolean`/`link` types). Schemas are not on npm (`@dtcg/schemas` is private) and the hosted URLs 404 for sub-schemas, so vendoring is the only offline option. POC files validated clean. |
| D5 | Light/dark + reduced motion | closed | Resolver modifiers: `mode` (`light` default, `dark`) and `motion` (`default`, `reduced`). CSS: `:root` = defaults, `.dark` = only the mode-dependent tokens, `@media (prefers-reduced-motion: reduce) :root` = only motion tokens (Terrazzo `only: { modifiers, sets: [] }`) | plan-grill | clear-winner: spec-native, keeps the current `.dark` class contract (anti-flash script, Tailwind `dark:` variant). POC caught that full permutations re-declare light colors inside the reduced-motion block and break dark mode; partial permutations fix it. |
| D6 | CSS variable names | closed | Unchanged (`--primary`, `--body-font`, `--button-radius`, ...): `applyTheme()` keys and shadcn naming stay. DTCG tree is grouped by category for design tools; CSS name = the token's own name (last path segment); names unique across groups (tested) | plan-grill | clear-winner. Lost: path-derived names (`--color-primary`, `--font-heading`) — break the `applyTheme` API and shadcn presets, and collide with Tailwind's `@theme inline` names (self-referencing vars). |
| D7 | Color encoding | closed | `colorSpace: "srgb"` + `components` + `alpha` + `hex` fallback on every color | plan-grill | clear-winner `[Wins: compatibility]`: srgb + hex is what Figma, Tokens Studio, Penpot and Style Dictionary all read. Lost: `oklch` (spec-valid, fewer tools read it; can be adopted per token later). |
| D8 | Generated CSS | closed | Committed generated file (header "DO NOT EDIT"), imported by `src/index.css`; `pnpm tokens:build` regenerates; a unit test fails when the committed file differs from a fresh build | plan-grill | clear-winner. Lost: generate on every dev/build via a Vite plugin (hidden step, harder review, no file to diff); CI-workflow drift job (protected `.github/workflows`; a test runs in every existing gate already). |
| D9 | Tailwind wiring | closed | `@theme inline`, `@utility elevation-*`, base layer stay hand-written in `src/index.css`; only the `:root` / `.dark` / reduced-motion token blocks move to DTCG | plan-grill | clear-winner: that layer maps tokens to utilities (Tailwind config), not token values. |
| D10 | Derived radii (card = radius + 0.375rem, input = radius − 2px) | closed | DTCG holds only real values (`radius`, `button-radius`). `card-radius` / `input-radius` become **optional override tokens**: the formula lives as a CSS fallback in the Tailwind layer, e.g. `--radius-card: var(--card-radius, calc(var(--radius) + 0.375rem))` (shadcn's own derivation pattern). Token contract test allows optional tokens. | plan-grill | Owner asked for max flexibility, minimal complexity, alignment with Claude/shadcn defaults; agent recommended after trade-off matrix; owner confirmed. Pixel-identical; one radius knob still cascades; per-component override still works. Lost: literal values (cascade lost), alias without offset (visual change), `$extensions` calc (non-portable, custom transform), dropping the tokens (loses theming D5 override). |
| D11 | Where token files live | closed | Sources in `src/shared/theme/tokens/` (`*.tokens.json`, `theme.resolver.json`); generated `src/shared/theme/tokens/tokens.generated.css`; Terrazzo config `scripts/terrazzo.config.js`; official schemas vendored as one file `scripts/dtcg-schemas-2025.10.json` (with source commit). Needs a **protected** `projectStructure.config.cjs` whitelist entry for the `tokens/` folder. | plan-grill | clear-winner (ride the neighbor: `src/shared/theme/` already owns the token contract and `applyTheme`). Lost: root `tokens/` + root `terrazzo.config.ts` (Terrazzo's default layout; two new root entries in the protected whitelist and token values split from theme code); schemas as a folder tree (needs another whitelist entry; one bundled JSON fits `scripts/*.json`). |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-20 — D1 closed via plan-grill (clear-winner)
- 2026-10-20 — O1 asked; closed as D2 (owner)
- 2026-10-20 — D3–D9 closed via plan-grill (clear-winner; D3/D4/D5 after scratch POC)
- 2026-10-20 — D10 closed via plan-grill (owner, after trade-off matrix)
- 2026-10-20 — D11 closed via plan-grill (clear-winner)

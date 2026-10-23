
# Code Style Standards

## Enforced by tooling (don't hand-check — run the command)

- **Formatting** — Prettier (`.prettierrc.json`: double quotes, `(x) => x` arrow parens, LF line endings, width 100). `pnpm format`.
- **Lint** — `eslint.config.js` (flat config, extends GTS; SSOT): `===`, no `var`, `prefer-const`; feature components can't import feature services, feature hooks can't import feature components, and `components/common` can't import features (error); `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps` (warn); hardcoded colors in class strings and `style` props (warn); `@tanstack/query/exhaustive-deps` (warn); complexity (warn, below). `pnpm lint` / `pnpm lint:fix`.
- **Types** — TypeScript `strict` plus `noUnusedLocals` / `noUnusedParameters` (prefix intentionally unused params with `_`). `pnpm type-check`.
- **Layers, cycles, `@/` alias** — dependency-cruiser (`pnpm arch:check`) and `.claude/rules/architecture.md`.

Pre-commit runs these on staged files; CI runs them in full. Fix errors; warnings are acceptable but don't add new ones.

## Naming

What a name means, and when a copy must be extracted, is `.agents/skills/name-the-mechanism/SKILL.md` — read it before adding or copying any symbol, one-off edits included. Syntax:

- camelCase variables/functions, UPPER_SNAKE_CASE constants, PascalCase types/interfaces (no `I` prefix unless it adds clarity). Interfaces for objects, types for unions.
- Files: components `ItemList.tsx`, hooks `useItems.ts`, services `itemService.ts`, types `item.types.ts` (case and suffix only — not destinations).
- **Generic core, contextual edge:** a reusable control takes its role name from the skill (e.g. `TextInput`); context (`label`, validation, data binding) stays in props, the caller, or a thin wrapper (e.g. `ItemDescriptionField`). No plugin registries or unused ports until a second consumer exists.

## TypeScript

- No `any`: use a narrow type, `unknown`, or a local interface. Last resort for third-party gaps: `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a one-line justification.
- Explicit return types on exported and async functions; JSDoc on exported functions and types (explain *why*, not *what*).
- Catch errors as `unknown` and narrow; mark intentionally un-awaited promises with `void`.
- Services are pure functions — no React hooks.
- Imports: external first, then `@/` internal; `import type` for types; prefer named exports. Before importing a package, confirm it is in `package.json` — types for wrapped libraries often come from the wrapper (e.g. TipTap via `@tiptap/react`).

## Reuse and extraction

- Search for an existing component/hook/utility before adding one, and say which ones you checked.
- When extracting to a new file, trace **every** usage of each moved state, setter, and function (watch error-clearing callbacks, resets, and setters used in handlers): each either moves with the extraction or is exposed in its return value/props. Then confirm every reference in the original file still resolves.

## Styling scope

Before implementing a styling change, **ask which scope** the user wants, recommending global tokens (the usual intent), and wait for the answer:

| Scope | Where | Use for |
|-------|-------|---------|
| Global tokens | DTCG token files in `src/shared/theme/tokens/` → `pnpm tokens:build` (guide: `documentation/DOC_THEMING.md`) | Colors, radius, fonts, shadows, motion |
| Component | Kit variants (`cva`) in `src/components/common/<Name>/<Name>.tsx` | How every usage of a kit component (or one variant) looks |
| Instance | `className` on one usage (merge with `cn()`) | Layout and spacing only (margin, padding, position, width) — never colors or typography |

`radix-ui` is imported only by kit components in `src/components/common/` (enforced: `stack-port-radix`, `pnpm arch:check`).

## Complexity

Thresholds (SSOT `eslint.config.js`, warnings in `pnpm lint`):

| Metric | Limit |
|--------|-------|
| Cyclomatic complexity | ≤ 10 |
| Cognitive complexity | ≤ 15 |
| Nesting depth | ≤ 4 |
| Function length | ≤ 100 lines (excluding blanks and comments) |
| Parameters | ≤ 3 (use an options object) |
| Statements | ≤ 15 |

Reduce with early returns/guard clauses, helper extraction, and options objects; full workflow in `.agents/skills/optimize2/SKILL.md`.

## Related Rules

When modifying this rule, check `architecture`, `testing`, `workflow`, `.agents/skills/optimize2/SKILL.md`, and `.agents/skills/layer-consistency-check/SKILL.md`.

# Theming

How to restyle the whole app: light/dark mode, brand colors, corner radius, density, fonts, shadows and motion. Product decisions behind this: `documentation/jobs/temp_job_runtime-theming/DECISIONS.md`.

## How it works

| Piece | Where | Role |
|-------|-------|------|
| Tokens (CSS variables) | `src/index.css` | `:root` = light (default) + shared values; `.dark` = dark color overrides. SSOT for every themeable value. |
| Tailwind mapping | `src/index.css` → `@theme inline` | Exposes tokens as utilities (`bg-primary`, `rounded-button`, `font-heading`, …). Values are `var()` references, so runtime overrides reach every utility. |
| Token contract | `src/shared/theme/themeTokens.ts` | Typed list of token names (`THEME_TOKENS`); `themeTokens.test.ts` fails if `index.css` and the list drift apart. |
| Color mode | `src/shared/theme/colorMode.ts`, `src/shared/context/ColorModeContext.tsx`, inline script in `index.html` | Light / Dark / System. Follows the OS by default, remembers the choice per device, syncs across tabs, no flash on load. |
| Mode control | `src/layouts/ProfileMenu/ColorModeToggle.tsx` | Icon at the bottom right of the profile menu that cycles Light → Dark → System (tooltip names current and next). |
| Runtime overrides | `applyTheme()` / `clearTheme()` in `themeTokens.ts` | Restyle at runtime (e.g. per login) on top of the active mode. |

Components never use raw colors or one-off values for themeable aspects; they use token utilities. The lint rule in `eslint.config.js` warns on hardcoded colors.

## Tokens

All names are in `THEME_TOKENS` (`src/shared/theme/themeTokens.ts`).

| Group | Tokens | Utilities |
|-------|--------|-----------|
| Colors (per mode) | `background`, `foreground`, `card`, `popover`, `primary`, `primary-gradient-start`, `secondary`, `muted`, `accent`, `destructive` (each with `-foreground` where text sits on it), `success`, `warning`, `info`, `border`, `input`, `ring`, `overlay`, `scrollbar`, `scrollbar-hover` | `bg-*`, `text-*`, `border-*`, `ring-*` |
| Typography | `body-font`, `heading-font`, `mono-font` | `font-sans` (body), `font-heading`, `font-mono` |
| Shape | `radius` (base; `rounded-sm/md/lg/xl` derive from it) | `rounded-*` |
| Density | `spacing` (Tailwind's spacing base; every `p-*`, `gap-*`, `h-*` scales with it) | all spacing utilities |
| Component tokens | `button-radius`, `card-radius`, `input-radius` | `rounded-button`, `rounded-card`, `rounded-input` |
| Elevation | `elevation-sm/md/lg/xl`, `elevation-brand`, `elevation-brand-active` | `elevation-sm/md/lg/xl` |
| Motion | `duration-fast/normal/slow`, `ease-standard` | `duration-(--duration-fast)` etc. |
| Layout | `app-toolbar-height` | `h-toolbar`, `pt-toolbar` |

`prefers-reduced-motion` sets the motion durations to near zero.

Not themeable (by design): breakpoints (fixed at build time), z-index (app structure), the type scale (Tailwind default sizes).

## Common changes

**Dark/light colors.** Edit the color values in `:root` (light) and `.dark` (dark) in `src/index.css`. Both blocks must define every color token (the contract test checks it).

**Corner radius everywhere.** Change `--radius` in `:root`. Cards and inputs derive from it; buttons are pills by default (`--button-radius: 9999px`) — set `--button-radius: var(--radius)` to make them follow too.

**Density.** Change `--spacing` (default `0.25rem`). Smaller = denser.

**Fonts.** Change `--body-font` / `--heading-font` / `--mono-font` and load the font in `index.html`.

**A component that should differ by brand.** Add a component token only when a real need appears (decision D5): define `--<component>-<property>` in `:root` defaulting to a shared token, map it in `@theme inline`, add it to `THEME_SHARED_TOKENS`, use the utility in the kit component, and teach `cn()` (`src/shared/utils/cn.ts`) the new class if it can conflict with built-ins. Structural differences (layout, markup) stay code: edit the kit component's variants.

**A new color.** Add it to both `:root` and `.dark`, map `--color-<name>: var(--<name>)` in `@theme inline`, and add it to `THEME_COLOR_TOKENS`.

## Runtime overrides (per-login restyling)

```ts
import { applyTheme, clearTheme } from "@/shared/theme/themeTokens";

applyTheme({ primary: "#2563eb", "primary-gradient-start": "#1e40af", radius: "0.25rem" });
clearTheme(); // back to the stylesheet values
```

- Overrides apply on top of the active light/dark palette (same value in both modes).
- Unknown token names are a type error.
- The boilerplate ships no policy for *who* gets which theme (org, user, role); apps decide where overrides come from (e.g. a profile or organization record) and call `applyTheme` after login. Per-mode brand palettes are a deferred extension (D7).

## Color mode in code

```tsx
import { useColorMode } from "@/shared/context/ColorModeContext";

const { mode, resolvedMode, setMode } = useColorMode(); // mode: "light" | "dark" | "system"
```

`ColorModeProvider` wraps the app in `src/App.tsx`. The inline script in `index.html` applies the stored mode before React loads; it mirrors `colorMode.ts` and `colorMode.test.ts` keeps the storage key, mode names and class in sync.

**Content Security Policy:** the app sets no CSP today. If you add one, allow the inline color-mode script by its hash (or move it to a static file served before the bundle).

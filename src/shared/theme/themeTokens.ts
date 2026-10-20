/**
 * Theme token contract. Every name here is a CSS variable defined in
 * src/index.css (`:root` = light defaults, `.dark` = dark color overrides).
 * themeTokens.test.ts keeps this list and the stylesheet in sync.
 * Guide: documentation/DOC_THEMING.md
 */

/** Tokens whose values differ between light and dark (defined in `:root` and `.dark`). */
export const THEME_COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "primary-gradient-start",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "warning",
  "info",
  "border",
  "input",
  "ring",
  "overlay",
  "scrollbar",
  "scrollbar-hover",
] as const;

/** Tokens shared by both modes (defined once in `:root`). */
export const THEME_SHARED_TOKENS = [
  "body-font",
  "heading-font",
  "mono-font",
  "radius",
  "spacing",
  "app-toolbar-height",
  "button-radius",
  "card-radius",
  "input-radius",
  "duration-fast",
  "duration-normal",
  "duration-slow",
  "ease-standard",
  "elevation-sm",
  "elevation-md",
  "elevation-lg",
  "elevation-xl",
  "elevation-brand",
  "elevation-brand-active",
] as const;

export const THEME_TOKENS = [...THEME_COLOR_TOKENS, ...THEME_SHARED_TOKENS] as const;

export type ThemeTokenName = (typeof THEME_TOKENS)[number];

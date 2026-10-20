import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_COLOR_TOKENS, THEME_TOKENS } from "./themeTokens";

const css = readFileSync(resolve(__dirname, "../../index.css"), "utf8");

/** Returns the custom property names declared directly in the first `selector { ... }` block. */
const declaredIn = (selector: string): Set<string> => {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return new Set();
  const end = css.indexOf("\n}", start);
  const block = css.slice(start, end);
  return new Set([...block.matchAll(/^\s*--([a-z0-9-]+):/gm)].map((match) => match[1]));
};

describe("theme token contract", () => {
  it("should define every theme token in :root", () => {
    const root = declaredIn(":root");
    const missing = THEME_TOKENS.filter((token) => !root.has(token));
    expect(missing).toEqual([]);
  });

  it("should override every color token in .dark", () => {
    const dark = declaredIn(".dark");
    const missing = THEME_COLOR_TOKENS.filter((token) => !dark.has(token));
    expect(missing).toEqual([]);
  });

  it("should not declare unlisted tokens in :root", () => {
    const listed = new Set<string>(THEME_TOKENS);
    const unlisted = [...declaredIn(":root")].filter((token) => !listed.has(token));
    expect(unlisted).toEqual([]);
  });
});

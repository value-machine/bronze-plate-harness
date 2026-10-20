# Decisions — W3C DTCG design tokens

Job: `temp_job_dtcg-tokens`
Updated: 2026-10-20

Precedes `temp_job_bronze-theme` (owner: "First, i want careful implementation of a max compatibility W3C Design Tokens (DTCG) Format").

Sources: https://www.designtokens.org/TR/2025.10/ (format, color, resolver), https://github.com/design-tokens/community-group (`/schemas`, `/test-suite`), living draft https://www.designtokens.org/tr/drafts/format/.

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Spec version to target | closed | DTCG **2025.10** stable: Format + Color + Resolver modules (`.tokens.json`, `.resolver.json` with `"version": "2025.10"`) | plan-grill | clear-winner `[Wins: compatibility]`. Lost: living draft (dated 2026-09-08; says "Do not attempt to implement this version"); older editors' drafts (pre-color-module, string colors). Validation against the official JSON schemas in the community-group repo `/schemas`. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|
| O1 | Token SSOT | open | DTCG JSON master + generated CSS (reverses theming D6) / CSS master + DTCG export / DTCG read at runtime | plan |

## Log

- 2026-10-20 — D1 closed via plan-grill (clear-winner)
- 2026-10-20 — O1 asked

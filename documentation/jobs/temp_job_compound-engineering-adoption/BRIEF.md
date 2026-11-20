# Brief — Adopt Compound Engineering learnings into the harness (lap 1: fresh-eyes claim check)

Task: Adopt Compound Engineering learnings into the harness · Lap: temp_job_compound-engineering-adoption · Harness: v0.44.0
Scoped with CE's `ce-brainstorm` method instead of `loop-refine` (D2). One CE piece per lap (D3); this lap's piece is the claim check (D4).

## Problem
`loop-refine` writes claims about how the repo works (§ Edges "Loop today", absence claims, Foundation signals) and only the same agent that wrote them checks them, so a wrong claim reaches `loop-plan` and `loop-build` as fact.

## Success check
After this lap, `loop-refine`'s steps send every checkable claim in a draft brief to a read-only subagent that never saw the conversation, and the brief is corrected (refuted) or labelled (unverifiable) before the restatement line; a brief with no checkable claims skips it.

## Owner test
none — a skill change; nothing shows in the app. Consent for the protected skill edit is asked in chat before commit.

## In scope
- A claim-check step in `loop-refine` § Steps, between drafting / answers and sizing (D6).
- One new reference `loop-refine/references/claim-check.md`: which claims count as checkable, the self-contained verifier brief, the verdict format (D7), how refuted and unverifiable claims change the brief, the skip rule (D5).
- `loop-refine` § Edges `Calls` row and Output wording updated to name the step; `grounding.md` § Verify before you state points to it instead of restating it.
- `brief-template.md`: unverifiable claims are written as labelled assumptions.

## Out of scope
- Will NOT do: any other `ce-brainstorm` piece (one-piece-of-work check, pressure test, showing alternatives, ready check, progress list) — later laps, one each (D3).
- Will NOT do: model tiers, evidence dossiers or cross-model verification from CE — no second vocabulary.
- Will NOT touch: `agent-behavior` asking rules, the Stop 1 restatement format, `loop-plan`, `loop-check`.

## Edges
| Feature area | Loop today | Hook point | Ride / new |
|---|---|---|---|
| `loop-refine` skill | draft brief (step 4) → owner questions (steps 5–6) → size (7) → restatement + `loop-plan` (8); self-check only via `grounding.md` § Verify before you state | new step after 6, before 7 | ride — extends the existing step list |
| `loop-refine/references/` | `brief-template.md`, `grounding.md`, `asking.md`, `decisions-template.md`, `requirements.md` | new `claim-check.md` | new — no existing reference holds a verifier brief for refine |
| Subagent pattern | `loop-check` already dispatches read-only subagents; `meta-audit-harness` and `meta-intake-harness` keep self-contained briefs in `references/subagent-briefs.md` | follow the same self-contained, read-only brief shape | ride — same pattern, refine-specific content |
| `loop-orchestrate` threads | threads run `loop-refine` | inherits the step | ride — no change there |

Overrun rule (skill-loop D51): a diff that touches a feature area **not** in this table stops the lap.

## Foundation signals
- none found in the touched files.
- Absorbed: none.

## Size
S — one skill, one new reference, two small reference edits. Edits go through `meta-write-skill` (port map unchanged: no v0.42.0 source moves).
Cut into laps: none for this piece. The remaining pieces are later laps (D3).

## Decisions
`DECISIONS.md` D1–D8; no conflict with a recorded decision (the step adds no owner question).
Claim check: 10 confirmed · 0 refuted · 0 unverifiable

## Plan

Acceptance check (manual script; fails before the build):

```bash
test -f .agents/skills/loop-refine/references/claim-check.md \
  && grep -q "references/claim-check.md" .agents/skills/loop-refine/SKILL.md \
  && grep -q "claim-check.md" .agents/skills/loop-refine/references/grounding.md \
  && grep -q "Assumption" .agents/skills/loop-refine/references/brief-template.md \
  && echo PASS || echo FAIL
```

Conflict & compliance: protected skill files, owner consent given in chat (D8). Edits follow `meta-write-skill` (template sections unchanged; no port-map rows: nothing moves from a v0.42.0 source; catalog row unchanged since triggers don't change). Placement: `.agents/skills/loop-refine/references/*.md` is allowed by the skill whitelist. Inserting the step after step 6 renumbers steps 7–8 to 8–9; `loop-refine/references/PORT_MAP.md` cites "§ Steps 8" and moves to 9 (found during build; the planning grep missed the "§ Steps N" form). No app code, no tests beyond the script.

Phase 1 — Build (gate: acceptance check PASS)
1. New `references/claim-check.md`: what counts as a checkable claim, the self-contained read-only verifier brief, verdict format (D7), how refuted / unverifiable claims change the brief, skip rule (D5).
2. `SKILL.md`: new step 7 "Check the claims" between Ask and Size (D6); `Calls` row names it; renumber.
3. `grounding.md` § Verify before you state: one pointer line to the fresh-eyes check.
4. `brief-template.md`: unverifiable claims are written as `Assumption — unverified: …`.

Phase 2 — Integrate (gate: `node scripts/sync-agent-config.mjs`, `pnpm validate:skills`, `pnpm validate:docs`, `pnpm validate:structure` all pass)

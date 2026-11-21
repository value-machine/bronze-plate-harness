# Brief — loop-refine: one-piece-of-work check (from Compound Engineering)

Task: loop-refine: one-piece-of-work check (from Compound Engineering) · Lap: temp_job_refine-one-piece-check · Harness: v0.44.0
Second ce-brainstorm piece, one per lap (compound-engineering-adoption D3).

## Problem
When a request bundles several separately useful outcomes, `loop-refine` scopes them as one lap; it only cuts work by size (skill-loop D44), so the owner never chooses which outcome comes first and the brief's success check blurs across outcomes.

## Success check
After this lap, `loop-refine` checks a request for separately useful outcomes before drafting the brief; when it finds two or more it proposes the split, asks the owner once which one this lap owns (skipped when the owner already named one), and turns the others into backlog tasks right after the current top task; a request with one outcome gets no new question.

## Owner test
none — a skill change; nothing shows in the app. Consent for the protected skill edit is asked in chat before any edit.

## In scope
- A new `loop-refine` step "One piece of work?" right after step 2 (read before asking), before drafting (D2).
- One new reference `loop-refine/references/one-piece-check.md`: the split test (own value and own acceptance, deliverable without the others), when to keep a request together, the question (per `asking.md`), what happens to the other outcomes, the orchestrated-thread case, the away-switch case.
- Step numbers after the new step move up by one; every reference to them is updated in the same change.
- One new eval case `loop-refine/evals/bundled-request-asks-which/` (fixture, prompt, graders).

## Out of scope
- Will NOT do: other ce-brainstorm pieces (ready check, progress list, pressure test, showing alternatives) — later laps (compound-engineering-adoption D3).
- Will NOT touch: `loop-backlog` (its direct-request rule, skill-loop D26, stays), `loop-orchestrate`, the size cut (skill-loop D44), `agent-behavior` asking rules.

## Edges
| Feature area | Loop today | Hook point | Ride / new |
|---|---|---|---|
| `loop-refine` skill | Steps: 1 open lap → 2 read before asking → 3 bugs → 4 draft → 5 find questions → 6 ask → 7 check claims → 8 size (cuts > M into laps, rest become backlog tasks after the top task) → 9 restate | new step 3; steps 3–9 become 4–10 | ride — extends the step list |
| `loop-refine/references/` | `asking.md` holds the one-question protocol with a challenge option; `claim-check.md` cites steps 7, 8 and 4–6 | new `one-piece-check.md`; `claim-check.md` step numbers +1 | new reference + ride |
| Step-number citations | `loop-refine/references/PORT_MAP.md` cites § Steps 2, 5–6 and 9; `router/references/PORT_MAP.md` cites loop-refine § Steps 5–6 | renumber the cited steps after 2 | ride |
| `loop-refine/evals/` | two cases: `sharp-request-no-questions`, `conflict-asks-once` | third case | new |
| `loop-orchestrate` threads | threads run `loop-refine`; the orchestrator owns task state, threads route owner questions through it (orchestrator-parallel-laps D3, D4) | the check reports the split to the orchestrator instead of editing the backlog | ride — no change in `loop-orchestrate` |

Overrun rule (skill-loop D51): a diff that touches a feature area **not** in this table stops the lap.

## Foundation signals
- none found in the touched files.
- Absorbed: none.

## Size
S — one skill, one new reference, one eval case, mechanical renumbering in four files.
Cut into laps: none.

## Decisions
`DECISIONS.md` D1–D4; no conflict with a recorded decision (skill-loop D44 cuts by size and stays; this check splits by outcome before it).
Claim check: 11 confirmed · 0 refuted · 0 unverifiable

## Plan

Acceptance check (manual script; fails before the build):

```bash
d=.agents/skills/loop-refine
test -f $d/references/one-piece-check.md \
  && grep -q '^3\. \*\*One piece of work?\*\*' $d/SKILL.md \
  && grep -q '^10\. \*\*Restate and hand off' $d/SKILL.md \
  && grep -q 'step 8 verifies' $d/references/claim-check.md \
  && grep -q 'Steps 6–7' .agents/skills/router/references/PORT_MAP.md \
  && test -f $d/evals/bundled-request-asks-which/case.yaml \
  && echo PASS || echo FAIL
```

Conflict & compliance: protected skill files, consent D5. `meta-write-skill` conventions (sections unchanged; catalog row and triggers unchanged; no port-map rows added, only step numbers). Placement: `references/*.md` and `evals/<case>/` follow the existing loop-refine layout. `grounding.md`'s "Steps 1–3 / Step 4" are its own grill stages, not SKILL steps: unchanged.

Phase 1 — Build (gate: acceptance check PASS)
1. New `references/one-piece-check.md` (split test, keep-together test, question, other outcomes, thread case D3, away switch D4).
2. `SKILL.md`: new step 3 (D2), renumber 3–9 → 4–10, `Calls` row.
3. Renumber citations: `claim-check.md` (7→8, 8→9, 4–6→5–7), `loop-refine/references/PORT_MAP.md` (5–6→6–7, 9→10), `router/references/PORT_MAP.md` (5–6→6–7).
4. Eval case `evals/bundled-request-asks-which/` modelled on `conflict-asks-once`.

Phase 2 — Integrate (gate: `node scripts/sync-agent-config.mjs`, `pnpm validate:skills`, `pnpm validate:docs`, `pnpm validate:structure`)

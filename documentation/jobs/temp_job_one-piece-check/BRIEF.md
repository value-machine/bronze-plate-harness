# Brief — loop-refine: one-piece-of-work check

Task: loop-refine: one-piece-of-work check (from Compound Engineering) · Lap: temp_job_one-piece-check · Harness: v0.44.0
Second ce-brainstorm piece (compound-engineering-adoption D3); source: CE ce-brainstorm coherent-work gate (v3.38.2). Why / what / consequences: `documentation/jobs/harness/2026-11-20-COMPOUND_ENGINEERING_COMPARISON.md` § ce-brainstorm pieces, row 1.

## Problem
`loop-refine` cuts work only by size (step 8: larger than M → several laps). A request that bundles separate outcomes, each small, becomes one lap, one PR and one Stop 2 verdict. The owner can then only pass or change everything together, and one weak piece holds back the rest. In the first CE lap, the request held four independent outcomes. Only an ad-hoc check turned that into one owner choice (compound-engineering-adoption D1).

## Success check
Given a request that bundles two outcomes the owner could judge separately, `loop-refine` asks one question before drafting the brief: which outcome this lap owns. The question names the recommended piece, the others and a keep-together option. The pieces left out become backlog tasks right after the current top. Given a single outcome, a prerequisite chain, or a request the owner explicitly wants together, it asks nothing extra.

## Owner test
none: a skill change with nothing to see in the app. Consent for the protected skill edits is asked in chat before the commit.

## In scope
- New `loop-refine/references/one-piece.md`: the test for separate outcomes (D2), what doesn't count, the question shape, where the other pieces go (backlog, or the orchestrator under `loop-orchestrate`), and behavior under the away switch.
- `loop-refine` SKILL.md: one sentence at the end of step 2 runs it before the draft (D1), plus the `Calls` row.
- One eval case `loop-refine/evals/bundled-request-asks-which-piece/`.

## Out of scope
- Will NOT do: other ce-brainstorm pieces (ready check, progress list, pressure test, alternatives): later laps, one each.
- Will NOT touch: step numbering in `loop-refine` (five files cite its step numbers, several more than once), `loop-backlog`, `loop-orchestrate`, the asking rules in `agent-behavior`.

## Edges
| Feature area | Loop today | Hook point | Ride / new |
|---|---|---|---|
| `loop-refine` steps | step 2 reads the vision, feature READMEs and code; step 4 drafts `BRIEF.md`; step 8 cuts work larger than M into laps (skill-loop D44) | end of step 2, before the draft | ride: one sentence plus a reference |
| `loop-refine/references/` | `asking.md` (how to ask), `claim-check.md` (a step's procedure in its own reference) | new `one-piece.md`, same pattern as `claim-check.md` | new |
| Backlog writes under `loop-orchestrate` | threads never edit `app-tasks.json`; the orchestrator owns task state (orchestrator-parallel-laps D3) | the thread reports split-off pieces to the orchestrator | ride: no orchestrator edit |
| `loop-refine/evals/` | `conflict-asks-once`, `sharp-request-no-questions` | new case in the same layout | ride |

Overrun rule (skill-loop D51): a diff that touches a feature area **not** in this table stops the lap.

## Foundation signals
- none found in the touched files.

## Size
S: one sentence in a skill, one new reference, one eval case.

## Decisions
`DECISIONS.md` D1–D5; D6 (consent) is asked in chat.
Claim check: 8 confirmed · 1 refuted (the count of files citing step numbers; corrected) · 0 unverifiable

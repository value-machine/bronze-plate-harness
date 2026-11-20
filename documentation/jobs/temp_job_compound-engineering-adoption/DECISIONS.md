# Decisions — compound-engineering-adoption

Job: `temp_job_compound-engineering-adoption`
Updated: 2026-11-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Which CE candidate this lap owns | closed | Fold `ce-brainstorm`'s useful parts into `loop-refine` | owner | CE coherent-work gate. Rejected for this lap: behavioral skill evals, lesson form order + sizing test (both now backlog tasks), R10–R12 first (already backlog tasks). Persona review stays with R12 |
| D2 | How this lap is scoped | closed | Run CE's `ce-brainstorm` method (task-list spine, scope tier, coherent-work gate, pressure test, approaches, claim check, ready check) instead of `loop-refine`, but write the result as this repo's `BRIEF.md` + `DECISIONS.md` in the lap folder | owner + clear-winner | Owner asked for the CE method. Output format is a clear winner: `loop-plan` reads `BRIEF.md`; CE's `docs/plans/*-plan.md` would bypass the lap contract (skill-loop D45). Rejected: CE unified-plan file |
| D3 | How ce-brainstorm is adopted | closed | One piece per lap, each wired through the harness on its own; only pieces that improve it (REFINE_ANALYSIS.md). Pieces 2 and 3 (pressure test, showing alternatives) need their own owner decision when their turn comes | owner | Rejected: adopt several pieces at once (conflict risk) |
| D4 | First piece | closed | Fresh-eyes claim check in `loop-refine` | owner | Rejected for this lap: one-piece-of-work check, ready-for-planning check, progress list (later laps, one each) |
| D5 | When the claim check runs | closed | Every refine whose brief makes checkable claims about the repo; skipped only when it makes none | loop-refine | clear-winner: CE ce-brainstorm 2.6 skip rule. Rejected: skip at XS (XS briefs still state how the code behaves in § Edges, and a wrong claim costs a build round at any size) |
| D6 | Where in loop-refine | closed | After the draft and owner answers, before sizing and the restatement; refuted claims are corrected, unverifiable ones become labelled assumptions | loop-refine | clear-winner: Stop 1's restatement doesn't wait, so CE's "run during the owner's think time" has no slot. Rejected: in loop-plan (the plan would already build on the claim) |
| D7 | Verifier output | closed | Per-claim verdict confirmed / refuted / unverifiable with a file:line, read-only, ~15 reads | loop-refine | clear-winner: CE ce-brainstorm 2.6 contract; matches the read-only subagents loop-check already runs |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-20 — D1 closed via owner (asked)
- 2026-11-20 — D2 closed via owner request + clear-winner on output format
- 2026-11-20 — D3 closed via owner (one piece per lap)
- 2026-11-20 — D4 closed via owner (asked)
- 2026-11-20 — D5, D6, D7 closed via loop-refine (clear-winner)
- 2026-11-20 — Brief claims C1–C10 checked by a fresh-context read-only subagent (the method this lap adopts): 10 confirmed, 0 refuted, 0 unverifiable

# Decisions — refine-one-piece-check

Job: `temp_job_refine-one-piece-check`
Updated: 2026-11-21

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Where bundled requests are caught and who picks the first outcome | closed | `loop-refine` proposes the split and asks the owner which outcome this lap owns; the rest become backlog tasks right after the top task | owner | Rejected: `loop-backlog` splits on insert and its order question picks (changes skill-loop D26's no-confirm rule for direct requests); silent split by the agent (owner corrects via the restatement line); no new check |
| D2 | Where in loop-refine | closed | New step 3, right after reading (step 2) and before drafting | loop-refine | clear-winner: the split needs the repo read (to judge "separately useful") and must come before the brief is drafted around one outcome. CE runs it before deep exploration for the same reason. Rejected: folding it into step 2 (asks mid-read), into the size step (the brief is already written around all outcomes) |
| D3 | Orchestrated threads | closed | In a thread, report the proposed split to the orchestrator instead of writing tasks or asking the owner | loop-refine | clear-winner: the orchestrator owns task state and the owner talks only to it (orchestrator-parallel-laps D3, D4) |
| D4 | Away switch | closed | Picking the first outcome is a true tie: with the away switch on, the agent picks by value per size and logs it as `agent-pick` | loop-refine | clear-winner: matches agent-behavior § When to ask (away switch decides ties) and loop-backlog's value-per-size ranking |
| D5 | Protected-file consent | closed | Owner approved editing loop-refine SKILL.md, a new one-piece-check.md, step numbers in claim-check.md and both PORT_MAP files, and a new eval case | owner | asked in chat before any edit |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-21 — D1 closed via owner (asked)
- 2026-11-21 — D2, D3, D4 closed via loop-refine (clear-winner)
- 2026-11-21 — D5 closed via owner (consent)

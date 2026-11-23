# Decisions — one-piece-check

Job: `temp_job_one-piece-check`
Updated: 2026-11-23

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Where the check runs | closed | End of `loop-refine` step 2: after reading, before the draft; procedure in `references/one-piece.md` | loop-refine | clear-winner. Rejected: a new numbered step (renumbers steps 3–9, which five files cite, some several times); step 5 (the brief would already be drafted for the whole bundle); `loop-backlog` (it doesn't read the code, so it can't judge independence) |
| D2 | What counts as separate outcomes | closed | Two or more outcomes that each have their own success check and that the owner could judge apart: Pass one while changing or dropping another. Not separate: a prerequisite chain (B needs A), parts that only work together, or a request the owner explicitly asked to keep together | loop-refine | clear-winner: Stop 2 has one verdict per PR, so the cost of bundling is a shared verdict. Rejected: CE's "distinct work units" without a test; splitting by size only (step 8 already covers size) |
| D3 | Ask or decide | closed | Ask one choice question: this lap takes the recommended piece (prerequisite first, else best value per size), another piece, or keep together. Under the away switch it is a true tie: the agent picks by the same order and logs it | loop-refine | The task description says the check adds a Stop 1 question only when a request bundles outcomes. Rejected: always split silently (the owner may want one verdict) |
| D4 | Where the other pieces go | closed | New backlog tasks right after the current top, as with step 8's size cut (skill-loop D44); under `loop-orchestrate` the thread reports them to the orchestrator, which writes them | loop-refine | clear-winner: one writer of `app-tasks.json` during a run (orchestrator-parallel-laps D3) |
| D5 | Proof | closed | One eval case: a bundled request leads to exactly one which-piece question before any brief is written | loop-refine | clear-winner: the existing `conflict-asks-once` case has the same shape |
| D6 | Protected-file consent | closed | Owner approved editing `loop-refine` SKILL.md (step 2 sentence and `Calls` row), a new `references/one-piece.md` and a new eval case | owner | asked in chat before any edit (agent-behavior § Protected Files) |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-23 — D1–D5 closed via loop-refine (clear-winner or task description)
- 2026-11-23 — Claim check by a fresh read-only subagent: 8 confirmed, 1 refuted (file count in D1; corrected)
- 2026-11-23 — D6 closed via owner (consent)

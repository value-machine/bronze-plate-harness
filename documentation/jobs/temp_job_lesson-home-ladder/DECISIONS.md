# Decisions — lesson-home-ladder

Job: `temp_job_lesson-home-ladder`
Updated: 2026-11-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Retrievable notes store | closed | No new store; tier 5 allows only homes with a fixed reader (feature README, debug patterns) | loop-refine | Alternative: CE-style `docs/solutions/` with `applies_when` + a lookup step in refine/plan. Rejected: needs a structure change and a new read step, and both existing homes are already read at a fixed step. |
| D2 | Where a harness-general lesson travels | closed | Commit trailer `Lesson-scope: harness`, gathered by `meta-write-adoption-guide` | loop-refine | Alternatives: a ledger file (new structure), a backlog task per lesson (noise). Trailer costs nothing and is searchable with `git log --grep`. |
| D3 | Proof a new check works | closed | Must fail on the defect shape in a throwaway copy, never in the working tree; unproven → next tier | loop-refine | From CE `ce-compound` form.md. |
| D4 | Owner consent for this lap's protected skill edits | closed | Given in chat ("run a lap … let fable handle the implementation" after the four-item proposal) | owner | Covers `.agents/skills/meta-learn-lessons/**`, `.agents/skills/meta-write-adoption-guide/**`. No `.claude/rules/**` edits. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-20 — D1–D3 closed via loop-refine (clear-winner); D4 via owner (asked)

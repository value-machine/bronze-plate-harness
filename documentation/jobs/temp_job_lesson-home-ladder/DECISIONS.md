# Decisions — lesson-home-ladder

Job: `temp_job_lesson-home-ladder`
Updated: 2026-11-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Retrievable notes store | closed | No new store; tier 5 allows only homes with a fixed reader (feature README, debug patterns) | loop-refine | Alternative: CE-style `docs/solutions/` with `applies_when` + a lookup step in refine/plan. Rejected: needs a structure change and a new read step, and both existing homes are already read at a fixed step. |
| D2 | Where a harness-general lesson travels | closed | `Lessons:` line (`Lesson-scope: harness — <file § section>`) in the lap's `DOC_DECISION_LOG.md` section; outside a lap its own lesson commit; on Drop in the task text. Gathered by `meta-write-adoption-guide` | loop-plan (review A4) | Replaces a commit trailer: squash merges keep it only as body text and only under `COMMIT_MESSAGES` (forks may use PR title/body), and a manual `/learn` rides `loop-ship`'s commit. |
| D3 | Proof a new check works | closed | Tighten an existing check only; must fail on the defect shape in a scratch copy outside the repo, before the owner ask; too big or unproven → backlog task, and continue down the ladder with a line naming the task (removed when it lands) | loop-plan (review A3) | From CE `ce-compound` form.md. Alternative "stop with no interim prose" rejected: the mistake could repeat until the task lands. |
| D5 | Ladder order | closed | One way → check → area-scoped home (README / path-scoped rule / patterns) → skill or reference edit → always-on rule | loop-plan (review A1) | Area homes cost less context than stage skills, stage skills less than always-on rules. Blank-model test gates prose tiers 3–5 only (A2). |
| D4 | Owner consent for this lap's protected skill edits | closed | Given in chat ("run a lap … let fable handle the implementation" after the four-item proposal) | owner | Covers `.agents/skills/meta-learn-lessons/**`, `.agents/skills/meta-write-adoption-guide/**`. No `.claude/rules/**` edits. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-20 — D1–D3 closed via loop-refine (clear-winner); D4 via owner (asked)

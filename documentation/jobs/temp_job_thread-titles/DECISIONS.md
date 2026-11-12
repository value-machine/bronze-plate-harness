# Decisions — thread-titles

Job: `temp_job_thread-titles`
Updated: 2026-11-12

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Who renames | closed | The orchestrator only; threads are briefed never to rename | loop-refine | clear-winner: one writer avoids races. Rejected: threads rename themselves |
| D2 | Machine record of the blocker | closed | A `waits-on:<lap-slug>` tag per blocker on the waiting session; the title is for the owner | loop-refine | clear-winner: survives restarts and multiple blockers, matches orchestrator-parallel-laps D12 (sessions are the record). Rejected: blocker only in title text |
| D3 | Wake-up channel | closed | Superseded by D11: no timed check-in. Never a PR watch by the orchestrator | loop-refine | constraint: a PR has one watcher, and the thread already watches its own |
| D4 | D10 premise | closed | Child sessions can message the orchestrator; D10's choice stands, its note is corrected | live test | Verified: child → parent `send_message` delivered |
| D5 | Set and clear are atomic | closed | Pause/continue message, tag and title change together in one action | loop-refine | clear-winner: the owner's stale-title bug came from a restore with no trigger |
| D6 | Status line | closed | Add a `Held: <task> (waits on <task>)` slot | loop-refine | clear-winner: the Briefs step can hold a thread and the line had no slot for it |
| D7 | Restart | closed | Step 1 (Orient) runs the check-in once | loop-refine | clear-winner: rebuilds titles after an orchestrator restart |
| D8 | Title format | closed | Goal first: `⏸ <goal> · waits on <blocker goal>` | owner | Rejected: blocker first (truncation hides which thread waits); `Thread:` prefix (costs width); blocker only in the status line |
| D9 | Goal text source | closed | The task's backlog title, as-is | owner | Rejected: orchestrator-written short outcome; thread's Building line after refine; a backlog rule for short titles |
| D10 | How a waiting state starts | closed | The thread reports needing another thread's result, or the orchestrator holds it after the overlap re-check | owner | Rejected: thread-report only; orchestrator only; never pause (split the remainder into a queued task) |
| D11 | What updates titles | closed | Actions only, no timed check-in: the orchestrator's own merge or Drop; the blocker thread messaging `merged` / `closed` when its PR event arrives (owner merged on GitHub); the platform's failed-child notice; one sweep in step 1 on restart | owner | Rejected: 30 or 10 min check-ins; asking the owner at once on stall |
| D14 | Merged on GitHub without the orchestrator | closed | The thread's `merged` message makes the orchestrator archive it and clear its waiters | loop-refine | clear-winner: owner's first ask (merged threads are just archived) plus D11's wiring |
| D12 | Blocker dropped | closed | The orchestrator re-checks the waiting thread's brief: continue if it doesn't need the dropped change, else re-scope; asks the owner only if neither works | owner | Rejected: ask every time; just continue; drop waiters together |
| D13 | Thread permission to message back | closed | Out of scope: which actions need approval is a Claude setting, never written into a skill | owner | Removed the permission lines from the skill and D17 |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-12 — D1–D3, D5–D7 closed via loop-refine (clear-winner); D4 closed via live test
- 2026-11-12 — D8 closed via loop-refine (asked)
- 2026-11-12 — D9 closed via loop-refine (asked)
- 2026-11-12 — D10 closed via loop-refine (asked)
- 2026-11-12 — D11 closed via loop-refine (owner); D3 superseded; D14 closed (clear-winner)
- 2026-11-12 — D12 closed via loop-refine (asked)
- 2026-11-12 — D13 closed via owner (settings stay out of skills); all decisions applied to loop-orchestrate

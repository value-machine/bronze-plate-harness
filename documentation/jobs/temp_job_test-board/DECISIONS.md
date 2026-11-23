# Decisions — test-board

Job: `temp_job_test-board`
Updated: 2026-11-23

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Scope | closed | Orchestrator runs only; the plain loop keeps the chat handoff | owner | Rejected: a board for every lap (bigger change, loop-ship too) |
| D2 | Where verdicts live (conflict with merge-is-pass D4) | closed | On the board: a Pass / Change / Drop there counts like one in chat; `agent-behavior` § How to ask names the board as a third place | owner | Rejected: board for steps only with verdicts still in chat. Answer was also consent for editing loop-orchestrate, loop-verdict and the agent-behavior line |
| D3 | Chat output while a board exists | closed | Board link plus one line per change; steps and verdict questions are never restated in chat | loop-refine | clear-winner: the restating is the problem the owner reported |
| D4 | Board storage | closed | Multi-file artifact: a fixed page plus `board.json` saved through the files form of `artifact.publish` | loop-refine | clear-winner: neither side regenerates the page, and the orchestrator reads one small JSON. Rejected: state in the `db` capability (no wake-up for the session), regenerating the whole HTML on every save |
| D5 | How the orchestrator hears the owner | closed | The publish watch on the board, plus reading the board on every other event | loop-refine | The watch on a page-made save is unverified until the first real run; the read on every event covers a missed notice |
| D6 | Surfaces without artifacts | closed | Keep the `loop-verdict` chat handoff | loop-refine | clear-winner: Cursor and terminals have no Artifact tool |
| D7 | Who writes which file (from the Fable 5.2 review) | closed | One writer per file: the orchestrator writes `board.json`, the page appends to `owner.json` with `ifMatch`; handled entries are tracked in `board.json`, so owner fields are never cleared | review | Fixes the routine conflict where an orchestrator write dropped the owner's save. Rejected: one shared `board.json` |
| D8 | When the page saves | closed | Only on a verdict or a message; ticks and notes stay on the device (localStorage, per lap and round) until then, and unsent entries are resent on load | review | A tick-only save would cost a wake-up and an empty turn. Rejected: a Save progress button |
| D9 | Guarding verdicts | closed | Two taps per verdict; Change and Drop need a ✗ step or a note; verdicts carry the card's `round`, and a stale round is answered but not acted on; a verdict typed in chat always counts; on restart the orchestrator finds the run's board and watches it again | review | Pass merges to production, so one stray tap must not trigger it |
| D10 | What wakes the orchestrator (live smoke test) | closed | With each verdict or message the page also sends one comment to Claude on that card (`comments.sendToClaude`) carrying the verdict, round, entry id and note; the orchestrator replies in that comment thread and resolves it. The orchestrator reads `owner.json` right before each write, because a page save makes a new version and the Artifact tool refuses a publish not built on it | live test | Seen on the phone: the page save landed but woke nothing, and the next orchestrator publish was refused until it read the new version. Supersedes the "watch on saves" part of D5. A comment sent to Claude is a documented wake for a watched artifact; whether it wakes this session is the second smoke test |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-11-23 — D1, D2 closed via owner (asked; consent for the protected edits)
- 2026-11-23 — D3–D6 closed via loop-refine
- 2026-11-23 — D7–D9 from a Fable 5.2 second-opinion review the owner asked for: no clearly better approach than the board; fixed its holes
- 2026-11-23 — Template checked in Chromium at 390 px, light and dark, with a mocked publish: ticks and notes survive reload, two-tap verdict, `ifMatch` equals the file hash, conflict retries once and lands, no-save view points to chat

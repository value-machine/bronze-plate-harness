# Brief — Orchestrator test board

Task: Orchestrator keeps Stop 2 testing on a test board artifact · Lap: temp_job_test-board · Harness: v0.44.0

## Problem
Under `loop-orchestrate`, Stop 2 handoffs go to chat. Thread reports keep arriving, so the test steps get buried, and the orchestrator restates them to remind the owner. The chat fills with text the owner doesn't need, and tokens go to repeated steps.

## Success check
On a surface that publishes artifacts, `loop-orchestrate` step 4 puts each PR waiting at Stop 2 on one private test board artifact (steps, the owner's ✓ / ✗ and notes, Pass / Change / Drop, messages). It reads verdicts and messages from the board on every event. Chat carries only the board link and one line per change. Surfaces without artifacts keep the chat handoff.

## Owner test
Next orchestrator run: the first Stop 2 publishes the board. Mark a step and tap Change on the board → the orchestrator should react without you writing in chat, and chat should not repeat the steps. Verified in a live smoke test on the owner's phone (Claude app): saving works, and the doorbell comment wakes the orchestrator with no chat message (D10).

## In scope
- New `loop-orchestrate/references/test-board.md`: what the board holds, the `board.json` contract, orchestrator steps, and the page template.
- `loop-orchestrate` SKILL.md step 4, Edges, Output, Examples.
- `loop-verdict` step 2 and intro; `agent-behavior` § How to ask: the board is a third place where the owner decides (D2).

## Out of scope
- A board for the plain single-lap loop (owner picked orchestrator only, D1).
- Stop-list questions from threads stay in chat with the question tool.
- `loop-ship` (its open-question line stays chat-only; not in the consent).

## Size
S — one skill, one new reference, two one-line edits.

## Decisions
`DECISIONS.md` D1–D9. A Fable 5.2 second opinion (owner request) found no better approach; its fixes are D7–D9.

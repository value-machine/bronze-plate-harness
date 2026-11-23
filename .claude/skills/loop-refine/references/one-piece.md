# One piece of work

How [`loop-refine`](../SKILL.md) step 2 checks, before drafting, that a request is one piece of work. Stop 2 has one verdict per PR, so outcomes bundled into one lap share that verdict. The owner can then only pass or change them together, and one weak piece holds back the rest. Step 8's size cut slices one large outcome; this check separates different outcomes, however small. Adopted from the Compound Engineering `ce-brainstorm` coherent-work gate (v3.38.2) (one-piece-check D1–D5).

## Separate outcomes

A request holds separate outcomes when two or more parts each have their own success check, and the owner could judge them apart: Pass one while changing or dropping another.

Not separate, so no question:

- **A chain:** one part needs the other to exist (B builds on A). That is one outcome; if it is too big, step 8 cuts it into laps.
- **Parts that only work together:** a button and the action it triggers, or a field and where it is saved.
- **The owner said together:** "do X and Y in one go", or a Change verdict that lists several fixes to the same lap.

## Ask

When the request holds separate outcomes, ask one choice question before drafting ([`asking.md`](asking.md)). The options:

1. **The recommended piece:** a piece the others depend on, otherwise the best value per size. The label says what happens to the rest ("the others become the next tasks").
2. **Another piece** (one option each, up to the tool's limit).
3. **Keep together:** one lap, one PR, one verdict.

Under the away switch this counts as a true tie: take the recommended piece, log the pick, and go on ([`agent-behavior` rule § When to ask](../../../../.claude/rules/agent-behavior.md)).

## After the answer

- Draft the brief for the chosen piece only, and log the split in `DECISIONS.md`.
- Write each other piece as a backlog task right after the current top task, as step 8 does for size cuts (skill-loop D44). Under [`loop-orchestrate`](../../loop-orchestrate/SKILL.md) the thread doesn't edit `app-tasks.json`: it reports the pieces to the orchestrator, which writes them (orchestrator-parallel-laps D3).

## Example

Request: "Adopt the Compound Engineering learnings: claim check, lesson order, skill evals, persona review." Four outcomes, each with its own success check, and none needs another. One question: "This lap: claim check (Recommended), the other three become the next tasks · lesson order · skill evals · keep together". This is how compound-engineering-adoption D1 was settled by hand.

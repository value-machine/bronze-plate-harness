# One piece of work?

How [`loop-refine`](../SKILL.md) step 3 catches a request that bundles several separately useful outcomes, before the brief is drafted around all of them. The size cut in step 9 slices one outcome that is too big (skill-loop D44); this check separates outcomes that each stand on their own. Adopted from Compound Engineering `ce-brainstorm` § 0.3 Coherent-work gate (v3.38.2) (refine-one-piece-check D1–D4).

## The test

Split only when the request holds two or more outcomes that each have:

- **their own value:** someone gains something when that outcome alone ships;
- **their own acceptance:** a success check can pass or fail without the others;
- **independent delivery:** it can land without the others being built.

Keep the request together when the outcomes are only useful or testable together, or when splitting would force one brief to invent behavior the other owns. These do **not** justify a split on their own: shared users, one end-to-end flow, or coverage across several devices, providers or data sources.

## When it splits

1. **Name the pieces** in chat, in plain language, one line each, with only the relationships the repo shows now: which one depends on or enables another, and which are independent. Mark a guessed relationship as a guess.
2. **Ask once** which piece this lap owns, per [`asking.md`](asking.md) (a choice question, challenge option included). Skip the question when the owner's own words already named the piece; carry that choice forward.
3. **Scope only that piece.** Retitle the top task in `src/config/app-tasks.json` to the chosen piece (description too), so the archive entry at Pass names what landed; the lap slug and branch from step 1 stay. The piece alone feeds the brief's problem, success check and in-scope list; the others appear only under § Out of scope as `deferred`.
4. **Keep the others:** add each as a backlog task right after the current top task in `src/config/app-tasks.json` (size slices that step 9 adds later go in front of them), titled by its outcome, with one line naming the lap it was split from and any dependency. Independent ones are what [`loop-backlog`](../../loop-backlog/SKILL.md) step 5 may later offer as a parallel run.
5. **Log** the split and the owner's pick in the lap's `DECISIONS.md`.

**Orchestrated thread:** don't write tasks or ask the owner. Report the proposed pieces to the orchestrator, which owns task state and the owner's questions, and wait for its answer (orchestrator-parallel-laps D3, D4). The report must list every piece so the orchestrator can queue the ones not picked.

**Away switch on:** the pick is a true tie, so choose the piece with the highest value per size (as [`loop-backlog`](../../loop-backlog/SKILL.md) step 4 ranks; for this pick that replaces `fork-checklist.md` § Tie resolution), log it as `agent-pick`, and continue (`agent-behavior` rule § When to ask).

## When it doesn't split

No question and no note: continue to step 4. A request with one outcome must not get a new question from this check.

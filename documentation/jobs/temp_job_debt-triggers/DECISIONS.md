# Decisions — debt-triggers

Job: `temp_job_debt-triggers`
Updated: 2026-11-19

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | What triggers debt work | closed | Named signals met while exploring code in ordinary laps: insight I1–I5 (word mismatch, bending, wrong grouping, stale explanation, surprise) and friction F1–F7 (shotgun change, copy path, hotspot, hard to test, residue, repeat bug, workaround shape); each routes without an owner decision (`loop-plan/references/debt-signals.md`) | owner | Owner: hook it into normal laps, not a schedule. Sources: Cunningham's debt metaphor, Evans' refactoring toward deeper insight, Fowler's smells, Ousterhout's red flags. Rejected: periodic foundation lap (owner) |
| D2 | Debt never gets lost | closed | Unfixed signals and build notes become `Foundation:` tasks in the ship commit; refine absorbs open ones in the lap's edges while ≤ M; a task waiting 3+ landed laps ranks right after blockers | owner | Foundation tasks have owner test `none`, so they merge on green without a Stop 2 question |
| D3 | Rename on deeper insight | closed | Code follows the product's words (vision, feature README, UI); the greenfield sweep and signal I1 rename touched names, the rest become `Foundation:` tasks; only disagreement among those sources goes to the owner | owner | — |
| D4 | Structural fix by default | closed | The agent takes the structural fix when the lap stays ≤ M; it asks (patch on top) only when the fix would push the lap above M | owner | Narrows skill-loop D7 (always stop on patch-on-top): the owner doesn't read code and can't judge that choice. Edits `agent-behavior` and `architecture` rules with owner consent |

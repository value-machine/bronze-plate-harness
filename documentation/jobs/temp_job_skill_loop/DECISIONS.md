# Decisions — skill loop

Job: `temp_job_skill_loop`
Updated: 2026-10-23

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Instruction taxonomy | closed | Three kinds: rules, loop stages, specialists | grill-me | Rules = always-on coding fundamentals and corrections. Loop stages = one product-owner loop. Specialists = invoked by stages when needed, never the user's entry point. Rejected: two kinds (fold specialists away), three with direct entry, corrections moved into skills. |
| D2 | Product owner stops in the loop | closed | Two planned stops: (1) direction + short scope-edge grill, (2) test the shipped update and pick the next direction. Everything between runs autonomously (plan-grill-auto style). | grill-me | Rejected: plan sign-off stop, risk-scaled stops, backlog-driven steering. |
| D3 | Conflict escalation | closed | Unplanned stop: when a new choice counters an earlier choice, the agent must flag it, propose resolutions, and the PO picks. Flagging conflicts is the agent's job. | grill-me | User-added. Product owner's most important role in the loop. Scope of "earlier choice" → D4. |
| D4 | What counts as an "earlier choice" for D3 | closed | Mainly recorded product decisions (DECISIONS ledger + app vision). Self-resolved conflict handling (layer-consistency, name-the-mechanism, rule compliance) stays and is not exempted. | grill-me | User: recorded decisions are less churn to work through. Rejected: every rule clash stops. |
| D5 | Durable home for product decisions | closed | One durable `documentation/DOC_PRODUCT_DECISIONS.md`; closed job rows are promoted there on landing; the loop's conflict check reads it. | grill-me | New permanent DOC_ file approved by PO via this answer. Rejected: vision-doc section, keep job folders, git-history-only. |
| D6 | `feature` mandatory stops vs D2 | closed | Drop the mandatory stops. All between-stop decisions follow the plan-grill rule: include the PO only when a decision can't be deduced or logically inferred (true tie after enumeration); otherwise log and continue. | grill-me | Refines D2: the middle is plan-grill (ask on true ties), not blanket plan-grill-auto. Fate of the `feature` skill itself → D8. |
| D7 | Always-ask decisions | closed | Always stop for the PO on: (a) adding a new dependency; (b) choosing to patch on top (workaround / hasty coding) instead of the structural fix. Plus D3 conflicts and D6 true ties. | grill-me | (b) matches layer-consistency-check's existing WARNING, WORKAROUND stop; (a) is new and must be wired into dont-reinvent-the-wheel and implement. |
| D8 | `feature` vs `plan` | closed | Fold `feature` into `plan` and consolidate; no separate feature skill. | grill-me | PO: feature is just planning a feature. Supersedes the D6 agent inference that feature stays a specialist. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-23 — D1 closed via grill-me (asked)
- 2026-10-23 — D2–D7 closed via grill-me (asked)
- 2026-10-23 — D8 closed via grill-me (PO stated)
- 2026-10-23 — Stop-2 handoff contents: question withdrawn; PO asked to map all skills/rules first (see MAP.md)

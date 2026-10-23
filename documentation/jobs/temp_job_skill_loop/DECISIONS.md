# Decisions — skill loop

Job: `temp_job_skill_loop`
Updated: 2026-10-23

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Instruction taxonomy | closed | Three kinds: rules, loop stages, specialists | grill-me | Rules = always-on coding fundamentals and corrections. Loop stages = one product-owner loop. Specialists = invoked by stages when needed, never the user's entry point. Rejected: two kinds (fold specialists away), three with direct entry, corrections moved into skills. |
| D2 | Product owner stops in the loop | closed | Two planned stops: (1) direction + short scope-edge grill, (2) test the shipped update and pick the next direction. Everything between runs autonomously (plan-grill-auto style). | grill-me | Stop 2 timing amended by D11. Rejected: plan sign-off stop, risk-scaled stops, backlog-driven steering. |
| D3 | Conflict escalation | closed | Unplanned stop: when a new choice counters an earlier choice, the agent must flag it, propose resolutions, and the PO picks. Flagging conflicts is the agent's job. | grill-me | User-added. Product owner's most important role in the loop. Scope of "earlier choice" → D4. |
| D4 | What counts as an "earlier choice" for D3 | closed | Mainly recorded product decisions (DECISIONS ledger + app vision). Self-resolved conflict handling (layer-consistency, name-the-mechanism, rule compliance) stays and is not exempted. | grill-me | User: recorded decisions are less churn to work through. Rejected: every rule clash stops. |
| D5 | Durable home for product decisions | closed | One durable `documentation/DOC_PRODUCT_DECISIONS.md`; closed job rows are promoted there on landing; the loop's conflict check reads it. | grill-me | New permanent DOC_ file approved by PO via this answer. Rejected: vision-doc section, keep job folders, git-history-only. |
| D6 | `feature` mandatory stops vs D2 | closed | Drop the mandatory stops. All between-stop decisions follow the plan-grill rule: include the PO only when a decision can't be deduced or logically inferred (true tie after enumeration); otherwise log and continue. | grill-me | Refines D2: the middle is plan-grill (ask on true ties), not blanket plan-grill-auto. Fate of the `feature` skill itself → D8. |
| D7 | Always-ask decisions | closed | Always stop for the PO on: (a) adding a new dependency; (b) choosing to patch on top (workaround / hasty coding) instead of the structural fix. Plus D3 conflicts and D6 true ties. | grill-me | (b) matches layer-consistency-check's existing WARNING, WORKAROUND stop; (a) is new and must be wired into dont-reinvent-the-wheel and implement. |
| D8 | `feature` vs `plan` | closed | Fold `feature` into `plan` and consolidate; no separate feature skill. | grill-me | PO: feature is just planning a feature. Supersedes the D6 agent inference that feature stays a specialist. |
| D9 | Interview method per phase | closed | One shared ask protocol (one question per turn, options + challenge, ask only on true ties per D6, always-ask per D7, conflict flag per D3, log to ledger) + a short per-stage "what to ask" focus section. | grill-me | clear-winner after PO raised it. Rejected: one universal interview (loses phase focus); separate interview skill per phase (duplicates mechanics — how grill-me / plan-grill / plan-grill-auto drifted). |
| D12 | Appetite / size estimate | closed | Agent estimates size (XS–L) from: the first refinement (`/refine-request` output) + the edges it touches + the refactor work needed for a clean implementation (cleanup is part of the size, not a separate optional job). Estimate is shown in the Stop 1 summary; PO may object. A recorded estimate counts as an earlier choice, so overrun → D3 conflict stop. | grill-me | PO is not asked to guess size. Confirmation step not stated by PO → shown-in-summary default (agent inference). Names Stop 1's first step `/refine-request`. |
| D10 | Loop shape | closed | STOP 1 Bet: agent proposes 2–3 ranked next directions → PO picks → `/refine-request` (refine, scope) → size estimate (D12). Autonomous: Plan → Build → Check → PR with preview; interrupts only D3, D6, D7, estimate overrun. STOP 2 Review on preview: pass → land / fix → inner loop (Build → Check → preview, no re-bet) / rethink → back to refine. Autonomous close: land, promote decisions to DOC_PRODUCT_DECISIONS.md, `learn` only on troubled laps, propose next bets. | grill-me | Agent proposal at PO's request ("improve this using all your wisdom"); PO engaged and amended via D11/D12. Prioritize moved to the front of Stop 1. |
| D11 | Stop 2 timing | closed | PO tests the PR preview before landing; only a pass merges. Amends D2 ("test the shipped update" → "test the preview"). | grill-me | Rejected: test after landing, size-dependent, feature flags. |
| D13 | Target loop skill set | closed | 8 loop skills: `refine-request` (Stop 1: grill-me + router backlog intake + feature reqs + prime-on-demand + size estimate), `plan` (absorbs feature, plan-grill, plan-grill-auto, quick-piv as XS/S depth, review-dev-plan as M/L step), `implement` (+D7 dependency stop), `validate`, `ship` (finish + push + bundle-ship + git-workflow PR/CI steps), `review-preview` (Stop 2 + close), `ask-protocol` (D9 shared), slim `router` (locate position in loop, resume). | grill-me | Rejected: ~5-skill merge, separate quick-piv fast path, no router. Specialists, rules and meta skills sorted later. |
| D14 | Where next directions come from | closed | A `backlog-management` stage runs at the start of Stop 1, before `/refine-request`: agent reviews the backlog order and suggests priority changes; PO confirms. Base: TMI-apps/MILA `.agents/skills/backlog-management/SKILL.md`. | grill-me | Backlog file order stays the priority SSOT; agent proposes, PO confirms (no silent reorder). Integrate before refine-request. |
| D15 | backlog-management port shape | closed | Port the generic core from MILA: catch-up (archive landed tasks via git log + changelog + archive evidence), prioritize (full proposed order, one-line reason per move, PO confirms top), hand off to `/refine-request`. Signal steps (error/feedback read, status write-back, link/orphan tasks) become an optional adapter section an app enables once it has such tables. | grill-me | Rejected: port whole + add tables, tasks-only, Stop-2-feedback-only. |
| D16 | Backlog ranking criteria | closed | Blockers/prerequisites first; then value (vision fit + PO feedback) ÷ size estimate (D12), cheapest high-value first. With the signal adapter on, add impact × frequency. | grill-me | Rejected: vision-only, keep-PO-order-flag-only, PO value tags. |
| D17 | Stop 2 feedback → backlog | closed | Non-blocking Stop 2 feedback ("later", nice-to-have, newly noticed gaps) is written as backlog tasks; Stop 2's "propose next bets" runs backlog-management's prioritize step. | grill-me | clear-winner: keeps one priority SSOT (app-tasks.json) and makes PO test feedback the default signal. |
| D18 | `/refine-request` output | closed | One-page `BRIEF.md` in the job folder (problem, success check, in / out of scope, touched edges, size estimate) + `DECISIONS.md` rows. User stories / journeys only when the work spans roles or journeys and size ≥ M. | grill-me | Replaces `feature` requirements artifacts (D8). Rejected: decision rows only, full requirements always, brief inside backlog task. |
| D19 | `/refine-request` interview style | closed | Draft first: agent reads backlog task, vision, DOC_PRODUCT_DECISIONS / DECISIONS, and code, drafts `BRIEF.md` silently (**not shown** — PO doesn't read it). Asks only: gaps it couldn't infer, true ties, and impactful design decisions. Zero-question runs are possible but rare. | grill-me | PO: brief is for the agent, not the PO. Adds "impactful design decisions" as an ask category beside D6 ties (definition → D20). Rejected: interview from scratch, draft-and-go, grill against preview. |
| D20 | Which design decisions are "impactful" (always ask) | closed | Always ask: data / irreversible changes (schema, migrations, deleting or transforming stored data, auth / permission models); cost or external services (paid usage, quotas, third-party calls, privacy). Everything else: agent decides intuitively. | grill-me | Rejected as always-ask: visible behavior / defaults, new feature coupling (agent judgment). |
| D21 | Building on an unclean foundation | closed | When the change would patch onto code that is not a clean, deep, well-named module, `plan` includes the cleanup and routes it to a foundation specialist during planning; cleanup counts toward the size (D12). Not a PO stop unless it becomes a D7(b) patch-on-top choice. | grill-me | PO: "target an expert on that during the plan". Which specialist → D22. |
| D22 | Foundation cleanup specialist | closed | Port TMI-apps/MILA `.agents/skills/improve-codebase-architecture` (deep-module lens: depth, seams, deletion test, LANGUAGE.md glossary) as the specialist `plan` calls under D21, scoped to modules the change touches. `consolidate` / `optimize2` become its sub-lenses later (C8). | grill-me | Rejected: consolidate as-is, new merged foundation-review now, always-on rule only. |
| D23 | Pre-build plan gates (M/L) | closed | One merged plan-review step: critique lenses (`review-dev-plan`) + rule-compliance lens (`validate` plan-review) run in parallel; agent applies contract must-fixes as Amendments, then `implement`. | grill-me | Replaces two sequential gates. `validate` keeps impl-review after build. Rejected: keep both, critique only, size-scaled gates. |
| D24 | "Don't ask me" mode | closed | Delete `plan-grill-auto`. The shared `ask-protocol` gets an "away" switch ("don't ask me"): agent decides true ties itself and logs them; D3 / D7 / D20 items do not block — the agent proceeds provisionally and queues them for the PO at Stop 2 (preview, before landing per D11, so nothing irreversible ships unreviewed). | grill-me | Rejected: no auto mode, switch overrides everything, always-queue-never-block. |
| D25 | Commit timing vs Model C rule | closed | The `ship` stage commits, pushes and opens the PR on its own after `validate` passes; the PO's Stop 2 pass is what merges. Update `git-workflow` § Mode behavior table → **commit timing** (Model C) accordingly. | grill-me | D3 conflict with the existing rule ("commit when the user asks") resolved by PO. Agents still never write to `main` directly. A/B rows to re-check in plan. Rejected: ask before every commit, local preview without commit, draft PR. |
| D26 | Direct requests and the backlog | closed | Anything the PO points the agent at now goes to the top of the backlog and starts — bug or not. backlog-management's reorder proposal applies to the rest. | grill-me | Supersedes the open bug-entry question. |
| D27 | Bugs in refine | closed | Bugs run through `/refine-request` like any request; the depth of the required (and wished) fix decides if and how much plan is needed, via the same size estimate (D12). No separate bug lane; `debug` is a specialist called inside the loop. | grill-me | PO stated. |
| D28 | Time words in harness docs | closed | No relative time words ("today", "current", "now") for harness state in docs; cite the harness version (`package.json` version, e.g. v0.42.0) or a commit instead. | grill-me | PO flagged MAP.md "Skills today". Candidate rule line for `code-style` / doc conventions in plan. |
| D29 | Skill names | closed | Rename the replacement skills to agent-intuitive, self-explaining names. | grill-me | Naming convention → D32. |
| D30 | Rework phasing | closed | Phased, breadth-first: phase 1 = descriptions and edges (triggers, in / out, calls, called-by) for **all** replacement skills; phase 2 = build each skill on one recurring structure (template). Not one skill per phase. | grill-me | PO: too big for one pass; existing skills are too messy to patch. |
| D31 | Cross-referencing between skills | closed | Skills must reference the skills they call and hand off to (and who calls them) explicitly, from inside the skill. Part of the recurring structure (D30) and checked in phase 1 edges. | grill-me | PO: not enough referencing in v0.42.0. |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|

## Log

- 2026-10-23 — D1 closed via grill-me (asked)
- 2026-10-23 — D2–D7 closed via grill-me (asked)
- 2026-10-23 — D8 closed via grill-me (PO stated)
- 2026-10-23 — D9 closed (clear-winner); D10, D11 opened (agent loop proposal, awaiting PO)
- 2026-10-23 — D12 closed via grill-me (PO stated)
- 2026-10-23 — D10, D11 closed via grill-me (asked)
- 2026-10-23 — D13 closed via grill-me (asked)
- 2026-10-23 — D14 closed via grill-me (PO stated)
- 2026-10-23 — D15 closed via grill-me (asked)
- 2026-10-23 — D16 closed via grill-me (asked); D17 clear-winner
- 2026-10-23 — D18 closed via grill-me (asked)
- 2026-10-23 — D19 closed via grill-me (asked)
- 2026-10-23 — D20, D21 closed via grill-me (asked)
- 2026-10-23 — D22 closed via grill-me (asked)
- 2026-10-23 — D23 closed via grill-me (asked)
- 2026-10-23 — D24 closed via grill-me (asked)
- 2026-10-23 — D25 closed via grill-me (asked)
- 2026-10-23 — D26–D31 closed via grill-me (PO stated)
- 2026-10-23 — Stop-2 handoff contents: question withdrawn; PO asked to map all skills/rules first (see MAP.md)

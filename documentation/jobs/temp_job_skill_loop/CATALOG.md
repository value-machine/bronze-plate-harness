# Phase 1 catalog — replacement skills: names, descriptions, edges

Job: `temp_job_skill_loop` · Baseline: harness v0.42.0 (`a920c0d`) · Decisions: [`DECISIONS.md`](DECISIONS.md) · v0.42.0 map: [`MAP.md`](MAP.md)

**Phase 1 scope (D30):** every replacement skill gets a name (D32), a draft `description`, and its edges. No skill bodies yet — phase 2 builds them on one recurring structure.

**Edge fields (D31):** **Trigger** (when it runs) · **In** (what it reads) · **Out** (what it writes) · **Calls** (skills it invokes) · **Called by** · **Next** (hand-off) · **PO stops** (when it may stop for the product owner).

**Status:** ✅ edges follow from closed decisions · ❓ open — needs a PO call (listed in § Open edges).

---

## Loop map

```text
loop-route-next (dispatcher: where in the loop are we?)
   │
   ▼
STOP 1 ── loop-manage-backlog ──► loop-refine-request
                                        │
AUTONOMOUS                              ▼
   loop-plan-change ──► loop-build-change ──► loop-check-change ──► loop-ship-change
        ▲                     ▲                                          │
        │                     └────── Fix round ──────────┐              ▼
STOP 2 ─┴── Rethink ◄──────────────────────────── loop-review-preview ◄──┘
                                                       │ Pass
                                                       ▼
                                         land → close → loop-manage-backlog

All loop stages ask through loop-ask-owner (shared protocol).
```

---

## 1. Loop skills (`loop-*`)

### `loop-route-next` ✅
Replaces: `router` (dispatch only), `prime` (as an on-demand step).

> Finds where the current work sits in the product-owner loop and runs that stage. Use on any new chat, bare "next" / `/router`, or when it is unclear which stage applies. New chat or unfamiliar repo: loads repo context first. Never picks specialists for the owner.

| Field | Value |
|---|---|
| Trigger | New chat; "next"; ambiguous request; resume after interruption |
| In | Job folder state (`BRIEF.md`, `DECISIONS.md`, plan), `git status`, open PR state, `src/config/app-tasks.json` |
| Out | One line `Next: <stage>` |
| Calls | `spec-load-context` (new chat / unfamiliar repo) |
| Called by | Owner; any stage that loses its place |
| Next | The stage it found |
| PO stops | None |

### `loop-ask-owner` ✅ (shared protocol, D9)
Replaces: `grill-me` § Question style, `plan-grill` / `plan-grill-auto` mechanics, `agent-behavior` § Decision Questioning Protocol.

> Shared protocol for when and how any loop stage asks the product owner. Ask only on: a conflict with a logged decision, a true tie after enumerating options, a new dependency, a patch-on-top vs structural fix, data / irreversible changes, cost or external services. One question per turn, real options plus a challenge option, every answer logged. Supports an "away" switch.

| Field | Value |
|---|---|
| Trigger | Referenced by every loop stage before it locks a choice |
| In | `documentation/DOC_PRODUCT_DECISIONS.md`, job `DECISIONS.md`, app vision |
| Out | `DECISIONS.md` rows (asked / clear-winner / agent-pick) |
| Calls | — |
| Called by | Every `loop-*` stage |
| Next | Back to the calling stage |
| PO stops | Defines them: D3 conflict, D6 tie, D7 dependency / patch-on-top, D20 data / cost. Away switch (D24): decide ties, queue the rest for Stop 2 |

### `loop-manage-backlog` ✅ (Stop 1, part 1)
Replaces: `router` backlog intake. Port base: MILA `backlog-management` (D14–D17, D26).

> Opens Stop 1. Puts anything the owner points at on top of the backlog. Otherwise catches up the backlog against landed work, proposes a ranked order (blockers first, then value per size), and asks the owner to confirm the top item. Optional signal adapter for apps with error or feedback tables.

| Field | Value |
|---|---|
| Trigger | Stop 1 opens: new direction, owner request, close of the previous lap |
| In | `app-tasks.json` + archive, git log, changelog, Stop 2 feedback tasks, app vision; signal tables when the adapter is on |
| Out | Reordered `app-tasks.json`; top task `in-progress` |
| Calls | `loop-ask-owner` (confirm the top item) |
| Called by | `loop-route-next`; `loop-review-preview` (close) |
| Next | `loop-refine-request` |
| PO stops | Confirm the top item when the order changes (skipped when the owner just named the task) |

### `loop-refine-request` ✅ (Stop 1, part 2)
Replaces: `grill-me`, `feature` (requirements part), the size estimate.

> Turns the top backlog task (feature or bug) into a brief the agent can plan from. Reads the task, vision, decision log and code; drafts `BRIEF.md` silently; asks the owner only about gaps it cannot infer, true ties, and impactful choices. Estimates the size from the touched edges and the cleanup a clean implementation needs.

| Field | Value |
|---|---|
| Trigger | After `loop-manage-backlog` picks the task; Rethink from Stop 2 |
| In | Task, app vision, `DOC_PRODUCT_DECISIONS.md`, code around the touched edges |
| Out | `documentation/jobs/temp_job_<slug>/BRIEF.md` (problem, success check, in / out, edges, size XS–L); `DECISIONS.md` rows. User stories only when the work spans roles or journeys and size ≥ M |
| Calls | `loop-ask-owner`; `spec-load-context` when context is missing; `spec-debug-runtime` (reproduce only, for bugs) |
| Called by | `loop-manage-backlog`; `loop-review-preview` (Rethink) |
| Next | `loop-plan-change` (always; size sets the depth) |
| PO stops | Only via `loop-ask-owner` |

### `loop-plan-change` ✅
Replaces: `plan`, `feature` (D8), `plan-grill`, `plan-grill-auto` (D24), `quick-piv` (XS/S depth), `review-dev-plan` + `validate` plan-review (merged, D23).

> Writes the build plan at a depth set by the size estimate. XS/S: a short inline plan. M/L: a full plan plus one merged review (critique lenses plus rule compliance, run in parallel; must-fixes applied). Includes cleanup of an unclean foundation, done by a specialist. No owner sign-off.

| Field | Value |
|---|---|
| Trigger | After `loop-refine-request` |
| In | `BRIEF.md`, `DECISIONS.md`, rules, code |
| Out | XS/S: plan section in `BRIEF.md`. M/L: `DEVELOPMENT_PLAN.md` + Amendments |
| Calls | `loop-ask-owner`; `spec-deepen-modules` (D21/D22); `spec-reuse-package`; `spec-research-api`; `spec-review-precedent`; review lenses (M/L) |
| Called by | `loop-refine-request` |
| Next | `loop-build-change` |
| PO stops | Only via `loop-ask-owner` |

### `loop-build-change` ✅
Replaces: `implement`; the implement half of `quick-piv`.

> Builds the plan phase by phase with each phase's gate. Stops for the owner before adding a dependency, or before choosing a patch-on-top over the structural fix. Stops if the work outgrows the size estimate.

| Field | Value |
|---|---|
| Trigger | After `loop-plan-change`; Fix round from Stop 2 |
| In | Plan, `DECISIONS.md` |
| Out | Code + tests; plan progress |
| Calls | `loop-ask-owner`; `spec-debug-runtime` (failures); `spec-reuse-package` (before a new dependency) |
| Called by | `loop-plan-change`; `loop-review-preview` (Fix) |
| Next | `loop-check-change` |
| PO stops | D7 dependency / patch-on-top; size overrun (D12) — via `loop-ask-owner` |

### `loop-check-change` ✅
Replaces: `validate` (impl-review half).

> Audits the built change against the plan and repo rules with parallel read-only lenses, then fixes contract findings before shipping. No owner stop.

| Field | Value |
|---|---|
| Trigger | After `loop-build-change` |
| In | Diff, plan, rules |
| Out | Findings → fixes; check summary for Stop 2 |
| Calls | Rule lenses; `spec-score-component` (UI changes) ❓ |
| Called by | `loop-build-change` |
| Next | `loop-ship-change`; back to `loop-build-change` on blocking findings |
| PO stops | None |

### `loop-ship-change` ✅
Replaces: `finish`, `push`, `bundle-ship`, `git-workflow` PR / CI-watch steps (D25).

> Commits, pushes and opens the PR with a preview link, then drives CI to green. Never merges — merging waits for the owner's pass at Stop 2.

| Field | Value |
|---|---|
| Trigger | After `loop-check-change` passes |
| In | Working tree, `git-workflow.json` mode |
| Out | Commit(s), PR, preview link, green CI |
| Calls | `spec-debug-runtime` (CI failures) |
| Called by | `loop-check-change` |
| Next | `loop-review-preview` |
| PO stops | None |

### `loop-review-preview` ✅ (Stop 2 + close)
Replaces: `finish` § User test; close duties (decision promotion, `learn` trigger, next bets).

> Stop 2. Hands the owner test steps for the preview, plus any queued away-mode decisions. Pass → merge, promote decisions to `DOC_PRODUCT_DECISIONS.md`, run lessons when the lap had trouble, then reopen the backlog. Fix → back to build. Rethink → back to refine. Non-blocking feedback becomes backlog tasks.

| Field | Value |
|---|---|
| Trigger | After `loop-ship-change` |
| In | PR + preview, check summary, queued decisions |
| Out | Merge; `DOC_PRODUCT_DECISIONS.md` rows; backlog tasks from feedback |
| Calls | `loop-ask-owner`; `meta-learn-lessons` (troubled laps only) |
| Called by | `loop-ship-change` |
| Next | Pass → `loop-manage-backlog`; Fix → `loop-build-change`; Rethink → `loop-refine-request` |
| PO stops | Stop 2 itself |

---

## 2. Specialists (`spec-*`)

Called by loop stages, never the owner's entry point (D1).

| Name | Replaces | Description (draft) | Called by | Status |
|---|---|---|---|---|
| `spec-load-context` | `prime` | Loads repo structure, rules, git mode and active jobs for a new or unfamiliar session. | `loop-route-next`, `loop-refine-request` | ✅ |
| `spec-debug-runtime` | `debug`, `hypothesis` | Scientific debugging with pre-registered hypotheses for runtime bugs, failing tests and red CI. | refine (reproduce), build, ship | ❓ C7 |
| `spec-deepen-modules` | MILA `improve-codebase-architecture` (D22); later `consolidate`, `optimize2` design lens | Finds shallow, badly named or misplaced modules on the change's path and proposes the cleanup. | `loop-plan-change` | ❓ C8 |
| `spec-reuse-package` | `dont-reinvent-the-wheel` | Checks for a maintained package or known pattern before custom generic code; a new dependency goes to the owner (D7). | plan, build | ✅ |
| `spec-research-api` | `api-integrate` | Researches an external API or vendor (MCP first, schema then sample) before integration code. | plan | ✅ |
| `spec-review-precedent` | `pattern-review` | Compares a plan or proposal to industry practice. | plan (M/L, material design) | ✅ |
| `spec-review-modularity` | `modularity-review` | Checks the replaceability of features and stack slots. | plan (new feature folder or vendor) | ❓ C8 |
| `spec-simplify-flow` | `challenge`, `standards-align` | Cuts steps and complexity from one flow; aligns with common practice. | refine, plan | ❓ C8 |
| `spec-optimize-performance` | `optimize2` (efficiency levels), `react-perf-vite` | Finds performance hotspots and fixes them at the right level. | plan, check | ❓ C8 |
| `spec-score-component` | `review` | Scores one UI component against the quality rubric. | check | ❓ C8 |
| `spec-remove-feature` | `purge-skill` | Fully removes a feature or module and its trailing references. | plan (removal work) | ✅ |
| `spec-check-layer` | `layer-consistency-check` | Verifies the system assumption behind a behavior change; flags a workaround shape → D7(b). | refine, build | ❓ C9 |
| `spec-name-mechanism` | `name-the-mechanism` | Names shared code by role; marks the second copy, extracts the third. | build | ❓ C9 |

Removed without replacement: `improve` (an owner-facing front door to specialists breaks D1) ❓ C8.

## 3. Meta (`meta-*`)

Harness maintenance, onboarding and overlays — outside the product loop.

| Name | Replaces | Description (draft) | Called by | Status |
|---|---|---|---|---|
| `meta-learn-lessons` | `learn` | Turns a troubled lap's failures into rule or skill updates. | `loop-review-preview` | ✅ |
| `meta-audit-harness` | `align-harness`, `tighten-harness` | Coherence and context-cost audit of rules, skills and indexes. | Owner | ❓ C11 |
| `meta-intake-harness` | `update-harness` | Takes in external harness content from the inbox. | Owner | ❓ C11 |
| `meta-write-skill` | `create-skill` | Authors one skill on the recurring structure (phase 2 template). | Owner, `meta-learn-lessons` | ✅ |
| `meta-grade-rule` | `rule-quality` | Grades or rewrites one rule file. | Owner, `meta-audit-harness` | ✅ |
| `meta-write-adoption-guide` | `write-adoption-guide` | Writes a cross-repo adoption guide for an implemented pattern. | Owner | ✅ |
| `meta-onboard-app` | `start` | First-time setup and app vision, before the first loop lap. | Owner | ✅ |
| `meta-compress-output` | `caveman` | Ultra-brief output overlay. | Owner | ✅ |

---

## Open edges (to settle before phase 2)

| Cluster | Question |
|---|---|
| C7 | Does `spec-debug-runtime` also absorb the process half of the `debugging` rule? |
| C8 | Is the "make better" group one specialist with lenses (`spec-deepen-modules`) or several; does `spec-score-component` survive? |
| C9 | Are `spec-check-layer` / `spec-name-mechanism` rules (always-on corrections, D1) or specialists? |
| C10 | Which process parts leave the rules (`workflow`, `agent-behavior`, `git-workflow`, `debugging`) and which loop skill takes them? |
| C11 | Do meta skills keep owner entry points (they sit outside the product loop), and do `align-harness` + `tighten-harness` merge? |
| C12 | Covered by `loop-route-next` above — confirm. |

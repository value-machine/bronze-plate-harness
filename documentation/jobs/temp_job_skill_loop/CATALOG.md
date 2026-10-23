# Phase 1 catalog — replacement skills: names, descriptions, edges

Job: `temp_job_skill_loop` · Baseline: harness v0.42.0 (`a920c0d`) · Decisions: [`DECISIONS.md`](DECISIONS.md) (D1–D57) · v0.42.0 map: [`MAP.md`](MAP.md)

**Phase 1 scope (D30):** every replacement skill gets a name (D32, D39), a draft `description`, and its edges. No skill bodies yet — phase 2 builds them on one recurring structure.

**Edge fields (D31):** **Trigger** · **In** (reads) · **Out** (writes) · **Calls** (`if <condition> → <skill or reference>`, D53) · **Called by** · **Next** · **Owner stops**.

**Specialist threshold (D53):** a specialist is its own skill only when ≥ 2 stages call it; otherwise it is a reference file inside its single caller.

**Guard triggers live in rules (D56):** the always-on rules fire the guards — `architecture` (industry precedent, reuse-before-custom, layer consistency) and `code-style` (naming). The `if X → call Y` lines below mirror those triggers and point back to the rule; they are never the only trigger.

**No-loss port (D55):** in phase 2, every skill below carries a port map of each v0.42.0 section it absorbs — *kept* / *moved to X* / *dropped because…* — and `meta-audit-harness` checks the maps (no-information-loss gate). The "Replaces" lines are the port-map inputs.

---

## Loop map

```text
router (single entry: where in the loop are we?)
   │
STOP 1 ── loop-backlog ──► loop-refine ── ends with "Building: X. Not: Y. Size: S." (no wait)
                               │
AUTONOMOUS                     ▼
   loop-plan ──► loop-build ──► loop-check ──► loop-ship ──► preview
                                                               │
STOP 2 ──────────────────────────────────────── loop-verdict ◄─┘
     Pass   → merge (C) / promote (A/B) → loop-backlog
     Change → feedback = new top request → loop-refine
     Drop   → close PR → loop-backlog

Waiting on owner (Stop 2, or a parked always-ask question) = one state; the agent pulls the next task (D45, D46).
Sizes XS / S / M only; larger work is cut into ≤ M laps (D44).
```

**When the agent asks** lives in the `agent-behavior` rule (D40). A *choice* = ≥ 2 options with different results that outlast the lap (user-visible, data, cost, code structure). Ask only when it is on the always-ask list — conflict with a recorded decision, new dependency, patch-on-top vs structural fix, data / irreversible change, cost or external service — or a true tie, **and** it cannot be derived from vision, decisions or code. **How to ask** is the shared reference `loop-refine/references/asking.md` (one question per turn, real options + a challenge option, answer logged), linked by every loop skill.

**Where decisions live (D48):** feature README, app vision, or rule — next to what they govern. Job `DECISIONS.md` is lap scratch on the branch, folded into those homes before merge.

---

## 1. Router + loop skills

### `router`
Replaces: `router` (dispatch only).

> Single entry point. Finds where the current work sits in the loop (backlog, refine, plan, build, check, ship, verdict, or waiting on the owner) and runs that stage. Requests with no repo change are answered directly, not as a lap (D54).

| Field | Value |
|---|---|
| Trigger | New chat; "next"; any request; resume after interruption |
| In | `git status`, branches, open PRs + previews, `src/config/app-tasks.json`, job folders |
| Out | One line `Next: <stage>` |
| Calls | if new chat or unfamiliar repo → `spec-load-context` |
| Called by | Owner |
| Next | The stage it found |
| Owner stops | None |

### `loop-backlog` (Stop 1, part 1)
Replaces: `router` backlog intake; `start` onboarding (D41). Port base: MILA `backlog-management` (D14–D17).

> Opens Stop 1. Puts anything the owner points at on top (D26). Otherwise catches up the backlog against landed work and proposes a ranked order: blockers first (untested previews, seeded onboarding tasks), then value per size. Owner confirms the top item. Optional signal adapter for error / feedback tables; post-release watch happens here (D52).

| Field | Value |
|---|---|
| Trigger | Stop 1: owner request, Pass or Drop at Stop 2, idle `router` |
| In | `app-tasks.json` + archive, git log, changelog, open previews, app vision; signal tables when the adapter is on |
| Out | Reordered `app-tasks.json`; top task `in-progress` |
| Calls | — |
| Called by | `router`; `loop-verdict` |
| Next | `loop-refine` |
| Owner stops | Confirm the top item when the order changes (skipped when the owner named the task) |

### `loop-refine` (Stop 1, part 2)
Replaces: `grill-me`, `feature` (requirements part), size estimate.

> Turns the top task — feature, bug, or Stop 2 feedback — into a brief the agent can plan from. Reads the task, vision, and the READMEs and code of the touched edges; drafts `BRIEF.md` silently; asks only per the `agent-behavior` stop list. Sizes the work XS / S / M from edges plus the cleanup a clean implementation needs, cutting anything larger into ≤ M laps. Ends with one restatement line; no wait.

| Field | Value |
|---|---|
| Trigger | After `loop-backlog`; Change verdict |
| In | Task, app vision, feature READMEs of touched edges, rules, code |
| Out | `documentation/jobs/temp_job_<slug>/BRIEF.md` (problem, success check, in / out, **listed edges**, size); lap `DECISIONS.md`; follow-up backlog tasks when work is cut into laps |
| Calls | if repo context missing → `spec-load-context`; if bug → `spec-debug-runtime` (reproduce only); if the request changes existing behavior → `spec-check-layer` (via `architecture` rule); if the user flow is in question → `spec-simplify-flow` |
| Called by | `loop-backlog` |
| Next | `loop-plan` |
| Owner stops | Stop list only (D40) |

### `loop-plan`
Replaces: `plan`, `feature`, `plan-grill`, `plan-grill-auto`, `quick-piv`, `review-dev-plan` + `validate` plan-review (D23); absorbs four former specialists as references (D53).

> Writes the build plan at a depth set by the size. First turns the brief's success check into a failing test (D49). XS / S: short plan in `BRIEF.md`. M: `DEVELOPMENT_PLAN.md` plus one merged review (critique + rule compliance, parallel; must-fixes applied). Plans the cleanup of an unclean foundation as part of the work. No owner sign-off.

| Field | Value |
|---|---|
| Trigger | After `loop-refine` |
| In | `BRIEF.md`, lap `DECISIONS.md`, rules, code |
| Out | Failing acceptance test; plan (in `BRIEF.md` or `DEVELOPMENT_PLAN.md`) |
| Calls | if touched modules are shallow, duplicated, badly named or misplaced → `references/deepen-modules.md` (port of MILA `improve-codebase-architecture`, D22); if an external API or vendor is involved → `references/research-api.md`; if material UX / API / architecture design (any size, per `architecture` rule § Pattern risk) → `references/review-precedent.md`; if work removes a feature or module → `references/remove-feature.md`; if generic subsystem (per `architecture` rule § Don't reinvent the wheel) → `spec-reuse-package`; if the user flow grows → `spec-simplify-flow`; if perf-sensitive → `spec-optimize-performance` |
| Called by | `loop-refine` |
| Next | `loop-build` |
| Owner stops | Stop list only |

### `loop-build`
Replaces: `implement`; implement half of `quick-piv`.

> Builds the plan phase by phase until the acceptance test passes. Stops on the stop list (new dependency, patch-on-top). Stops when the diff touches a feature area outside the brief's listed edges (D51). Folds lap decisions into their homes (feature README / vision / rule) as it goes.

| Field | Value |
|---|---|
| Trigger | After `loop-plan` |
| In | Plan, acceptance test, lap `DECISIONS.md` |
| Out | Code + tests; updated feature READMEs; plan progress |
| Calls | if a test or runtime fails unexpectedly → `spec-debug-runtime`; if a new package is needed → `spec-reuse-package` (then owner stop); if the diff starts to look like a workaround → `spec-check-layer` (via `architecture` rule) |
| Called by | `loop-plan` |
| Next | `loop-check` |
| Owner stops | Stop list; edge overrun |

### `loop-check`
Replaces: `validate` (impl-review); `review` as a UI lens (D35); `workflow` rule hand-off checklist (D34).

> Runs the acceptance test, the suite, rule lint and the hand-off checklist; at size M also the parallel lens review. Fixes contract findings, then hands to ship. No owner stop.

| Field | Value |
|---|---|
| Trigger | After `loop-build` |
| In | Diff, plan, rules |
| Out | Fixes; check summary for Stop 2 |
| Calls | if UI components changed → `references/component-lens.md` (from `review`); if perf-sensitive → `spec-optimize-performance` |
| Called by | `loop-build` |
| Next | `loop-ship`; back to `loop-build` on blocking findings |
| Owner stops | None |

### `loop-ship`
Replaces: `finish`, `push`, `bundle-ship`, `git-workflow` PR / CI-watch / promote steps (D25, D34).

> Commits, pushes, opens the PR with a preview link, and drives CI to green. Never merges or promotes on its own — that waits for the owner's Pass.

| Field | Value |
|---|---|
| Trigger | After `loop-check`; Pass from `loop-verdict` (merge / promote) |
| In | Working tree, `src/config/git-workflow.json` mode |
| Out | Commits, PR, preview link, green CI; merge or promote on Pass |
| Calls | if CI fails → `spec-debug-runtime` |
| Called by | `loop-check`; `loop-verdict` |
| Next | `loop-verdict` |
| Owner stops | None |

### `loop-verdict` (Stop 2)
Replaces: `finish` § User test; close duties.

> Stop 2, before production (D47). Gives the owner test steps for the preview, the decision lines this PR changes, and any rule changes it carries. Pass → merge (C) or promote (A / B), archive the task. Change → lessons run first on the same PR, then the feedback becomes a new top request. Drop → close the PR.

| Field | Value |
|---|---|
| Trigger | After `loop-ship` |
| In | PR + preview, check summary, PR diff of decision homes (READMEs, vision, rules) |
| Out | Merge / promote, or closed PR; feedback as backlog tasks |
| Calls | if verdict is not Pass → `meta-learn-lessons` (commits to the same PR); Pass → `loop-ship` to merge / promote |
| Called by | `loop-ship` |
| Next | Pass / Drop → `loop-backlog`; Change → `loop-backlog` (feedback on top) → `loop-refine` |
| Owner stops | Stop 2 itself; Pass counts as consent for listed protected-rule changes (D50) |

---

## 2. Specialists (`spec-*`) — each called by ≥ 2 stages

The owner may also call any specialist directly, outside a lap (D57). If the result needs a repo change, the agent adds it to the backlog as a task instead of editing directly.

| Name | Replaces | Description (draft) | Called by (condition) · always also: owner (D57) |
|---|---|---|---|
| `spec-load-context` | `prime` | Loads repo structure, rules, git mode and open laps for a new or unfamiliar session. | `router` (new chat), `loop-refine` (context missing) |
| `spec-debug-runtime` | `debug`, `hypothesis`, `debugging` rule strategy (D34) | Scientific debugging with pre-registered hypotheses for runtime bugs, failing tests and red CI. | `loop-refine` (bug: reproduce), `loop-build` (unexpected failure), `loop-ship` (CI red) |
| `spec-reuse-package` | `dont-reinvent-the-wheel` | Checks for a maintained package or known pattern before custom generic code; a new dependency is an owner stop. | `loop-plan` (generic subsystem), `loop-build` (new package) |
| `spec-simplify-flow` | `challenge`, `standards-align` (D35) | Cuts steps and complexity from one user flow, aligned with common practice. | `loop-refine` (flow in question), `loop-plan` (flow grows) |
| `spec-optimize-performance` | `optimize2` efficiency levels, `react-perf-vite` (D35) | Finds performance hotspots and fixes them at the right level. | `loop-plan`, `loop-check` (perf-sensitive) |
| `spec-check-layer` | `layer-consistency-check` rubric + alert (core → `architecture` rule, D33) | Workaround-shape rubric and alert; a confirmed patch-on-top is an owner stop. | `architecture` rule trigger (D56) in `loop-refine` and `loop-build` |

**Became references inside `loop-plan` (D53):** `deepen-modules` (MILA `improve-codebase-architecture` + `consolidate` + `modularity-review` + `optimize2` design levels), `research-api` (`api-integrate`), `review-precedent` (`pattern-review`), `remove-feature` (`purge-skill`). **Inside `loop-check`:** `component-lens` (`review`).

**Moved into rules:** `name-the-mechanism` → `code-style` (D33); stop list + choice definition → `agent-behavior` (D40).

**Deleted:** `improve` (D35), `loop-ask-owner` (D40), `start` / `meta-onboard-app` (D41), `bundle-ship` (D45).

## 3. Meta (`meta-*`) — outside the product loop, owner may call directly (D36)

| Name | Replaces | Description (draft) | Called by |
|---|---|---|---|
| `meta-write-skill` | `create-skill` | Sole path for adding or changing a skill: recurring structure, naming, edges, port map (D55), catalog entry; backed by a commit / CI admission check (D37). Ends with `meta-audit-harness` and `meta-write-adoption-guide`. | Owner, `meta-learn-lessons`, any agent editing a skill |
| `meta-audit-harness` | `align-harness`, `tighten-harness` (D36) | One harness audit, two lenses: coherence and context cost; keeps the no-information-loss gate and checks every skill's port map (D55). | Owner, `meta-write-skill`, `meta-intake-harness` |
| `meta-intake-harness` | `update-harness` | Takes in external harness content (including fork adoption notes) and feeds findings into `meta-audit-harness`. | Owner |
| `meta-write-adoption-guide` | `write-adoption-guide` | Writes the fork-facing porting note for a landed harness change, including any rename map (D42). | `meta-write-skill`, `meta-audit-harness` |
| `meta-learn-lessons` | `learn` | Turns a non-Pass lap's failures into rule or skill updates on the same PR. | `loop-verdict` (non-Pass) |
| `meta-grade-rule` | `rule-quality` | Grades or rewrites one rule file. | Owner, `meta-audit-harness` |
| `meta-compress-output` | `caveman` | Ultra-brief output overlay. | Owner |

---

**Count:** 21 skills (`router` + 7 loop + 6 specialists + 7 meta), down from 37 in v0.42.0.

## Open edges

None. Phase 1 ready for owner sign-off.

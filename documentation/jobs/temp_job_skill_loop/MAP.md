# Current-state map — skills and rules vs the three categories

Job: `temp_job_skill_loop` · Snapshot: 2026-10-23 · Decisions: [`DECISIONS.md`](DECISIONS.md)

Categories (D1): **Rule** = always-on coding fundamentals / corrections · **Loop stage** = one step of the product-owner loop · **Specialist** = called by a stage when needed, never the PO's entry point.

Fit: ✅ fits as-is · ⚠️ fits but overlaps or is mis-shaped · ❌ in the wrong category (or no category)

## 1. Rules (`.cursor/rules/**/RULE.mdc`)

| Rule | Lines | Current content | Fit | Issue |
|------|------:|-----------------|-----|-------|
| `code-style` | 67 | Naming, TS, reuse, complexity | ✅ | — |
| `file-placement` | 53 | Structure whitelist, doc placement | ✅ | — |
| `security` | 33 | DB verify, authz, secrets | ✅ | — |
| `testing` | 81 | Test authority, runners, TDD, release gate | ✅ | — |
| `database` (glob) | 605 | Migration patterns | ✅ | Long; scoped by glob |
| `cloud-functions` (glob) | 370 | Edge vs frontend | ✅ | — |
| `project-specific` (glob) | 211 | Edge rate limiting | ✅ | — |
| `api-integration` (glob) | 46 | Research principles → `api-integrate` skill | ✅ | — |
| `platform` | 112 | Windows shells, env | ✅ | — |
| `architecture` | 116 | Placement, layers, TanStack pattern **+ proactive triggers** for pattern-review, dont-reinvent, layer-consistency, perf | ⚠️ | Mixes knowledge with process triggers |
| `agent-behavior` | 99 | Agent role, **Decision Questioning Protocol**, success reporting, protected files | ⚠️ | Decision protocol = loop stop policy; must match D2/D3/D6/D7 |
| `git-workflow` | 231 | Branch models A/B/C, PRs, **promote, CI watcher** | ⚠️ | Branch knowledge = rule; promote/CI-watch = ship-stage process |
| `debugging` | 76 | Logs, API troubleshooting **+ debugging strategy, scientific method, user test instructions** | ⚠️ | Half duplicates `debug` / `hypothesis` skills |
| `workflow` | 46 | "Where things live", branch gate, during-dev, hand-off checklist | ❌ | A process hub, not coding knowledge |

## 2. Loop stages (skills that are, or act as, steps in the loop today)

Loop shape today (dev-cycle-matrix): direction → plan → review → implement → validate → finish → push → CI → user test.

| Stage | Skill(s) today | Lines | Fit | Issue |
|-------|----------------|------:|-----|-------|
| Dispatch | `router` | 333 | ⚠️ | Holds the loop *and* the skill catalog *and* backlog intake; specialist entry rows contradict D1 |
| Context | `prime` | 100 | ⚠️ | Sub-step of Direction or Plan, not its own stage |
| **Stop 1: Direction** | `grill-me` | 210 | ⚠️ | Three interview variants (see `plan-grill*`) |
| Plan | `plan` | 297 | ⚠️ | Absorbs `feature` (D8) |
| Plan (product reqs) | `feature` | 437 | ❌ | Fold into `plan` (D8); stops conflict with D2 (D6) |
| Plan rail | `plan-grill` | 172 | ⚠️ | Same ask-on-ties rule as D6; should be the *only* mode |
| Plan rail (auto) | `plan-grill-auto` | 148 | ⚠️ | Default autonomy now = D6 rule; separate skill likely redundant |
| Plan review | `review-dev-plan` | 106 | ⚠️ | Overlaps `validate` plan-review (two gates before implement) |
| Build | `implement` | 192 | ✅ | Needs D7 new-dependency stop |
| Build (small) | `quick-piv` | 139 | ⚠️ | Size variant of plan→implement→validate; a mode, not a stage |
| Verify | `validate` | 253 | ⚠️ | Runs as plan-review **and** impl audit |
| Ship | `finish` | 207 | ⚠️ | Ship split three ways; also holds § User test |
| Ship | `push` | 83 | ⚠️ | See above |
| Ship | `bundle-ship` | 119 | ⚠️ | Multi-thread variant of finish+push |
| **Stop 2: Test → next direction** | *(none; `finish` § User test)* | — | ❌ | No skill owns the PO test hand-off or choosing the next direction |
| Retro | `learn` | 167 | ⚠️ | Optional; not wired into the loop |
| Onboarding | `start` | 242 | ⚠️ | One-time setup, before the loop; not a stage |

## 3. Specialists (called by a stage)

| Specialist | Lines | Called by today | Fit | Issue |
|------------|------:|-----------------|-----|-------|
| `debug` | 255 | router (bug intake) | ⚠️ | Entry point today; overlaps `debugging` rule + `hypothesis` |
| `hypothesis` | 95 | debug / direct | ⚠️ | Sub-method of `debug` |
| `pattern-review` | 128 | plan, feature, review-dev-plan, rule trigger | ✅ | — |
| `dont-reinvent-the-wheel` | 122 | plan Investigate, implement, rule trigger | ⚠️ | Must raise the D7 new-dependency stop |
| `api-integrate` | 100 | plan, rule | ✅ | — |
| `modularity-review` | 44 | router | ✅ | — |
| `review` (component rubric) | 274 | router | ⚠️ | Overlaps `validate`; entry point today |
| `consolidate` | 451 | router, improve | ⚠️ | "Make better" cluster ↓ |
| `challenge` | 281 | router, improve | ⚠️ | "Make better" cluster |
| `standards-align` | 217 | router, improve | ⚠️ | "Make better" cluster |
| `optimize2` | 628 | router | ⚠️ | "Make better" cluster; largest skill |
| `react-perf-vite` | 61 | optimize2 / direct | ✅ | — |
| `improve` | 185 | router (`/improve`) | ❌ | A PO-facing front door to specialists; contradicts D1 |
| `purge-skill` | 95 | router | ✅ | — |
| `caveman` | 49 | direct | ⚠️ | Output style overlay, not a specialist |

### Correction skills that already run always-on (rule or specialist?)

| Skill | Lines | Always-on via | Fit | Issue |
|-------|------:|---------------|-----|-------|
| `name-the-mechanism` | 62 | `code-style` § Naming + AGENTS.md Defaults | ⚠️ | A correction (D1 rule territory), stored as a skill |
| `layer-consistency-check` | 120 | `architecture` § Layer consistency + AGENTS.md Defaults | ⚠️ | Same; also owns the D7(b) workaround stop |

## 4. No category: harness maintenance (meta)

| Skill | Lines | Issue |
|-------|------:|-------|
| `align-harness` | 140 | Maintains the harness, not the app |
| `tighten-harness` | 128 | Same |
| `update-harness` | 77 | Same |
| `create-skill` | 84 | Same |
| `rule-quality` | 201 | Same |
| `write-adoption-guide` | 169 | Exports patterns to other repos |

## Target loop (D10, D13)

| Loop part | Target skill | Absorbs |
|---|---|---|
| Stop 1 Bet | `refine-request` | `grill-me`, `router` backlog intake, `feature` requirements, `prime` (on demand), size estimate (D12) |
| Plan | `plan` (depth by size) | `feature`, `plan-grill`, `plan-grill-auto`, `quick-piv`, `review-dev-plan` (M/L) |
| Build | `implement` | + D7 new-dependency stop |
| Check | `validate` | — |
| Ship (to PR preview) | `ship` | `finish`, `push`, `bundle-ship`, `git-workflow` PR/CI steps |
| Stop 2 Review + close | `review-preview` | `finish` § User test, decision promotion, `learn` trigger, next bets |
| Shared | `ask-protocol` | `grill-me` § Question style, `agent-behavior` § Decision Questioning Protocol |
| Dispatch | `router` (slim) | locate loop position, resume |

## Overlap clusters to work through one by one

| # | Cluster | Members | Status |
|---|---------|---------|--------|
| C1 | Plan vs feature | `plan`, `feature` | Direction set: fold (D8) |
| C2 | Interview variants | `grill-me`, `plan-grill`, `plan-grill-auto`, `agent-behavior` § Decision protocol | Open |
| C3 | Plan size modes | `quick-piv` vs `plan`→`implement`→`validate` | Open |
| C4 | Pre-implement gates | `review-dev-plan`, `validate` plan-review | Open |
| C5 | Ship | `finish`, `push`, `bundle-ship`, `git-workflow` promote/CI | Open |
| C6 | Stop 2 owner | `finish` § User test, `learn`, backlog intake in `router` | Open |
| C7 | Debug | `debug`, `hypothesis`, `debugging` rule | Open |
| C8 | "Make better" | `improve`, `challenge`, `standards-align`, `consolidate`, `optimize2`, `review` | Open |
| C9 | Corrections as skills | `name-the-mechanism`, `layer-consistency-check`, `architecture` triggers | Open |
| C10 | Process inside rules | `workflow`, `agent-behavior`, `git-workflow`, `debugging` | Open |
| C11 | Meta category | harness-maintenance skills | Open |
| C12 | Router scope | `router` (dispatch vs catalog vs backlog) | Open |

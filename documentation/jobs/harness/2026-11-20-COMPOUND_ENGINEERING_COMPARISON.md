# Harness comparison — Bronze Plate vs Compound Engineering

Correction (same lap): the first version said Bronze Plate has no behavioral skill tests. It does: 9 loop skills carry `evals/` cases. Self-verification and the totals below are corrected.

Compared: **plate-harness v0.44.0** (commit `27a5809`) vs **Every's Compound Engineering plugin v3.38.2** (`EveryInc/compound-engineering-plugin`, commit `033f82d`). Scores come from reading both repos' files; neither harness was run for this comparison.

Feeds lap `temp_job_compound-engineering-adoption`.

## What each one is

- **Compound Engineering (CE):** a portable skills plugin (38 skills, 14 agent hosts, any stack). Loop: brainstorm → plan → work → simplify → review → compound (capture what was learned). `.agy/` is only its Antigravity CLI install entry point and links back to the shared `skills/`.
- **Bronze Plate:** a stack-specific starter app (Vite / React / Supabase / Cloudflare) plus an agent harness for a non-technical product owner. Loop: backlog → refine → plan → build → check → ship → verdict, with two owner stops.

## Strengths and weaknesses

### Compound Engineering

Strengths:
- **Widest workflow:** strategy, ideation, brainstorm, plan, work, review, commit/PR, PR watching, retro, product pulse, explainers. `lfg` runs a request end to end without stops.
- **Strongest learning loop:** `ce-compound` records a lesson only if it passes a durability counterfactual ("would losing this cause recurrence or rediscovery?"), then saves it in the cheapest durable form: a test, then a lint rule, then a coding-standard line, and only last a prose learning. `ce-compound-refresh` audits saved learnings against the current code. Opt-in Compound Packs feed domain rules into plan, work and review.
- **Tests its own skills:** `tests/skill-eval-cell/` runs skills on real agent hosts and grades the artifacts they produced. Contract tests and per-host prompt-budget tests guard skill bodies.
- **Deepest code review:** 15 reviewer personas (adversarial, data-migration, frontend-races, security, ...), document review, optional cross-model second opinions.
- **Context design:** short skill bodies ("phase-loaded kernel") with each phase's mechanics in a reference read at the acting step.
- **Mature:** active maintainers and community contributions.

Weaknesses:
- **Almost no mechanical guardrails** in the user's repo: no layer, structure or budget checks and no hooks, unless `ce-compound` writes a lint rule over time.
- **Developer-oriented:** no owner-facing stop like preview → Pass / Change / Drop.
- **Learning curve:** 38 skills and about 40 project-specific terms in `CONCEPTS.md`.

### Bronze Plate

Strengths:
- **Enforced by tools:** dependency-cruiser layers, the structure whitelist, feature budgets, staged pre-commit checks; Claude Code hooks block git writes on `main`, lint each edited file and type-check at turn end; CI fails on skill-mirror drift.
- **Owner UX:** two stops, one-tap questions, a preview link per PR, merging counts as a Pass.
- **Harness governance:** one home per fact, a decision log with IDs (`DOC_DECISION_LOG.md`), coherence and context-cost audits (`meta-audit-harness`), intake of outside content (`meta-intake-harness`).
- **Ships a running app** and production setup, not only a workflow.

Weaknesses:
- **Locked to one stack** and to Claude Code / Cursor (plus Codex via `AGENTS.md`).
- **Thinner skill testing than CE:** behavioral eval cases (scripted fixture, model-judged graders) exist for 9 of 22 skills (`.agents/skills/*/evals/`, run by hand with `meta-write-skill/scripts/run-evals.sh`); `validate-skills` checks structure on every commit. No eval runs in CI.
- **Heavy always-on context:** about 13.7k words of rules plus `AGENTS.md`, mostly loaded every session.
- **Early stage:** one owner, v0.x; no ideation or strategy stage; reviewers are rule-based, without personas or cross-model passes.

## Rubric (fixed before scoring, 1–5 each)

| # | Criterion | Weight | What a 5 looks like |
|---|---|---|---|
| 1 | Workflow coverage | 12 | idea → ship → learn, no gaps |
| 2 | Learning loop | 12 | lessons captured, admitted only if worth it, kept current |
| 3 | Mechanical enforcement | 12 | rules enforced by tools / hooks / CI, not prose |
| 4 | Owner UX | 10 | a non-coder can steer and approve safely |
| 5 | Portability | 10 | many hosts, any stack |
| 6 | Self-verification of the harness | 10 | behavioral tests of the skills |
| 7 | Context efficiency | 8 | small always-on load, details loaded only when needed |
| 8 | Review depth | 8 | many independent review angles |
| 9 | Time to value | 8 | fast, low-friction start |
| 10 | Harness governance | 5 | one home per fact, drift checks, decision log |
| 11 | Maturity / community | 5 | proven, maintained, outside users |

## Scores

| Criterion (weight) | CE | Bronze Plate |
|---|---|---|
| 1 Workflow coverage (12) | **5** | 4 |
| 2 Learning loop (12) | **5** | 4 |
| 3 Mechanical enforcement (12) | 2 | **5** |
| 4 Owner UX (10) | 3 | **5** |
| 5 Portability (10) | **5** | 2 |
| 6 Self-verification (10) | **5** | 3 |
| 7 Context efficiency (8) | **4** | 3 |
| 8 Review depth (8) | **5** | 4 |
| 9 Time to value (8) | **4** | 3 |
| 10 Governance (5) | 4 | **5** |
| 11 Maturity (5) | **5** | 2 |
| **Weighted total / 100** | **84.6** | **74.2** |

**Bias check.** The general rubric favors a portable, mature product, which is what CE is. Re-weighted for this repo's purpose (a non-technical owner shipping Supabase apps: enforcement 20, owner UX 20, workflow 10, learning 10, self-verification 10, review 8, context 7, onboarding 5, governance 5, portability 3, maturity 2), the result flips: **Bronze Plate 82.6, CE 76.6**.

## Which is better at what

| Area | Better | Why |
|---|---|---|
| Ideation / strategy / brainstorming | CE | Bronze Plate has only the vision doc |
| Planning sized to the work | Tie | CE picks plan depth at intake and builds only needed safeguards (sizing test); Bronze Plate sizes laps XS / S / M with a precedent review |
| Holding architecture over time | Bronze Plate | dep-cruiser, whitelist, budgets, hooks |
| Code review | CE | 15 personas + cross-model passes |
| Capturing lessons | CE (narrowly) | Both turn mechanical lessons into checks (`meta-learn-lessons` step 5: "validators, not prose"); CE adds an explicit form ladder (test → lint → standard → learning) and a refresh job for stale learnings |
| Testing the harness itself | CE | both have behavioral skill evals; CE's cover more skills, grade surviving artifacts, test reproducibility and run contract tests in CI |
| Non-technical owner control | Bronze Plate | two stops, preview link, Pass / Change / Drop |
| Hands-off end to end | CE | `lfg` (Bronze Plate: away switch + `loop-orchestrate`) |
| Parallel work | Tie | `loop-orchestrate` vs CE's wave contract and worktrees |
| Host / stack portability | CE | 14 hosts vs 2–3, one stack |
| Releasing to production | Bronze Plate | branch-model table, rulesets, release-please, previews |
| Keeping the harness consistent | Bronze Plate | one home per fact, decision log, coherence + context-cost audits |
| Always-on context cost | CE | short skill bodies, details loaded per phase |
| Maturity / community | CE | v3.38, several maintainers |

## Candidates to borrow into Bronze Plate

1. **Stronger skill evals** (CE `tests/skill-eval-cell/`): extend the existing `evals/` cases with CE's artifact grading, reproducibility checks and wider coverage.
2. **Cheapest durable form for lessons** (CE `ce-compound` form choice + durability counterfactual) in `meta-learn-lessons`.
3. **Reviewer personas / cross-model pass** (CE `ce-code-review/references/personas/`) in `loop-check`'s size-M lens review.
4. **Phase-loaded skill kernels** (CE `CONCEPTS.md` § Phase-loaded kernel) to shrink always-on rules and skill bodies; overlaps backlog tasks R10 / R11.
5. **Brainstorm-style refine** (CE `ce-brainstorm`): scope tiers, coherent-work gate, product pressure test, approach generation, fresh-context claim verifier, Ready-for-Planning check.
6. **Sizing test** (CE `CONCEPTS.md` § Sizing test): build an unrequested safeguard only when a contract requires it, harm lands before anyone catches it, or adding it later is expensive.

## ce-brainstorm pieces for loop-refine — why, what, consequences

Owner asked to understand the why, what and consequences of each change before anything is adopted. Compared: `loop-refine` at plate-harness v0.44.0 vs `ce-brainstorm` at Compound Engineering v3.38.2.

| # | CE piece | loop-refine today | Evidence in this repo | Consequence if adopted | Verdict |
|---|---|---|---|---|---|
| 1 | One-piece-of-work check (coherent-work gate) | Cuts work by size only (> M → several laps) | This lap: the request held four independent outcomes; the check turned that into one owner choice (D1) | One extra Stop 1 question, only when a request bundles separate outcomes | Improves; no conflict |
| 2 | Pressure test (evidence, who exactly, today's workaround, smallest version) | Drafts silently; asks only stop-list items | None found | Asked out loud: more owner questions per lap, conflicts with `agent-behavior` § When to ask. Run silently: no owner effect | Improves only as a silent self-check |
| 3 | Show alternatives before recommending | Agent picks clear winners alone and logs rejected options in `DECISIONS.md`, which the owner doesn't read | `harness-overview-page` D1: refine picked a static HTML page as a clear winner; the owner reversed it at Stop 2 (D12), costing a build round | More Stop 1 questions; changes a recorded decision (always-on asking rule). Middle option: only for choices the owner would see in the app | Probably improves; owner decision (conflict) |
| 4 | Fresh-eyes claim check (separate subagent verifies claims about the code) | "Verify before you state" (`grounding.md`), self-checked by the same agent | This session: the comparison overstated a gap in `meta-learn-lessons`; caught only on reread | One extra subagent per refine (tokens, about a minute); no owner effect; could skip at XS | Improves; no conflict |
| 5 | Ready-for-planning check (complete, consistent, focused, usable by planning) | Brief template only, no explicit gate | None found | Agent-only check before hand-off; near-free | Small improvement; no conflict |
| 6 | Visible progress list during refine | None | This lap used one (5 steps) | The owner sees where Stop 1 stands; no cost | Improves if the owner finds it useful |
| 7 | Tiny work ends in chat, no file | XS still writes `BRIEF.md` | — | Breaks how `router` finds laps (by `BRIEF.md`, skill-loop D45) | Don't adopt |
| 8 | Product Contract format, model tiers, visual probes, Slack researcher, HTML output | `BRIEF.md` + D-numbered ledger | — | Second vocabulary for the same job | Don't adopt |

Adoption order: one piece per lap (compound-engineering-adoption D3). Piece 4 (claim check) landed first; the others are backlog tasks.

# Context-cost audit (meta-audit-harness, cost lens)

Lap `context-cost-audit`, branch `claude/context-cost-audit`. Tokens ≈ chars / 4.

## Load tiers (before)

| Tier | Files | Chars | ≈ tokens |
|------|-------|-------|----------|
| Always loaded | `AGENTS.md` 7.5k, `CLAUDE.md` 1.6k, 9 always-on rules 61.4k (git-workflow 16.4k, architecture 11.2k, agent-behavior 8.9k, code-style 7.9k, testing 4.9k, file-placement 4.3k, platform 3.3k, debugging 2.5k, security 2.0k) | 70.5k | 17.6k |
| Always listed | 22 skill descriptions | 13.9k | 3.5k |
| On demand | path-scoped rules (database 18.9k, cloud-functions 13.7k, project-specific 6.6k, api-integration 2.9k), skill bodies, references | — | — |

`harness_scan`: always-on 61.4k bytes vs 32k budget (advisory).

## Issue table

| # | tier | where | issue | resolution | Δ tokens (always-on) |
|---|------|-------|-------|------------|----------------------|
| R1 | advisory | `git-workflow.md` § Promote to production (3.8k) | A/B-only procedure (pre-promote check, failure modes, ancestor reconcile, bootstrap) loaded every session; only `loop-ship` runs it | relocate to `loop-ship/references/push-safety.md` § Production landing; one-line pointer stays; update refs in `spec-debug-runtime/references/patterns.md`, `loop-backlog/references/onboarding.md` | −900 |
| R2 | advisory | `git-workflow.md` § Pull Requests (4.1k) | Model A `gh pr create` steps, PR body template, preview-URL formula, "merge blocked" diagnosis, divergence prevention = procedure | relocate to `push-safety.md` § Pull request; keep policy lines (preview link in every PR body, owner reads only chat, no task lists, conventional title) | −700 |
| R3 | advisory | `git-workflow.md` § Branch Strategy + Forbidden + Branch Protection (1.9k) | restates the mode table; Model B hotfix/concurrency detail is procedure | keep invariants (single landing path, `main` ancestor of `develop`, rulesets ≠ classic protection) in 3 lines; detail → `loop-ship/references/concurrency.md` / `push-safety.md` | −300 |
| R4 | advisory | "Related Rules" footer in 8 always-on rules (2.1k) | stated elsewhere: `DOC_RULES_INDEX.md` § Consistency Check Matrix; only useful when editing a rule | cut footers; fold any extra entries (skill refs) into the matrix | −500 |
| R5 | advisory · judgment | `platform.md` Windows shell sections (~1.5k) + env-var bullets duplicating `security.md` § Secrets | Windows-only text loads on Linux/macOS/cloud | move PowerShell + Git Bash sections to `platform.md`-linked reference (proposed `documentation/DOC_WINDOWS_SHELL.md`, new `DOC_` file needs your OK), keep a one-line trigger "shell is PowerShell or Git Bash → read it before the first command"; merge env dup into `security.md`. Risk: Cursor-on-Windows must follow the pointer | −400 |
| R6 | advisory | `testing.md` § Local test authority (0.8k), § Edge Functions testing (0.8k) | table duplicates `DOC_AGENT_WORKFLOW_LAYERS.md` § Local git; Edge Function testing matters only under `supabase/functions/**` | shrink to "merge gate = CI `test`; local tiers: layers doc"; move Edge Function testing to path-scoped `cloud-functions.md` (release gate stays one line) | −300 |
| R7 | advisory | `agent-behavior.md` Protected Files: pre-commit paragraph (0.5k), examples list | misplaced, stated in testing + layers doc; examples verbose | cut paragraph (pointer exists in testing.md); shrink examples to one line. Consent gate wording untouched | −150 |
| R8 | advisory | `code-style.md` § Enforced by tooling (1.1k) + § Complexity table (0.5k) | already enforced by Prettier/ESLint/tsc | shrink to commands + "SSOT `eslint.config.js`"; keep the "fix errors, don't add warnings" policy | −300 |
| R9 | advisory | `architecture.md` § Plain optimistic TanStack (0.7k) | SSOT already `documentation/DOC_TANSTACK_QUERY.md` | one-line pointer | −130 |
| R10 | advisory · structural | src-only guidance in always-on rules: architecture placement/edge cases/granularity (3.7k), code-style TypeScript/styling/complexity (2.5k), debugging API/pagination (0.8k) | only matters when touching `src/**` / services | new path-scoped rule(s) `paths: ["src/**"]` → backlog task (new rule file, catalog, Cursor glob check). Saves ~1.7k on non-src tasks. Must not touch the fenced folder-tree block | (−1,700, later lap) |
| R11 | advisory | skill descriptions (3.5k listed) | "Not for" clauses repeat each skill's body table | backlog task via `meta-write-skill` with trigger tests; never drop trigger phrases | (−~800, later lap) |
| R12 | advisory | built-ins `/code-review`, `/simplify`, `/loop`, `/batch` | overlap check | no replacement: loop skills carry owner gates and repo rules the built-ins lack. Back, not replace: `loop-check` size-M lens review may call `/code-review` for the correctness lens; `loop-build` cleanup / `spec-optimize-performance` complexity level may call `/simplify`. `/loop` (recurring prompt) and `/batch` (one mechanical change fanned out) don't overlap `loop-orchestrate` (owner-gated laps). Backlog task to add the `Calls` lines | 0 |

Out of scope (other threads): `architecture.md` src/ folder tree (folder-tree-pointer), `.claude/settings.json` (feedback-hooks, secrets-deny). Scan also lists stale refs (e.g. `.claude/worktrees/`, historic paths in `DOC_DECISION_LOG.md`) — coherence lens, not this lap.

## Savings (R1–R9, recommended for this lap)

Always-loaded ≈ 17.6k → ≈ 13.9k tokens (−21%). R10 + R11 later: ≈ −2.5k more.

## Kept on purpose (scar tissue / gates)

Protected-files consent, Model B single-landing-path + ancestor invariant, "never relax `main` ruleset under C", emergency-main gate, Naming F1–F6, layer-consistency stop, When-to-ask stop list.

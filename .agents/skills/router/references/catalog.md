# Skill catalog (registry)

Registry for `scripts/validate-skills.cjs` (admission check, D37). Every skill folder in `.agents/skills/` must be either a v0.42.0 skill listed in [`baseline-sections.md`](baseline-sections.md) or a row below. A `built` row is fully checked; `planned` rows are the target of the skill-loop rework.

Design, edges and decisions: `documentation/jobs/temp_job_skill_loop/` (`CATALOG.md`, `DECISIONS.md`, `PHASE2.md`). Structure: [`create-skill/references/skill-template.md`](../../create-skill/references/skill-template.md).

## Skills

| Skill | Status | Replaces (v0.42.0) |
|---|---|---|
| `router` | planned | `router` |
| `loop-backlog` | planned | `router`, `start` |
| `loop-refine` | planned | `grill-me`, `feature` |
| `loop-plan` | planned | `plan`, `feature`, `plan-grill`, `plan-grill-auto`, `quick-piv`, `review-dev-plan`, `validate`, `api-integrate`, `pattern-review`, `purge-skill`, `consolidate`, `modularity-review`, `optimize2` |
| `loop-build` | planned | `implement`, `quick-piv` |
| `loop-check` | planned | `validate`, `review` |
| `loop-ship` | planned | `finish`, `push`, `bundle-ship` |
| `loop-verdict` | planned | `finish` |
| `spec-load-context` | planned | `prime` |
| `spec-debug-runtime` | planned | `debug`, `hypothesis` |
| `spec-reuse-package` | planned | `dont-reinvent-the-wheel` |
| `spec-simplify-flow` | planned | `challenge`, `standards-align` |
| `spec-optimize-performance` | planned | `optimize2`, `react-perf-vite` |
| `spec-check-layer` | planned | `layer-consistency-check` |
| `meta-write-skill` | planned | `create-skill` |
| `meta-audit-harness` | planned | `align-harness`, `tighten-harness` |
| `meta-intake-harness` | planned | `update-harness` |
| `meta-write-adoption-guide` | planned | `write-adoption-guide` |
| `meta-learn-lessons` | planned | `learn` |
| `meta-grade-rule` | planned | `rule-quality` |
| `meta-compress-output` | planned | `caveman` |

## Retired without a skill

| Source (v0.42.0) | Destination |
|---|---|
| `name-the-mechanism` | `code-style` rule § Naming (D33) |
| `improve` | deleted — an owner front door to specialists (D35) |

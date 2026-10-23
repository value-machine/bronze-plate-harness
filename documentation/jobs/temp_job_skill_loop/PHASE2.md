# Phase 2 — recurring skill structure, admission check, build batches

Job: `temp_job_skill_loop` · Baseline: harness v0.42.0 (`a920c0d`) · Inputs: [`CATALOG.md`](CATALOG.md), [`DECISIONS.md`](DECISIONS.md) (D1–D57)

## 1. Recurring skill structure (D30, D31, D55)

Every skill folder:

```text
.agents/skills/<name>/
├── SKILL.md               # the structure below; body ≤ ~250 lines
└── references/
    ├── PORT_MAP.md        # D55 — required while any v0.42.0 skill feeds this one
    └── <topic>.md         # loaded on demand; SKILL.md says when to read each
```

### `SKILL.md` template

```markdown
---
name: <category>-<verb>[-<object>]        # router | loop-* | spec-* | meta-* (D32, D39)
category: router | loop | spec | meta
description: >-
  <What it does, one sentence.> Use when <triggers — conditions and phrases>.
  Not for <neighbor case> (use <skill>).
---

# <name>

<Purpose: 2–3 sentences. What is true when this skill is done.>

## Edges

| Field | Value |
|---|---|
| Trigger | <when it runs> |
| In | <files / state it reads> |
| Out | <files / state it writes> |
| Calls | if <condition> → <link: ../<skill>/SKILL.md> · if <condition> → <link: references/<x>.md> |
| Called by | <link: ../<skill>/SKILL.md>, … · owner (meta, spec — D36, D57) |
| Next | <link: ../<skill>/SKILL.md> |
| Owner stops | none · stop list (`agent-behavior` rule § When to ask) · <stage-specific> |

## Steps

1. <imperative step; why in one clause when not obvious>
2. …

## Output

<exact format of what it writes or posts — template or short example>

## Not for

| Case | Use |
|---|---|
| <neighbor case> | <link: ../<skill>/SKILL.md> |
```

Rules for the body:

- **`<link: …>` placeholders** above stand for relative markdown links (name in brackets, path in parentheses); they are written out as placeholders here only because the repo link validator checks this file.

- **Links, not prose names.** Every skill or rule mentioned is a relative link, so the admission check can verify it (D31).
- **Point at SSOT.** Rules are linked, never restated. Loop skills link the stop list in the `agent-behavior` rule and the shared asking reference; they do not copy them (D40).
- **Guards come from rules (D56).** A `Calls` line for a guard names the rule section that fires it.
- **No relative time words** for harness state; cite the harness version (D28).

### `references/PORT_MAP.md` format (D55)

```markdown
# Port map — <name>

| Source (v0.42.0) | Section | Status | Where / why |
|---|---|---|---|
| `grill-me` | § Non-goals are first-class | kept | SKILL.md § Steps 3 |
| `grill-me` | § Codebase grounding | moved | references/grounding.md |
| `feature` | § 1.1 Branch & Workflow Check | dropped | `loop-ship` owns branch mode (D34) |
```

Status is one of `kept` / `moved` / `dropped`. `dropped` needs a reason. Every `##` and `###` heading of each source skill appears once across all port maps.

## 2. Admission check (D37)

`scripts/validate-skills.cjs` (+ `scripts/validate-skills.test.cjs`), run by `pnpm validate:skills`.

| # | Check | Fails when |
|---|---|---|
| 1 | Name | Folder ≠ `name`, or `name` does not match `router` / `loop-*` / `spec-*` / `meta-*` |
| 2 | Frontmatter | `description` or `category` missing; `category` ≠ prefix |
| 3 | Structure | `## Edges`, `## Steps`, `## Output`, `## Not for` missing or out of order; an edge field missing |
| 4 | Links | A linked skill, reference or rule path does not exist |
| 5 | Reciprocity | A `Calls` link to skill B without A in B's `Called by` (and the reverse) |
| 6 | Catalog | Skill not in `.agents/skills/router/references/catalog.md`, or catalog lists a missing skill |
| 7 | Port map | Missing while the catalog lists v0.42.0 sources; a status outside the three; `dropped` with no reason; a source heading missing across all port maps |
| 8 | Threshold (D53) | A `spec-*` skill with fewer than two loop callers |

Wiring:

- **Pre-commit:** runs when any `.agents/skills/**` path is staged (the docs-only light path included).
- **CI:** runs in the `test` job.
- **Transition:** v0.42.0 skills sit on an allowlist inside the script. Each batch removes its entries. The allowlist must be empty at the end of batch 4, and from then on the check blocks.

The catalog moves from this job folder to `.agents/skills/router/references/catalog.md`, because `projectStructure.config.cjs` allows no loose files in `.agents/skills/`. It replaces router § Skill index.

## 3. Build batches

Breadth-first by layer (D30). Each batch is one PR. Old skills are deleted in the batch that replaces them; there are no aliases (D42).

| Batch | Content | Protected paths touched |
|---|---|---|
| **0 — Scaffolding** | Template + PORT_MAP format as `meta-write-skill/references/`; `validate-skills.cjs` + test (allowlist mode); catalog → `router/references/catalog.md`; pre-commit + CI wiring | `.agents/skills/**`, `.husky/pre-commit`, `.github/workflows/**` |
| **1 — Rules** | `agent-behavior`: § When to ask (choice definition + stop list) replaces the Decision Questioning Protocol (D40). `code-style`: naming core (D33). `architecture`: guard triggers + assumption check (D33, D56). `git-workflow`: commit timing C (D25), Stop 2 per mode (D47); PR / CI / promote steps marked for `loop-ship`. `debugging`: strategy marked for `spec-debug-runtime` (D34). `workflow`: deleted (D34). Relative-time line (D28). `AGENTS.md` + `.cursor/rules/INDEX.md` catalog rows | `.cursor/rules/**` |
| **2 — Loop** | `router`, `loop-backlog` (MILA port), `loop-refine`, `loop-plan` (+ `deepen-modules`, `research-api`, `review-precedent`, `remove-feature` references), `loop-build`, `loop-check` (+ `component-lens`), `loop-ship`, `loop-verdict`; delete the replaced skills; update `DOC_AGENT_WORKFLOW_LAYERS.md`, `router/references/*`, `CLAUDE.md` | `.agents/skills/**` |
| **3 — Specialists** | The 6 `spec-*` skills; delete the replaced skills | `.agents/skills/**` |
| **4 — Meta** | The 7 `meta-*` skills; fork adoption note with the rename map (D42); allowlist emptied, so the check blocks | `.agents/skills/**`, `scripts/` |

Between batches the harness keeps working. Not-yet-replaced v0.42.0 skills stay on the allowlist, and batch 2 links them where a loop skill still calls one (for example `debug` until batch 3).

## 4. What needs owner approval

| Item | Why |
|---|---|
| Writing to `.agents/skills/**`, `.cursor/rules/**`, `.husky/**`, `.github/workflows/**` | Protected files (`agent-behavior` rule § Protected Files) |
| Deleting 30 v0.42.0 skills over batches 2–4 | Irreversible for forks (D42 adoption note covers migration) |

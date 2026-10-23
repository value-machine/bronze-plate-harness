# Phase 2 — recurring skill structure, admission check, build batches

Job: `temp_job_skill_loop` · Baseline: harness v0.42.0 (`a920c0d`) · Inputs: [`CATALOG.md`](CATALOG.md), [`DECISIONS.md`](DECISIONS.md) (D1–D61)

Checked against MILA `write-a-skill` and Anthropic `skill-creator` (D58–D60).

## 1. Recurring skill structure (D30, D31, D55, D58, D59)

```text
.agents/skills/<name>/
├── SKILL.md               # template below; body ≤ ~250 lines
├── references/
│   ├── PORT_MAP.md        # D55 — while any v0.42.0 skill feeds this one
│   └── <topic>.md         # loaded on demand; SKILL.md says when to read each; one level deep
├── scripts/               # deterministic, repeated work (validation, formatting)
└── evals/                 # D59 — skill-creator / `claude plugin eval` layout
    └── <case-name>/
        ├── prompt.md      # settings block, then the user's prompt
        ├── case.yaml      # schema_version "1.1", name, expected_outcome
        └── graders/NN-<few-words>.md
```

Template: `.agents/skills/create-skill/references/skill-template.md` (moves to `meta-write-skill` in batch 4). It holds:

- **Frontmatter:** `name` + `description` only. The prefix carries the category. The description is the only place for triggers: one sentence on what it does, then "Use when …", then "Not for … (use …)". At most 1024 characters, a little pushy, in third person.
- **Body sections, in order:** Purpose, `## Edges` (In, Out, Calls, Called by, Next, Owner stops), `## Steps`, `## Examples`, `## Output`, `## Not for`.
- **Writing rules:**
  - Every skill or rule mentioned is a relative link.
  - Point at the rule that owns a topic; never restate it. Guards come from rules (D56).
  - Use the imperative and explain why instead of ALL-CAPS MUSTs.
  - Keep terms consistent.
  - References over 300 lines get a table of contents.
  - No relative time words (D28).

Port map format: `.agents/skills/create-skill/references/port-map-format.md`.

## 2. Registry and admission check (D37)

**Registry:** `.agents/skills/router/references/catalog.md`. One row per replacement skill (`planned` / `built`, plus the v0.42.0 sources it replaces), and one table of sources retired into rules or deleted. The baseline headings live in `.agents/skills/router/references/baseline-sections.md`, a snapshot of every v0.42.0 skill heading generated from `a920c0d`. Port-map completeness is checked against it, so the check keeps working after the old skills are deleted.

**Check:** `scripts/validate-skills.cjs` + `scripts/validate-skills.test.cjs`, run by `pnpm validate:skills`.

| # | Check | Fails when |
|---|---|---|
| 1 | Admission | A skill folder is neither a v0.42.0 skill (baseline) nor in the catalog |
| 2 | Name | A `built` skill's folder ≠ `name`, or `name` doesn't match `router` / `loop-*` / `spec-*` / `meta-*` |
| 3 | Frontmatter | `description` missing, over 1024 characters, or without "Use when" |
| 4 | Structure | Body sections missing or out of order; an edge field missing |
| 5 | Reciprocity | A `Calls` link to a built skill B without A in B's `Called by` (and the reverse) |
| 6 | Catalog | A `built` row whose folder is missing |
| 7 | Port map | Missing while the row lists sources; a status other than kept / moved / dropped; `dropped` with no reason; once every skill replacing a source is built, any baseline heading of that source left uncovered |
| 8 | Threshold (D53) | A `spec-*` skill with fewer than two `loop-*` / `router` callers |
| 9 | Evals (D59) | A `loop-*` skill with no `evals/<case>/prompt.md` |

Link resolution is already enforced repo-wide by `pnpm validate:docs:links`; the check does not repeat it.

**Legacy:** v0.42.0 skills whose catalog row is not `built` are skipped. The allowlist shrinks by itself as each batch marks rows `built` and deletes the old folders. There's no separate list.

**Wiring:**
- `pre-commit` runs it on every path, including the docs-only light path.
- CI runs it in the `test` job.

## 3. Claude Code discovery (D60)

`scripts/sync-agent-config.mjs`, vendored from MILA with its test, mirrors `.agents/skills/` into `.claude/skills/`. It is driven by `agent-sync.config.json` (skills kind only), and `.claude/skills/.generated.json` lists the files it owns.

- `pre-commit` runs `--staged`, which writes and stages the mirror and fails open.
- CI runs `--check`, which fails on drift.

`CLAUDE.md`'s "Claude Code does not auto-list them" note changes accordingly.

## 4. Build batches

Breadth-first by layer (D30). Each batch is one PR. Old skills are deleted in the batch that replaces them, with no aliases (D42).

| Batch | Content |
|---|---|
| **0 — Scaffolding** | Template + port-map format; catalog + baseline snapshot; `validate-skills.cjs` + test; `.claude/skills` mirror; `projectStructure.config.cjs` allows `evals/`, `.claude/skills/`, `agent-sync.config.json`; pre-commit + CI wiring; `CLAUDE.md` note |
| **1 — Rules** | `code-style`: naming core F1–F6 (D33) — `name-the-mechanism` deleted, 48 references repointed. `agent-behavior`: § When to ask (choice definition + stop list) + § How to ask replace the Decision Questioning Protocol (D40). `architecture`: guard triggers stay in the rule (D56); references updated. `file-placement`: no relative time words (D28). `AGENTS.md` + `.cursor/rules/INDEX.md` rows. **Moved to the batch that builds their destination (D62):** `git-workflow` commit timing C + Stop 2 per mode → batch 2 (`loop-ship`, `loop-verdict`); `workflow` deletion → batch 2 (checklist → `loop-check`, SSOT table → `AGENTS.md`); `debugging` strategy split → batch 3 (`spec-debug-runtime`); Pass-as-consent for listed rule changes (D50) → batch 2 (`loop-verdict`) |
| **2 — Loop** | Deferred rule edits from batch 1 (D62); `router` + 7 `loop-*` with references, port maps and evals (baseline = v0.42.0 originals); delete the replaced skills; update `DOC_AGENT_WORKFLOW_LAYERS.md`, `router/references/*` |
| **3 — Specialists** | `debugging` rule strategy split (D62); 6 `spec-*`; delete the replaced skills |
| **4 — Meta** | 7 `meta-*`; template moves to `meta-write-skill`; fork adoption note with the rename map (D42) |

## 5. Owner approval

| Item | Status |
|---|---|
| Batch 0 protected writes | Approved (D61) · built in `19da0a8` |
| Batch 1 protected writes | Approved ("proceed") · built in `e5e8f5d` |
| Batch 2 protected writes + deletions | Approved ("go!") · see D64–D66 |
| Batch 3 protected writes + deletions | Approved ("go") · see D67 |
| Batch 4 protected writes + deletions | Approved ("proceed") · see D68 |

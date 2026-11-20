---
name: meta-learn-lessons
description: >-
  Turns what just went wrong — a non-Pass verdict, repeated failed attempts, a critical CI fix,
  owner corrections — into durable guidance: traces the cause back to existing rules and skills
  (removal-first), applies a blank-model test so nothing a capable model already knows is
  persisted, picks the cheapest home that holds each lesson (a check before prose, an always-on rule
  last) and commits it to the same PR. Use when loop-verdict gets
  Change or Drop, when the owner runs /learn or asks for a retrospective or to sharpen rules, or
  after a multi-turn struggle is resolved. A manual /learn runs in the same turn, before any
  commit, even beside red CI. Not for active debugging (use spec-debug-runtime) or a
  harness-wide audit (use meta-audit-harness).
---

# meta-learn-lessons

When this skill is done, the mistake cannot silently repeat: the guidance that caused it is narrowed or removed, any new lesson lives in exactly one home, and textbook knowledge was left out on purpose. Lessons ride the lap's PR, each one only after the owner's yes in chat; a Pass or a merge never approves them (merge-is-pass D3).

## Edges

| Field | Value |
|---|---|
| In | Plan § Notes mistake signals, the diff and `git log`, CI output, owner corrections, `documentation/DOC_RULES_INDEX.md`, the rules and skills in the lesson's domain |
| Out | One home per lesson on the lap's branch: a tightened existing check, an area home (feature `README.md`, path-scoped rule, `spec-debug-runtime/references/patterns.md`), a skill or reference, last an always-on rule — or a `Foundation:` task; the scope line; the lesson report |
| Calls | always → [`references/lesson-procedure.md`](references/lesson-procedure.md) · if the lesson is a reusable procedure (a skill) → [`meta-write-skill`](../meta-write-skill/SKILL.md) · if it is a harness-wide structural conflict → [`meta-audit-harness`](../meta-audit-harness/SKILL.md) · if a rule's wording needs tightening → [`meta-grade-rule`](../meta-grade-rule/SKILL.md) |
| Called by | [`loop-verdict`](../loop-verdict/SKILL.md) (Change or Drop) · [`loop-orchestrate`](../loop-orchestrate/SKILL.md) (a mistake repeated across threads) · owner |
| Next | Back to `loop-verdict` (Change → feedback on top of the backlog); owner-direct → report and stop |
| Owner stops | Deleting or substantially rewriting existing rule text (show the line and the proposal first); large rewrites |

## Steps

1. **Run now when invoked by hand:** a manual `/learn` finishes in this turn and persists before any commit; proactive runs wait until the struggle is resolved.
2. **Inspect** what happened (diff, log, CI, corrections) as 3–7 bullets: symptom → root cause → fix.
3. **Reverse audit:** search rules and skills for lines that steered toward the mistake; classify misleading, overly broad, outdated, base knowledge or innocent.
4. **Form the lesson** (trigger, constraint, domain) and apply the **blank-model test**: would a capable model with no repo rules already do this? Yes → no prose; list it under Omissions. The test gates prose only: a check may still hold the lesson.
5. **Choose one home by the ladder** in [`references/lesson-procedure.md`](references/lesson-procedure.md) § 3 — first tier that holds wins: one way (backlog task) → tighten an existing check, proven to fail on the defect before the ask → area-scoped home → skill or reference → always-on rule. Tag the lesson `repo` or `harness`.
6. **Apply** a minimal edit matching the file's style; removals and narrowing are shown to the owner first.
7. **Report:** TL;DR, location, scope, removals with the owner's decision, omissions.

## Examples

**Example 1 — Change verdict**
Input: `loop-verdict`: "the export ignored the filter"; plan notes show the agent assumed the list query held the filters.
Output: reverse audit finds nothing misleading; the lesson is the repo's filter contract → one bullet in `src/features/tasks/README.md`; committed on the same PR.

**Example 2 — textbook lesson, held by a check**
Input: `/learn` after a missing `await` caused a race that `pnpm lint` let through.
Output: blank-model test: any model knows this → no prose, omission listed. Tier 2 still holds it: one rule entry in the lint config, shown in a scratch copy to pass on the tree and fail on the defect → one yes/no carrying that proof → applied; `scope harness`.

## Output

```text
Lesson: <1–2 sentences> · saved <file § section | check <file> | task | nothing> · scope <repo | harness | —> · removals <proposed / applied> · omissions <items + why>
```

## Not for

| Case | Use |
|---|---|
| An incident still being debugged | [`spec-debug-runtime`](../spec-debug-runtime/SKILL.md) |
| Conflicts across the whole harness | [`meta-audit-harness`](../meta-audit-harness/SKILL.md) |
| Scoring one rule file | [`meta-grade-rule`](../meta-grade-rule/SKILL.md) |

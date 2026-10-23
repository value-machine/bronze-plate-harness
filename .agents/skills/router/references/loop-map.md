# Loop map

The product-owner loop (D10). It replaces `dev-cycle-matrix.md` and `skill-relationship-flow.md` (v0.42.0). [`../SKILL.md`](../SKILL.md) uses this map to find where a lap stands. Decisions: `documentation/jobs/temp_job_skill_loop/DECISIONS.md`.

```text
STOP 1 ── loop-backlog ──► loop-refine ── "Building: X. Not: Y. Size: S." (no wait)
                               │
AUTONOMOUS                     ▼
   loop-plan ──► loop-build ──► loop-check ──► loop-ship ──► PR + preview
                    ▲               │ blockers                   │
                    └───────────────┘                            ▼
STOP 2 ──────────────────────────────────────────────── loop-verdict
     Pass   → loop-ship merges (C) / promotes (A/B) → task archived → loop-backlog
     Change → lessons on the same PR → feedback = top task → loop-backlog → loop-refine
     Drop   → PR closed → lessons as a backlog task → loop-backlog
```

- **Owner stops:** Stop 1 (confirm the top task; answer refine questions), Stop 2 (Pass / Change / Drop), and anything on the stop list (`agent-behavior` rule § When to ask) at any stage.
- **Waiting on owner** is one state (D45, D46): a lap at Stop 2, or parked on a stop-list question (an Open row in its `DECISIONS.md`). Waiting laps don't block the next task; only one lap is in the build stages at a time.
- **Sizes:** XS / S / M. Larger work is cut into laps of ≤ M (D44).
- **One lap = one branch** (worktree under Model C): the brief, ledger, plan and code of a lap all live on it (D45).

## Where a lap stands (resolution order — first match wins)

| Evidence | Stage |
|---|---|
| The owner's message names something to do now | `loop-backlog` step 1 (top of the backlog, D26) |
| A lap has an Open row in `DECISIONS.md` (parked question) | Ask that question ([`loop-refine/references/asking.md`](../../loop-refine/references/asking.md)), then resume the lap's stage |
| A lap's PR is open, CI green, preview present, no verdict yet | `loop-verdict` |
| A lap's PR is open with CI red or pending | `loop-ship` step 6 |
| Lap branch: every plan phase is `Done`, but there is no PR and no check summary | `loop-check` |
| Lap branch: the plan exists, with phases `Pending` | `loop-build` (first pending phase) |
| Lap branch: `BRIEF.md` exists, no plan | `loop-plan` |
| A task is `in-progress` with no lap folder | `loop-refine` |
| Nothing in progress | `loop-backlog` |

Find laps by listing `documentation/jobs/temp_job_*/BRIEF.md` on local and remote branches (`git branch -a`, `gh pr list`). The branch name carries the slug.

## Outside the loop

| Request | Where |
|---|---|
| Question with no repo change | Answer directly (D54) |
| Harness maintenance (skills, rules, audits, intake, adoption guides) | `meta-*` skills, called directly (D36). Until batch 4 of the rework: [`create-skill`](../../create-skill/SKILL.md), [`align-harness`](../../align-harness/SKILL.md), [`tighten-harness`](../../tighten-harness/SKILL.md), [`update-harness`](../../update-harness/SKILL.md), [`rule-quality`](../../rule-quality/SKILL.md), [`learn`](../../learn/SKILL.md), [`write-adoption-guide`](../../write-adoption-guide/SKILL.md) |
| One-off specialist work, called directly (D57); a resulting repo change becomes a backlog task | Until batch 3 of the rework: [`debug`](../../debug/SKILL.md), [`hypothesis`](../../hypothesis/SKILL.md), [`prime`](../../prime/SKILL.md), [`challenge`](../../challenge/SKILL.md), [`standards-align`](../../standards-align/SKILL.md), [`optimize2`](../../optimize2/SKILL.md), [`react-perf-vite`](../../react-perf-vite/SKILL.md), [`dont-reinvent-the-wheel`](../../dont-reinvent-the-wheel/SKILL.md), [`layer-consistency-check`](../../layer-consistency-check/SKILL.md) |
| Ultra-brief output | [`caveman`](../../caveman/SKILL.md) (overlay) |

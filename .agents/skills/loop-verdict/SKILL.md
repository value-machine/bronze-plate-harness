---
name: loop-verdict
description: >-
  Stop 2 of the product-owner loop. Hands the owner the preview link, test steps, the check
  summary, the recorded-decision lines and rule changes the PR carries, then asks one question:
  Pass, Change or Drop. Pass archives the task, then merges or promotes; Change runs lessons on the
  same PR and turns the feedback into the next top request; Drop closes the PR. Use when a lap's
  PR is green with a preview, when the owner reports test results ("looks good", "ship it",
  "this is wrong", "drop it"), or asks what is waiting for them. Not for shipping steps
  (use loop-ship) or picking the next task (use loop-backlog).
---

# loop-verdict

**Stop 2.** The owner judges the real thing, a working preview, before anything reaches production (skill-loop D11, D47). When this skill is done, the lap is merged and archived, turned into a Change request, or dropped, and the loop is back at Stop 1. The handoff has to make testing easy and make every decision in the PR visible, because the owner's Pass also approves the decisions and rule changes it lists (skill-loop D50).

## Edges

| Field | Value |
|---|---|
| In | PR and preview link, check summary, `BRIEF.md` success check, PR diff of decision homes (feature READMEs, `documentation/DOC_APP_VISION.md`, `.claude/rules/**`, `.agents/skills/**`), parked questions, plan **Notes during development** |
| Out | Merge / promotion (via `loop-ship`), archived task, closed PR, or feedback tasks on the backlog; lessons committed to the same PR |
| Calls | if the verdict is Pass → [`loop-ship`](../loop-ship/SKILL.md) (merge / promote) · if the verdict is Change or Drop (any non-Pass counts as trouble, skill-loop D50) → [`meta-learn-lessons`](../meta-learn-lessons/SKILL.md) · after any verdict → [`loop-backlog`](../loop-backlog/SKILL.md) |
| Called by | [`router`](../router/SKILL.md), [`loop-ship`](../loop-ship/SKILL.md) |
| Next | [`loop-backlog`](../loop-backlog/SKILL.md) |
| Owner stops | Stop 2 itself — one question, Pass / Change / Drop ([`loop-refine/references/asking.md`](../loop-refine/references/asking.md)) |

## Steps

1. **Collect what the owner must see:** the preview URL; test steps from the success check (where to tap, what should happen); the check summary's *not verified* list; every decision line the PR adds or changes in a decision home; every rule or skill change; any parked stop-list question from this lap.
2. **Post the handoff card** (§ Output) and ask one question: **Pass / Change / Drop**, with a challenge option when one is grounded (for example "ship it but cut the export button to a later lap"). An untested preview waits here and ranks as a blocker in the backlog (skill-loop D45).
3. **Pass** — in this order, so nothing is left to commit after the merge (lap-close-order D1):
   1. **Close the lap in one commit on the lap branch:** archive the task (remove it from `src/config/app-tasks.json` and append `{ title, description, status: "done" }` to `src/config/app-tasks-archive.json`), and remove the lap folder (`git rm -r documentation/jobs/temp_job_<slug>/`). Its decisions are already in `documentation/DOC_DECISION_LOG.md` (`loop-ship` step 3), and a folder left on the default branch ships to every fork and reads as an open lap to the [`router`](../router/references/loop-map.md) (onboarding-first-lap D4). Under Model C, push it and wait for CI to be green again. Under A/B, it lands on `develop` before the promotion.
   2. Run [`loop-ship`](../loop-ship/SKILL.md) step 8 (merge on Model C, promote on A/B). The Pass is consent for the rule and skill changes the card listed (skill-loop D50).
   3. Non-blocking remarks become new backlog tasks after the current top one (skill-loop D17).
4. **Change:**
   1. Run [`meta-learn-lessons`](../meta-learn-lessons/SKILL.md): a non-Pass verdict is the trouble signal (skill-loop D50). Feed it the verdict plus any red CI, size overrun, or mistake signals in **Notes during development**, and commit its rule or skill edits to this PR, so the next Pass approves them.
   2. Write the feedback as the top backlog task, linked to this lap (same branch and PR; a fix round stays on the PR, skill-loop D11).
   3. Hand to [`loop-backlog`](../loop-backlog/SKILL.md), which starts it at once (owner-named task, skill-loop D26) → `loop-refine` sizes the fix depth (skill-loop D50).
5. **Drop:**
   1. Close the PR. Its lap decisions vanish with the branch, because they only land through the merge (skill-loop D48).
   2. Archive the task with `status: "done"` and a `dropped: <one-line reason>` note in the description. The closed PR can't carry it: under Model C the archive rides the next lap's branch and PR (lap-close-order D1).
   3. Run [`meta-learn-lessons`](../meta-learn-lessons/SKILL.md) (a Drop is a non-Pass verdict). With no PR left to ride, its edits become one backlog task ("lessons from <lap>"), placed after the current top. Then go to [`loop-backlog`](../loop-backlog/SKILL.md).
6. **Report faithfully** (`agent-behavior` rule § Success Validation): what was verified by checks, and what only the owner's test can tell.

## Examples

**Example 1 — Pass**
Input: owner: "works on my phone, ship it".
Output: archive "Export tasks as CSV" and remove its lap folder in one commit on the lap branch; CI green; merge the PR (Model C); `Task archived · Merged #42 · Next: loop-backlog` → Stop 1 opens with the reordered backlog.

**Example 2 — Change**
Input: owner: "CSV should include due dates, and the button is hard to find".
Output: the lap had no trouble, so no lessons. One top task "CSV export: add due dates, move the button to the toolbar", linked to the same PR → loop-backlog → loop-refine sizes it XS → fix round on the same PR.

## Output

The handoff card, then one question:

```markdown
## Ready for you to test
- **What changed:** …
- **Preview:** <url>
- **Steps:** 1. … 2. … (expected: …)
- **Not verified by checks:** …
- **Decisions this PR records:** <README / vision / rule line> · …
- **Rule / skill changes (your Pass approves them):** <file — one line> · … | none
- **Waiting on you:** <parked question> | none
- **CI:** green on <PR link>
```

## Not for

| Case | Use |
|---|---|
| Committing, pushing, fixing CI | [`loop-ship`](../loop-ship/SKILL.md) |
| Choosing or ordering the next task | [`loop-backlog`](../loop-backlog/SKILL.md) |
| Rolling back a released change | A Change request: a revert PR at the top of the backlog (skill-loop D52) |

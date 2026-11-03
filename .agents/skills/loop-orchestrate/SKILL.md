---
name: loop-orchestrate
description: >-
  Runs several laps of the product-owner loop at once: owns the backlog and task state, grows it
  from the app vision and the owner's remarks, starts one separate session per independent task,
  settles or relays thread questions, passes information between threads, and merges each
  thread's PR after the owner's Pass. The owner talks only to the orchestrator. Use when two or
  more ready tasks touch different feature areas and the owner accepts the parallel run offered at
  Stop 1, or says "orchestrate", "run these in parallel", "work the backlog", "do several at once".
  Not for a single task (the plain loop via router), nor for one lap's stage work (each loop-* skill).
---

# loop-orchestrate

When this skill runs, the owner has one conversation that moves many tasks: the backlog is accurate and keeps growing from the vision, every independent task is in flight in its own session, only questions nobody else can answer reach the owner, and every result arrives as a preview the owner can pass or reject. It is optional. With one ready task the plain loop is cheaper, and this skill never loads (orchestrator-parallel-laps D2).

## Edges

| Field | Value |
|---|---|
| In | `src/config/app-tasks.json` + archive, `documentation/DOC_APP_VISION.md`, owner messages, open PRs and previews, thread reports |
| Out | Backlog order, new tasks and task status; one session per running lap; owner handoffs; merged PRs with their tasks archived |
| Calls | to catch up and rank → [`loop-backlog`](../loop-backlog/SKILL.md) steps 2–4 · each thread runs its lap from → [`loop-refine`](../loop-refine/SKILL.md) · for each green PR → [`loop-verdict`](../loop-verdict/SKILL.md) handoff · on the owner's Pass → [`loop-ship`](../loop-ship/SKILL.md) merge · if threads repeat a mistake → [`meta-learn-lessons`](../meta-learn-lessons/SKILL.md) · when nothing is ready or in flight → [`router`](../router/SKILL.md) |
| Called by | [`router`](../router/SKILL.md), [`loop-backlog`](../loop-backlog/SKILL.md) |
| Next | Itself, until nothing is ready or in flight; then [`router`](../router/SKILL.md) |
| Owner stops | The yes to a parallel run, new tasks it proposes, Stop 2 per PR, and stop-list items ([`agent-behavior` rule § When to ask](../../../.claude/rules/agent-behavior.md)) it can't settle |

## What it owns

- **The backlog.** It is the only writer of task state while it runs; threads leave `app-tasks.json` alone, so parallel PRs don't conflict on it (orchestrator-parallel-laps D3). It reorders on its own and reports the new order, without waiting for a confirmation (orchestrator-parallel-laps D8). Each task's archive still rides on that task's PR, so a merge stays a Pass (merge-is-pass D1).
- **Growing the backlog.** Remarks the owner makes in passing become tasks. Gaps between the vision and the app become proposed tasks that the owner confirms (orchestrator-parallel-laps D8). A task that pulls against the vision is a conflict for the owner, not work for a thread.
- **What runs together.** Every ready task whose feature areas don't overlap a running one starts at once, with no cap (orchestrator-parallel-laps D9). Overlapping tasks queue behind each other. Without this skill, one lap builds at a time (skill-loop D45, orchestrator-parallel-laps D1).
- **Questions.** Threads never ask the owner directly. The orchestrator answers what the vision, recorded decisions or another thread already settle, and asks the owner the rest, one at a time, per [`asking.md`](../loop-refine/references/asking.md) (orchestrator-parallel-laps D4, D8). A thread waiting on an answer parks while the others keep going.
- **Between threads.** It tells a thread what another one changed that affects it (shared code, a type, a decision). It pauses or re-scopes a thread that drifts from its task or starts to overlap another (orchestrator-parallel-laps D8).
- **Integration.** Each thread ships its own PR and preview, and its own `loop-check` and CI are the check (orchestrator-parallel-laps D6, D8). The orchestrator merges passed PRs one by one. After each merge it brings the remaining branches up to date, resolves conflicts itself, and lets CI go green again before their handoff.
- **Lessons.** A mistake seen in more than one thread goes to [`meta-learn-lessons`](../meta-learn-lessons/SKILL.md). Rule and skill changes still need the owner's yes in chat.
- **Momentum.** When a thread finishes, the next ready task starts without a check-in, until nothing is ready (orchestrator-parallel-laps D8). Only Stop 2 and unanswerable questions wait for the owner.

## Threads

A thread is a separate session the owner can open and watch, on its own branch, pushing its own PR (orchestrator-parallel-laps D5). Brief it like a peer: the task, the lap slug, and the boundary. It runs its lap from [`loop-refine`](../loop-refine/SKILL.md) to an open PR with green CI, reports questions and results to the orchestrator instead of the owner, and leaves the backlog alone. Messages between threads go through the orchestrator, so it hears about every overlap.

## Steps

1. **Start.** The owner's yes to the parallel run at the [`loop-backlog`](../loop-backlog/SKILL.md) confirm starts this skill. When called directly, rank first and propose what starts now and what queues.
2. **Dispatch** every ready, non-overlapping task: set it `in-progress` and start its session.
3. **Run** on events: thread reports, owner messages and merges. Each event can change the backlog, a thread, or what starts next.
4. **Stop 2.** When PRs go green with previews, send one handoff listing each PR in the [`loop-verdict`](../loop-verdict/SKILL.md) format, and take a verdict per PR. A Pass merges via [`loop-ship`](../loop-ship/SKILL.md). A Change goes back to that PR's thread. A Drop closes the PR.
5. **Finish** when nothing is ready or in flight: post the status line and hand back to [`router`](../router/SKILL.md).

## Examples

**Example 1 — parallel run**
Input: the backlog has "CSV export" (tasks), "Avatar in top bar" (layouts, profile) and "Rename tasks column" (tasks). The owner says yes to the parallel run.
Output: two sessions start (CSV export, Avatar); "Rename tasks column" waits for CSV export because they share an edge. The Avatar thread asks which image size to use, and the profile README already records it, so the orchestrator answers. Later one handoff lists both previews, with a verdict per PR.

**Example 2 — not needed**
Input: one ready task, or the owner names a single task.
Output: the router runs the plain loop, and this skill doesn't load.

## Output

```text
Running: <task> (<session>) · … · Waiting on you: <PR to test | question> · … · Queued: <task> (<reason>)
```

## Not for

| Case | Use |
|---|---|
| A single task | [`router`](../router/SKILL.md) → plain loop |
| One lap's stage work | That stage's `loop-*` skill |

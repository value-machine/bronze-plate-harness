# Fresh-eyes claim check

How [`loop-refine`](../SKILL.md) step 8 verifies what the draft brief says about the repo before anything builds on it. The drafting agent is anchored on its own reading ([`grounding.md`](grounding.md) § Verify before you state is a self-check); a subagent that never saw the conversation is not. Adopted from Compound Engineering `ce-brainstorm` § 2.6 Claim Verification (v3.38.2) (compound-engineering-adoption D4–D7).

## What counts as a checkable claim

A sentence in `BRIEF.md` that `loop-plan` or `loop-build` would treat as fact about the repo:

- **Behavior:** each `Loop today` cell in § Edges (trigger → path → outcome).
- **Absence:** "no X exists", "nothing calls Y", `Not found`.
- **Location:** a named file, folder, config key, script, dependency or rule section.
- **Foundation signals:** each `<where> · <what>` line.

Not claims: the problem, the success check, scope choices, owner answers, and sizes. Those are decisions, not facts about the code.

**Skip** the check only when the brief makes no checkable claim (compound-engineering-adoption D5). It runs at every size: a wrong claim costs a build round however small the lap.

## Dispatch

One read-only subagent, spawned as in [`loop-check/references/rule-audit.md`](../../loop-check/references/rule-audit.md) § Subagent contract (second copy of that invocation: Cursor `Task` with `subagent_type: explore`, `readonly: true`; Claude Code `Agent` with the `Explore` type). It does not see the chat: paste the verifier prompt below in full with the numbered claim list filled in, and do not paste `BRIEF.md` (its scope and decisions are the context a fresh check must not have). Run it in the foreground: step 9 (size) reads its verdicts.

> You are a read-only claim verifier for the repository at `<repo root>`. Do not edit anything. Budget: about 15 targeted reads or searches.
>
> Verify each claim below directly against the files. For each, return one line:
> `C<n> — confirmed | refuted | unverifiable — <file:line evidence> — <one-line note; for refuted, what is actually true>`.
> Use `unverifiable` when the budget runs out or the evidence is ambiguous; never guess. Then stop.
>
> C1. <claim, one sentence, with the path it is about>
> C2. …

Write each claim as one self-contained sentence that names its path; the verifier has no other context.

## Using the verdicts

| Verdict | Change to the brief |
|---|---|
| confirmed | none |
| refuted | Correct the claim from the verifier's evidence. If the correction changes scope or edges, redo the affected part of steps 5–7 (a new owner question only if it now hits the stop list), then re-check once only the claims the redo added or changed |
| unverifiable | Keep it, prefixed `Assumption — unverified:`; it is not a fact to build on until [`loop-plan`](../../loop-plan/SKILL.md) has read that code itself |

Record the result on the brief's `Claim check:` line ([`brief-template.md`](brief-template.md) § Decisions): the counts, or `none to check` when skipped.

A verifier that errors or returns nothing: retry once, then verify the claims inline and append `· inline (subagent failed)` to that line. Never record an inline check as a subagent check.

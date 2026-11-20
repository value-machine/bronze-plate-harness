# Refine analysis — what ce-brainstorm would change in loop-refine, and why

Lap: `temp_job_compound-engineering-adoption` (D1). Owner asked to understand the why, what and consequences of each change before anything is adopted. Compared: `loop-refine` at plate-harness v0.44.0 vs `ce-brainstorm` at Compound Engineering v3.38.2.

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

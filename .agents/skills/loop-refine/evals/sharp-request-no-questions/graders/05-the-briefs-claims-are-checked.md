---
type: llm
focus: trace
weight: 1
---

Before the restatement line, the brief's claims about the repo (for example the Loop today cells in its Edges table) are sent to a read-only subagent that is given the claims but not BRIEF.md, and BRIEF.md has a line starting "Claim check:" with the verdict counts (or "inline (subagent failed)" appended when no subagent could run).

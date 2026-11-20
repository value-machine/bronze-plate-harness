---
type: llm
focus: trace
weight: 1
---

The fail-on-defect proof was actually run, not merely claimed: the trace shows the check command executed in a scratch copy outside the repository working tree, once failing on a file with the defect shape (a feature component importing `@/shared/services/...`) with the tightened config, and passing on the current tree.

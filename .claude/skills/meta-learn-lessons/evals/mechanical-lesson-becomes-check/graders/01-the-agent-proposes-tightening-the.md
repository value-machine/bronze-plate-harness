---
type: llm
focus: trace
weight: 1
---

The agent proposes tightening the existing lint check (an added entry in the feature-components `no-restricted-imports` restriction in `eslint.config.js`, or an equivalent one-entry change to a check the repo already runs) and asks the owner one yes/no question; `eslint.config.js` in the workspace is not modified before an answer.

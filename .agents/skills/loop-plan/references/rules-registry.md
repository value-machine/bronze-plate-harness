# Rules registry (SSOT for skill cross-links)

Canonical paths for `.cursor/rules/` when skills need a rules table (and the rule decision tree from `feature` v0.42.0 § 1.2: backend/secrets → cloud-functions; database → database; new files → file-placement + architecture; auth/RLS → security; code → code-style). Full descriptions: [`.cursor/rules/INDEX.md`](../../../../.cursor/rules/INDEX.md).

| Topic | Rule file |
|-------|-----------|
| Overview / index | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.mdc` — layers, import direction, path aliases, structure whitelist |
| File placement | `.cursor/rules/file-placement/RULE.mdc` and `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.mdc` — naming (category, not first instance), complexity limits |
| Database | `.cursor/rules/database/RULE.mdc` — migrations, idempotent patterns |
| Security | `.cursor/rules/security/RULE.mdc` — auth, RLS, validation, secrets |
| Testing | `.cursor/rules/testing/RULE.mdc` |
| Git workflow | `.cursor/rules/git-workflow/RULE.mdc` — mode config `src/config/git-workflow.json`; § Mode behavior table (SSOT per mode); § Mode-aware branch gate; PRs; promote (A/B) |
| Agent behavior | `.cursor/rules/agent-behavior/RULE.mdc` — protected files, when to ask the owner |
| Platform | `.cursor/rules/platform/RULE.mdc` — PowerShell, env vars |
| Cloud / Edge | `.cursor/rules/cloud-functions/RULE.mdc` — when applicable |
| External API integration | `.cursor/rules/api-integration/RULE.mdc` — MCP-first, doc research, POC before code |
| Debugging | `.cursor/rules/debugging/RULE.mdc` — when diagnosing complex issues |
| Project-specific | `.cursor/rules/project-specific/RULE.mdc` — when applicable |

**Callers:** `loop-plan`, `loop-build`, `loop-check` — link here; do not copy this table into skill bodies.

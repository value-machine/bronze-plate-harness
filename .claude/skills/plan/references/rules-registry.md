# Rules registry (SSOT for skill cross-links)

Canonical paths for `.claude/rules/` when skills need a rules table. Full descriptions: [`documentation/DOC_RULES_INDEX.md`](../../../../documentation/DOC_RULES_INDEX.md).

| Topic | Rule file |
|-------|-----------|
| Overview / index | `documentation/DOC_RULES_INDEX.md` |
| Architecture | `.claude/rules/architecture.md` — layers, import direction, path aliases, structure whitelist |
| File placement | `.claude/rules/file-placement.md` and `projectStructure.config.cjs` |
| Code style | `.claude/rules/code-style.md` — naming (category, not first instance), complexity limits |
| Database | `.claude/rules/database.md` — migrations, idempotent patterns |
| Security | `.claude/rules/security.md` — auth, RLS, validation, secrets |
| Testing | `.claude/rules/testing.md` |
| Workflow hub | `.claude/rules/workflow.md` — code review, dev process, routing |
| Git workflow | `.claude/rules/git-workflow.md` — mode config `src/config/git-workflow.json`; § Mode behavior table (SSOT per mode); § Mode-aware branch gate; PRs; promote (A/B) |
| Agent behavior | `.claude/rules/agent-behavior.md` — protected files, decision protocol |
| Platform | `.agents/skills/platform/SKILL.md` — PowerShell, env vars |
| Cloud / Edge | `.claude/rules/cloud-functions.md` — when applicable |
| External API integration | `.claude/rules/api-integration.md` — MCP-first, doc research, POC before code |
| Debugging | `.claude/rules/debugging.md` — when diagnosing complex issues |
| Project-specific | `.claude/rules/project-specific.md` — when applicable |

**Callers:** `plan`, `implement`, `quick-piv`, `validate` — link here; do not copy this table into skill bodies.

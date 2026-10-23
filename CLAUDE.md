# CLAUDE.md

Claude Code entry point. `AGENTS.md` is the vendor-neutral SSOT for project memory (Cursor, Claude Code, Codex); this file only imports it and adds Claude-specific notes. Do not duplicate `AGENTS.md` content here.

@AGENTS.md

## Claude Code notes

- **Skills:** the source is `.agents/skills/<name>/SKILL.md` (vendor-neutral). `.claude/skills/` is a generated mirror (`scripts/sync-agent-config.mjs`, refreshed by pre-commit, drift-checked in CI) so the Skill tool lists them — edit the source, never the mirror. For any workflow request (`/plan`, `/finish`, `/validate`, `/push`, `/router`, ...) or non-trivial task: start from `.agents/skills/router/SKILL.md` § Skill index. Prefer the repo copy over any same-named user-level skill. New skills: `.agents/skills/create-skill/references/skill-template.md` and a row in `.agents/skills/router/references/catalog.md` (`pnpm validate:skills`).
- **Rules:** bodies live in `.cursor/rules/**/RULE.mdc` (SSOT, also read by Cursor). Open the relevant one on demand; `.claude/rules/*.md` are thin pointers only.
- **Tool mapping:** skills written with Cursor wording map as — "Task subagent" → `Agent` tool; "AskQuestion" → `AskUserQuestion`; `~/.cursor/skills-cursor/*` → not available here, skip.
- **Shell:** Windows. The Bash tool is Git Bash — follow `.cursor/rules/platform/RULE.mdc` § Git Bash; its PowerShell sections apply only in PowerShell.

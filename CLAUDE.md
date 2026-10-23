# CLAUDE.md

Claude Code entry point. `AGENTS.md` is the vendor-neutral SSOT for project memory (Cursor, Claude Code, Codex); this file only imports it and adds Claude-specific notes. Do not duplicate `AGENTS.md` content here.

@AGENTS.md

## Claude Code notes

- **Skills:** edit `.agents/skills/<name>/SKILL.md`; Claude Code loads the generated `.claude/skills/` mirror, so `/plan`, `/finish`, `/push`, ... are slash commands. For ambiguous work start at `.agents/skills/router/SKILL.md` § Skill index. A personal skill in `~/.claude/skills` with the same name hides the repo one — prefer the repo copy.
- **Rules:** `.claude/rules/*.md` load automatically — always-on ones at launch, `paths:` ones when you touch a matching file. Where to edit: `AGENTS.md` § Where to edit agent config.
- **Tool mapping:** skills written with Cursor wording map as — "Task subagent" → `Agent` tool; "AskQuestion" → `AskUserQuestion`; `~/.cursor/skills-cursor/*` → not available here, skip.
- **Shell:** Windows. The Bash tool is Git Bash — follow `.agents/skills/platform/SKILL.md` § Git Bash; its PowerShell sections apply only in PowerShell.

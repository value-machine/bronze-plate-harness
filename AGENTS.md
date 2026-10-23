# AGENTS.md

Project memory for coding agents (Cursor, Claude Code, Codex, and other AGENTS.md-aware tools).

## Project

**plate-harness** — Vite + React 19 + TypeScript + Tailwind/shadcn-ui + Supabase + TanStack Query harness (boilerplate + agent harness) with strict, enforced architecture.

- **Stack:** Vite 8, React 19, TypeScript 6 (strict), Tailwind CSS 4 + shadcn/ui (Radix, lucide-react), TanStack Query 5, Supabase 2, React Router 7, Vitest 4, ESLint 10 + GTS + Prettier, Husky + lint-staged, dependency-cruiser. Pin versions in `package.json`.
- **Package manager:** `pnpm@9.15.4` (enforced via `packageManager` field — do **not** use npm or yarn).

## Workflow — agent skills

Project agent workflows live under **`.agents/skills/<name>/SKILL.md`**. **Full catalog and routing:** `.agents/skills/router/SKILL.md` § Skill index.

**Routing:** For ambiguous work, read `.agents/skills/router/SKILL.md` first.

**Product context:** Fill `documentation/DOC_APP_VISION.md` (see `.agents/skills/start/SKILL.md`).

Layer model: `documentation/DOC_AGENT_WORKFLOW_LAYERS.md`.

**Package / pattern reuse:** `.agents/skills/dont-reinvent-the-wheel/SKILL.md` (before custom generic subsystems).

**Harness maintenance:** Coherence audit → `.agents/skills/align-harness/SKILL.md`. Context-cost pruning → `.agents/skills/tighten-harness/SKILL.md`. External intake → drop in `.agents/harness-inbox/` then `.agents/skills/update-harness/SKILL.md`.

## Rules

**Bodies (SSOT):** `.claude/rules/<name>.md` — open the file for full guidance; do not treat this catalog as the rule text. A rule without `paths:` frontmatter is always on; with `paths:` it loads only for matching files. Claude Code reads `.claude/rules/` directly; Cursor reads the generated `.cursor/rules/<name>.mdc` copies.

**Short "what for" (SSOT):** the Description column below — rule files carry no `description` frontmatter.

**Topic map + consistency matrix** (open when editing a rule): `documentation/DOC_RULES_INDEX.md`.

### Where to edit agent config

| Edit | Never edit (generated) |
|------|------------------------|
| Rules: `.claude/rules/<name>.md` | `.cursor/rules/*.mdc` |
| Skills: `.agents/skills/<name>/SKILL.md` | `.claude/skills/` |

The pre-commit hook rebuilds both mirrors from staged sources (`agent-sync.config.json`). Sync by hand: `node scripts/sync-agent-config.mjs`; CI fails on drift (`--check`).

### Catalog

#### Always on (no `paths:`)

| Path | Description |
|------|-------------|
| `.claude/rules/architecture.md` | Architectural patterns and structural organization standards |
| `.claude/rules/file-placement.md` | CRITICAL: Before creating any new file or folder, validate placement against projectStructure.config.cjs and architecture rules. Check structure whitelist, verify allowed file patterns, and suggest correct locations if invalid. Applies when user requests file/folder creation or assistant needs to create files. |
| `.claude/rules/code-style.md` | Global code style and formatting standards for all projects |
| `.claude/rules/workflow.md` | Development workflow hub — code review, dev process, deployment pointers |
| `.claude/rules/agent-behavior.md` | Agent decision protocol, success reporting, and protected-file consent |
| `.claude/rules/testing.md` | Testing standards, patterns, and quality requirements |
| `.claude/rules/debugging.md` | Debugging strategy, logging, issue analysis, and scientific method debugging |
| `.claude/rules/security.md` | Security best practices and vulnerability prevention |
| `.claude/rules/git-workflow.md` | Git branch models (Model A / B / C), PRs, and production promotion |

#### Path-scoped (`paths:`)

| Path | Description |
|------|-------------|
| `.claude/rules/database.md` | SQL migration best practices for the configured relational database (this fork: Supabase/PostgreSQL; not client queries or TanStack) · `paths: ["**/migrations/**/*.sql"]` |
| `.claude/rules/cloud-functions.md` | When to use Edge Functions vs frontend, function organization, and architecture guidelines · `paths: ["**/supabase/functions/**", "cloud-functions/**"]` |
| `.claude/rules/project-specific.md` | Supabase Edge Function rate limiting (Postgres rate_limits). Not a home for other hosts. · `paths: ["**/supabase/functions/**/*.ts"]` |
| `.claude/rules/api-integration.md` | Principles for researching an external API, vendor, or backend before writing integration code (MCP-first, doc-freshness, POC-before-code) · `paths: ["**/services/**", "**/lib/**", "**/supabase/functions/**", "cloud-functions/**"]` |

#### On demand (skill)

| Path | Description |
|------|-------------|
| `.agents/skills/platform/SKILL.md` | Windows shell rules (PowerShell + Git Bash) and local environment configuration |

## Defaults

- **Always read before edit.** Run `pnpm validate:structure` if creating new files in unfamiliar locations.
- **Git workflow mode:** Read `src/config/git-workflow.json`, then apply `.claude/rules/git-workflow.md` § Mode-aware branch gate. What each mode does: § Mode behavior table (Model C default; A/B selectable).
- **Name the mechanism before code.** Before adding or copying a function, hook, component, type, file, or feature folder — including a one-line edit — read `.agents/skills/name-the-mechanism/SKILL.md` and follow it.
- **Layer consistency before code.** Every request to change existing behavior carries an assumption about how the system works — verify it before acting (user can't see the impl). Cues: `.agents/skills/layer-consistency-check/references/workaround-shapes.md` § Request-side cues → run `.agents/skills/layer-consistency-check/SKILL.md` and stop for user choice before writing code.
- **Plan before non-trivial work.** Anything beyond a one-line fix should start with the `plan` skill (`.agents/skills/plan/SKILL.md`).
- **Lean output.** Don't restate skill content — point to the file and follow it.

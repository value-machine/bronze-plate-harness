# Rules Index

Quick reference guide to all rules and their relationships.

## Rule Categories

### Code Style (`.claude/rules/code-style.md`)
- Naming conventions (category, not first instance/SKU/page)
- Formatting standards
- Documentation requirements
- Code organization
- **What tooling enforces** (Prettier, `eslint.config.js`, tsc, dependency-cruiser) — run the command
- **Styling scope** (always ask scope before implementing styling changes)
- **Complexity thresholds** (SSOT `eslint.config.js`)
- Reuse and extraction checks

**Related to:** All other rules

---

### Architecture (`.claude/rules/architecture.md`)
- **Proactive design checks:** pattern risk (`pattern-review`), don't reinvent the wheel, performance cost risk, layer consistency (workaround guard; naming via `name-the-mechanism`)
- **Code placement**, edge-case placement, import direction
- **Folder structure** and **path aliases** (SSOT: `@/*` → `src/*` only)
- **Feature granularity / bounded context** (budgets in `featureBudgets.config.cjs`, cross-feature imports)
- **TanStack Query optimistic + canonical merge** (summary; playbook SSOT `documentation/DOC_TANSTACK_QUERY.md`)
- Changing architecture rules/configs; architecture docs

**Related to:** code-style, testing, security, workflow

---

### Testing (`.claude/rules/testing.md`)
- **Onboarding guide:** `documentation/DOC_TESTING.md` (runners, colocation, naming, examples)
- Test authority (failing test = claim, not ground truth)
- Local test authority (commit vs merge tiers)
- Test coverage requirements
- Testing patterns
- Test organization
- Quality standards

**Related to:** code-style, architecture, workflow

---

### Security (`.claude/rules/security.md`)
- Authentication & authorization
- Input validation
- Data protection
- Vulnerability prevention

**Related to:** architecture, code-style, workflow

---

### Workflow hub (`.claude/rules/workflow.md`)
- Code review process and development process
- Deployment pointers (links to `DOC_CLOUDFLARE_WORKERS`, `.claude/rules/cloud-functions.md`)
- **Rule routing** to child domain rules (do not duplicate their bodies here)
- **Minimal branch gate stub** — read `src/config/git-workflow.json`; full per-mode behavior in `.claude/rules/git-workflow.md` § Mode behavior table and § Mode-aware branch gate

**Related to:** All other rules (references them in review process)

---

### Git workflow (`.claude/rules/git-workflow.md`)
- **Branch and release strategy** (SSOT: § Mode behavior table — Model C default, A/B selectable; config: `src/config/git-workflow.json`)
- Branch protection, PR standards (Model A), merge diagnostics
- Production per mode (C: user merges the PR; A/B: **Promote to production** workflow)
- Commit/push flow pointers (`finish` / `push` skills for semver/changelog SSOT)

**Related to:** workflow hub, agent-behavior, platform

---

### Agent behavior (`.claude/rules/agent-behavior.md`)
- Protected files manifest (single SSOT)
- Decision questioning protocol
- Success reporting (verified vs unverified)
- Agent role and control

**Related to:** workflow hub, git-workflow, debugging

---

### Platform (`.agents/skills/platform/SKILL.md` — skill, loaded on demand)
- **PowerShell/Select-Object piping rules** (prevents IDE crashes)
- Windows command rules, `$LASTEXITCODE` handling
- Environment variable catalog (`VITE_*`, Supabase, Edge secrets)

**Related to:** workflow hub, git-workflow, security

---

### Cloud Functions (`.claude/rules/cloud-functions.md`)
- **When to use Edge Functions** vs frontend logic (decision framework)
- Function organization by business capability
- Deployment model and fragility considerations
- Testing strategy and migration paths

**Related to:** architecture, workflow, security

---

### Database (`.claude/rules/database.md`)
- **SQL migrations only** (`supabase/migrations/`) — not client queries or TanStack
- Safe migration patterns (idempotent, handles fresh/existing databases)
- New-table checklist (RLS, indexes, type generation)
- Layer boundaries (pointers to `.claude/rules/architecture.md`, `DOC_TANSTACK_QUERY.md`)
- Testing migrations (fresh database and incremental updates)
- Error handling and logging patterns

**Related to:** security, workflow, architecture

---

### API Integration (`.claude/rules/api-integration.md`)
- **MCP-first check** before assuming REST/scripts/browser fetch is the only path
- Doc-freshness (don't trust cached/stale docs)
- Cite doc URL(s) or MCP tool(s) actually used
- POC-before-code for new/unfamiliar vendors
- Pointer to `.agents/skills/api-integrate/SKILL.md` for the full procedure (MCP fallback decision tree, schema→sample discipline, vendor worked examples)
- Absorbs the former `.claude/rules/workflow.md` § Documentation Lookup

**Related to:** workflow, security, database, cloud-functions, project-specific

---

### Debugging (`.claude/rules/debugging.md`)
- Debugging strategies and logging practices
- Pointers to `debug` and `hypothesis` skills for scientific-method procedure
- Reductive strategy for bugs and new features

**Related to:** workflow, testing, architecture

---

### Project-Specific (`.claude/rules/project-specific.md`)
- Rate limiting patterns for Edge Functions
- Project-specific security implementations
- Implementation examples and checklists

**Related to:** security, cloud-functions, database

---

### File Placement (`.claude/rules/file-placement.md`)
- **Validate file and folder placement before creation** (mandatory pre-creation check)
- Project structure validation using `projectStructure.config.cjs`
- Architecture compliance verification
- Guidance for correct file/folder locations
- **Feature-local README (Option 1):** SSOT `documentation/DOC_FEATURE_LOCAL_README.md`; `pnpm validate:feature-docs` / `validate:feature-docs:strict` / `validate:feature-docs:staged`
- **Feature size / granularity:** SSOT `featureBudgets.config.cjs`; `pnpm validate:feature-size` / `validate:feature-size:staged`; see `.claude/rules/architecture.md` § Feature granularity

**Related to:** architecture, workflow

---

## Consistency Check Matrix

When modifying a rule, check these related rules:

| Rule | Check These Rules |
|------|-------------------|
| `code-style` | architecture, testing, workflow |
| `architecture` | code-style, testing, security, workflow, cloud-functions, database |
| `testing` | code-style, architecture, workflow, debugging |
| `security` | architecture, code-style, workflow, cloud-functions, database, project-specific, api-integration |
| `workflow` | All rules (hub), git-workflow, agent-behavior, platform, api-integration |
| `git-workflow` | workflow, agent-behavior, platform, cloud-functions, testing |
| `agent-behavior` | workflow, git-workflow, debugging, finish skill |
| `platform` | workflow, git-workflow, security |
| `cloud-functions` | architecture, workflow, security, project-specific |
| `database` | security, workflow, architecture |
| `api-integration` | workflow, security, database, cloud-functions, project-specific |
| `debugging` | workflow, testing, architecture |
| `project-specific` | security, cloud-functions, database |
| `file-placement` | architecture, workflow |

## Adding a New Rule

1. Create `.claude/rules/<name>.md`. No frontmatter = always on; add `paths:` (list of globs) to load it only for matching files. Prefer a skill in `.agents/skills/<name>/` when the guidance is a procedure, not a constraint.
2. Add a "Related Rules" section at the bottom.
3. Add a row to the `AGENTS.md` catalog (that row is the description SSOT) and a section here.
4. Update related rules to reference the new rule.
5. Commit: the pre-commit hook generates `.cursor/rules/<name>.mdc` (or run `node scripts/sync-agent-config.mjs`).

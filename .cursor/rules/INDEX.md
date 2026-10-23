# Rules Index

Quick reference guide to all rules and their relationships.

## Rule Categories

### Code Style (`code-style/RULE.mdc`)
- **Naming** (SSOT, F1–F6): name by role, mark the 2nd copy, extract the 3rd+; guidance updates in the same change
- Formatting standards
- Documentation requirements
- Code organization
- **What tooling enforces** (Prettier, `eslint.config.js`, tsc, dependency-cruiser) — run the command
- **Styling scope** (agent picks the scope, global tokens by default, and reports it)
- **Complexity thresholds** (SSOT `eslint.config.js`)
- Reuse and extraction checks

**Related to:** All other rules

---

### Architecture (`architecture/RULE.mdc`)
- **Proactive design checks:** pattern risk (precedent review, `loop-plan`), don't reinvent the wheel, performance cost risk, layer consistency (workaround guard; naming via `code-style` § Naming)
- **Code placement**, edge-case placement, import direction
- **Folder structure** and **path aliases** (SSOT: `@/*` → `src/*` only)
- **Feature granularity / bounded context** (budgets in `featureBudgets.config.cjs`, cross-feature imports)
- **TanStack Query optimistic + canonical merge** (summary; playbook SSOT `documentation/DOC_TANSTACK_QUERY.md`)
- Changing architecture rules/configs; architecture docs

**Related to:** code-style, testing, security

---

### Testing (`testing/RULE.mdc`)
- **Onboarding guide:** `documentation/DOC_TESTING.md` (runners, colocation, naming, examples)
- Test authority (failing test = claim, not ground truth)
- Local test authority (commit vs merge tiers)
- Test coverage requirements
- Testing patterns
- Test organization
- Quality standards

**Related to:** code-style, architecture

---

### Security (`security/RULE.mdc`)
- Authentication & authorization
- Input validation
- Data protection
- Vulnerability prevention

**Related to:** architecture, code-style

---

### Git workflow (`git-workflow/RULE.mdc`)
- **Branch and release strategy** (SSOT: § Mode behavior table — Model C default, A/B selectable; config: `src/config/git-workflow.json`)
- Branch protection, PR standards (Model A), merge diagnostics
- Stop 2 surface + production per mode (owner's Pass → C: merge the PR; A/B: **Promote to production**)
- Commit/push/PR flow pointers (`loop-ship` for semver/changelog SSOT)

**Related to:** agent-behavior, platform

---

### Agent behavior (`agent-behavior/RULE.mdc`)
- Protected files manifest (single SSOT)
- **When to ask** (SSOT): what counts as a choice + the owner stop list; how to ask
- Success reporting (verified vs unverified)
- Agent role and control

**Related to:** git-workflow, debugging

---

### Platform (`platform/RULE.mdc`)
- **PowerShell/Select-Object piping rules** (prevents IDE crashes)
- Windows command rules, `$LASTEXITCODE` handling
- Environment variable catalog (`VITE_*`, Supabase, Edge secrets)

**Related to:** workflow hub, git-workflow, security

---

### Cloud Functions (`cloud-functions/RULE.mdc`)
- **When to use Edge Functions** vs frontend logic (decision framework)
- Function organization by business capability
- Deployment model and fragility considerations
- Testing strategy and migration paths

**Related to:** architecture, security

---

### Database (`database/RULE.mdc`)
- **SQL migrations only** (`supabase/migrations/`) — not client queries or TanStack
- Safe migration patterns (idempotent, handles fresh/existing databases)
- New-table checklist (RLS, indexes, type generation)
- Layer boundaries (pointers to `architecture/RULE.mdc`, `DOC_TANSTACK_QUERY.md`)
- Testing migrations (fresh database and incremental updates)
- Error handling and logging patterns

**Related to:** security, architecture

---

### API Integration (`api-integration/RULE.mdc`)
- **MCP-first check** before assuming REST/scripts/browser fetch is the only path
- Doc-freshness (don't trust cached/stale docs)
- Cite doc URL(s) or MCP tool(s) actually used
- POC-before-code for new/unfamiliar vendors
- Pointer to `.agents/skills/loop-plan/references/research-api.md` for the full procedure (MCP fallback decision tree, schema→sample discipline, vendor worked examples)
- Absorbs the former workflow rule § Documentation Lookup

**Related to:** security, database, cloud-functions, project-specific

---

### Debugging (`debugging/RULE.mdc`)
- Debugging strategies and logging practices
- Pointers to `debug` and `hypothesis` skills for scientific-method procedure
- Reductive strategy for bugs and new features

**Related to:** testing, architecture

---

### Project-Specific (`project-specific/RULE.mdc`)
- Rate limiting patterns for Edge Functions
- Project-specific security implementations
- Implementation examples and checklists

**Related to:** security, cloud-functions, database

---

### File Placement (`file-placement/RULE.mdc`)
- **Validate file and folder placement before creation** (mandatory pre-creation check)
- Project structure validation using `projectStructure.config.cjs`
- Architecture compliance verification
- Guidance for correct file/folder locations
- **Feature-local README (Option 1):** SSOT `documentation/DOC_FEATURE_LOCAL_README.md`; `pnpm validate:feature-docs` / `validate:feature-docs:strict` / `validate:feature-docs:staged`
- **Feature size / granularity:** SSOT `featureBudgets.config.cjs`; `pnpm validate:feature-size` / `validate:feature-size:staged`; see `.cursor/rules/architecture/RULE.mdc` § Feature granularity

**Related to:** architecture

---

## Consistency Check Matrix

When modifying a rule, check these related rules:

| Rule | Check These Rules |
|------|-------------------|
| `code-style` | architecture, testing |
| `architecture` | code-style, testing, security, cloud-functions, database |
| `testing` | code-style, architecture, debugging |
| `security` | architecture, code-style, cloud-functions, database, project-specific, api-integration |
| `workflow` | All rules (hub), git-workflow, agent-behavior, platform, api-integration |
| `git-workflow` | agent-behavior, platform, cloud-functions, testing |
| `agent-behavior` | git-workflow, debugging, loop-ship + loop-verdict skills |
| `platform` | git-workflow, security |
| `cloud-functions` | architecture, security, project-specific |
| `database` | security, architecture |
| `api-integration` | security, database, cloud-functions, project-specific |
| `debugging` | testing, architecture |
| `project-specific` | security, cloud-functions, database |
| `file-placement` | architecture |

## Adding a New Rule

1. Create folder: `rules/[category]/` (e.g. `rules/my-category/`)
2. Create `RULE.mdc` following the template in an existing rule
3. Add "Related Rules" section at the bottom
4. Update this INDEX.md
5. Update related rules to reference the new rule


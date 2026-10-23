# Router tiebreaks (pairwise disambiguation)

On-demand companion to [`../SKILL.md`](../SKILL.md). Read when two or more skills outside the loop seem to apply. Loop stages need no tiebreak: [`loop-map.md`](loop-map.md) fixes their order. Choose by **primary outcome** (what must be true when done).

### `challenge` vs `optimize2`

- **`challenge`:** Question whether the **feature or workflow** should exist or be simpler (remove/merge steps).
- **`optimize2`:** Improve existing code **without** necessarily changing product scope.

### `debug` vs `hypothesis`

- **`debug`:** Default for runtime incidents — event chains, user-supplied evidence, iterative narrowing (`.agents/skills/debug/SKILL.md`).
- **`hypothesis`:** Pre-registered root-cause experiment when naive fixes already failed or the user invokes hypothesis mode (`.agents/skills/hypothesis/SKILL.md`).
- **Tiebreak:** User asks for hypothesis / repeated failed fixes → `hypothesis`; otherwise → `debug`. Cross-link both skills; do not run both as equal primaries in one pass.

### `debug` vs `learn`

- **`debug`:** Active incident; hypotheses; runtime evidence; possibly temporary instrumentation.
- **`learn`:** Capture durable rule/skill/debug-pattern updates. **Proactive** learn waits until the struggle is resolved (not as primary beside active `debug`). **Manual** `/learn` (user invoked or skill attached) runs **in that turn**, including on a still-red CI/incident message — do not defer behind the fix. Procedure: `.agents/skills/learn/SKILL.md` § Turn contract.

### `rule-quality` vs `learn`

- **`rule-quality`:** Score (Mode A) or rewrite (Mode B) **provided rule/command text**.
- **`learn`:** Decide **where** lessons live (rules vs skills vs debug appendix) from incident context.

### `align-harness` vs `update-harness` vs `learn`

- **`align-harness`:** In-repo harness coherence (skills + rules + AGENTS + INDEX + layers).
- **`update-harness`:** External drops in `.agents/harness-inbox/` — disposition report + confirmed apply.
- **`learn`:** Session lesson from a mistake; removal-first; structural conflicts → `align-harness`.

### `align-harness` vs `rule-quality`

- **`align-harness`:** **Harness-wide** audit — separation of concerns, SSOT, conflicts, handoffs — via parallel lens subagents and a no-information-loss gate. Edits harness corpus + router/layers spine.
- **`rule-quality`:** One **rule/command file's** grade or prose. Duplication in **`src/` application code** is `loop-plan/references/deepen-modules.md`, not a harness audit.
- **`tighten-harness`:** Context **cost** — cut, merge, relocate, or enforce instructions with a per-cut ledger; behavior must not change. Contradictions it finds → `align-harness`.

### `rule-quality` vs the component lens

- **`rule-quality`:** Grade or improve **rules/commands** (rubric + quality standards).
- **Component lens** (`loop-check/references/component-lens.md`): score **React/shadcn-ui components** with the component rubric.


### `canvas` vs the check summary

- **`canvas`:** Standalone **visual artifact** (tables, timelines, rich layouts) as deliverable.
- **`loop-check`:** Structured **text report** (check summary) of a lap.

### External API research: `loop-plan` research vs stack plugin skills

- **[`loop-plan/references/research-api.md`](../../loop-plan/references/research-api.md):** Use for an **unfamiliar/new** vendor or API — MCP-first check, then Phase 1 schema/contract → Phase 2 sample/wire-shape discipline (the same two-phase order the retired `airtable-inspect` skill used, now generalized). Worked example: Supabase (MCP path).
- **Stack plugin skill** (`supabase`, `cloudflare`, `wrangler`, etc.): Use for **operating inside a stack you're already on** — see the Supabase/Cloudflare disambiguations below. Don't route routine stack work through the research reference.
- **A fork's own vendor-specific skill** (if one exists, e.g. a fork-added `stripe-inspect`): prefer it when it's more specific than the generic research path — don't force every integration through one skill.
- See also `.cursor/rules/api-integration/RULE.mdc` for the globs-scoped principles this skill implements (`alwaysApply: false`).

### Supabase: `supabase` vs `supabase-postgres-best-practices` vs API research

- **`supabase`:** Product workflows, Auth, RLS correctness, CLI/MCP, migrations narrative — operating inside this fork's already-configured backend.
- **`supabase-postgres-best-practices`:** **Performance** tuning, query plans, indexing, pooling — narrow DB optimization.
- **API research** (`research-api.md`): only if researching Supabase itself as an unfamiliar vendor (rare in this repo, since it's already configured) — see § External API research above.

### Cloudflare: `cloudflare` vs `wrangler` vs `workers-best-practices`

- **`cloudflare`:** Pick **product** (Workers vs Pages vs DO vs R2…).
- **`wrangler`:** **CLI** syntax and deploy/dev workflow.
- **`workers-best-practices`:** **Code/config review** against current Workers guidance.

### Cloudflare agents: `agents-sdk` vs `building-ai-agent-on-cloudflare`

- **`agents-sdk`:** Reference-led SDK usage (state, RPC, docs fetch).
- **`building-ai-agent-on-cloudflare`:** End-to-end **generated** agent app and deployment narrative.

### `building-mcp-server-on-cloudflare` vs `agents-sdk` (MCP sections)

- **`building-mcp-server-on-cloudflare`:** **Expose** tools as remote MCP with OAuth/deploy.
- **`agents-sdk`:** **Consume** or embed MCP patterns inside Agents SDK — use when agent wiring dominates.

### `web-perf` vs `optimize2` vs `react-perf-vite`

- **`web-perf`:** **Browser-measured** performance (CWVs, network, traces via DevTools MCP).
- **`optimize2`:** **Code-level** structure and complexity optimization (may include perf but not Lighthouse-centric); Rule of Three for extractions.
- **`react-perf-vite`:** **Pattern lookup** for stack-native React perf (lazy routes, TanStack dedup, re-render rules) — read `rules/` on demand; does not replace hotspot refactor.

**Order when multiple apply:** measure with **`web-perf`** if symptoms are CWV/Lighthouse → structural fix with **`optimize2`** → cite specific **`react-perf-vite`** rules while implementing.


### `dont-reinvent-the-wheel` vs precedent review vs API research

- **`dont-reinvent-the-wheel`:** Should we **depend on a package** or **model a verified public implementation** instead of writing custom code for a generic subsystem? Live search; stops at a recommendation.
- **Precedent review** (`loop-plan/references/review-precedent.md`): does this **design** match **external industry / product precedent** for the capability?
- **API research** (`loop-plan/references/research-api.md`): how do we **research this vendor’s contract** (MCP → schema → sample) once we are integrating an API?

**Order when both apply:** **`dont-reinvent-the-wheel` first** (may pick an SDK and skip raw API work). If still integrating a vendor API → API research. Then precedent review on the chosen approach (material design). A new package is an owner stop (`agent-behavior` § When to ask).

**Tiebreak:** User asks “which library / don’t build this ourselves” → **`dont-reinvent-the-wheel`**. “Is this how products usually do it?” → precedent review. “How does this vendor’s API work?” → API research.


### Precedent review vs `layer-consistency-check`

- **Precedent review:** does this design match **external industry / product precedent** for the capability?
- **`layer-consistency-check`:** Does this request fit the **internal** layer beneath it (abstraction hierarchy, architecture, physics/math) — or are we about to ship a workaround?

**Order when both apply:** **`layer-consistency-check` first** (one-beat check). If the structural path changes UX/API contracts, run precedent review before building.


### `create-skill` vs `align-harness` vs `rule-quality`

- **`create-skill`:** One new/refined `.agents/skills/<name>/SKILL.md` (this repo).
- **`align-harness`:** Whole-corpus coherence audit.
- **`rule-quality`:** Grade/rewrite one **rule/command** file (not skill authoring).

### `standards-align` vs precedent review vs `challenge`

- **Precedent review:** proactive **evaluation** of a plan or proposal vs industry — verdict + Pattern risk options. Does **not** own the full “should we realign this existing scope + how to simplify toward standards” loop.
- **`standards-align`:** On-demand loop for an **existing** product/feature/component: **should we align?** → gap score → how A/B/C → hand off. Reuses `loop-plan/references/precedent-rubric.md`; does not replace proactive plan gates.
- **`challenge`:** Simplify **one** named feature/workflow (fewer steps/code) when the question is overbuilt — not primarily “vs market.”

**Tiebreak:** User asks should/how **align with industry** on existing scope → **`standards-align`**. Novel plan/proposal gate → precedent review. “This flow is overbuilt” without industry framing → **`challenge`**.


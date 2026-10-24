# Onboarding (first laps on a fresh fork or the template)

Read by [`loop-backlog`](../SKILL.md) when the top task is one of the four seeded onboarding tasks (Supabase, Hosting, App vision, Theme), or when the owner asks for first-time setup. Ported from `start` (v0.42.0). The gates below run **in order** before the first product lap: each gate states what must be true, why, how the agent verifies it, and who acts. A prerequisite the agent can check is checked; an action only the owner can take (an account, a vendor settings page) is named as a requirement and the agent waits for confirmation, then verifies the result.

## Core behavior

- Be careful, explicit, and beginner-friendly.
- Follow the Quick Start flow from `README.md` in order.
- The **seeded backlog tasks** (`src/config/app-tasks.json`, UI at `/tasks` via DevTasksFab in local dev) are the onboarding checklist; `loop-backlog` ranks them first because everything else depends on them (skill-loop D41).
- Validate every step before proceeding.
- Never claim setup is complete without user confirmation and successful verification checks.
- **Requirements, not methods (owner decision).** For anything in an external app (GitHub, Supabase, Cloudflare, Google Cloud, an OS, an editor) state the end state needed, why, and how the agent will check it. Do not write click paths, menu names, or CLI flags from memory: vendors change them with every release. If the owner asks how, look up the vendor's current documentation (connector or MCP first, per `.claude/rules/api-integration.md`) and point to that page. The owner takes the action; wait for confirmation, then verify. Commands and docs of this repo may be cited as written. Always pair a requirement the owner must act on with the direct link to its settings page (`.claude/rules/agent-behavior.md` § Handing an action to the owner).

## Template repo vs fork (read first)

**Working on this plate-harness template** (improving the harness itself — not building an app from a fork):

- **Skip Supabase (task #1)** and **Cloudflare hosting (task #2)**. No project, no Workers Builds link, no `.env` required for most template work. The app runs locally without auth configured.
- **App vision (task #3):** may stay **`DRAFT`** while exploring or contributing to the template; do not block template PRs on it unless the change is product-facing.
- **Still do:** prerequisites, branch workflow (SSOT: `src/config/git-workflow.json` + `.claude/rules/git-workflow.md` § Mode-aware branch gate), `pnpm dev`, and the verification checklist (§ Mandatory verification checklist).

**Working on a fork** (someone cloned this to build their own app): full backlog applies — Supabase, hosting, vision **`ACTIVE`**, etc.

When the user says they are on the **template** (or context is clearly harness maintenance), default to the skip list above. Only walk Supabase/Cloudflare gates when they are onboarding a fork or explicitly ask to wire up services.

## Dev task backlog (onboarding SSOT)

Fresh clones ship four pre-seeded tasks in priority order:

1. Configure Supabase
2. Put your app online (Cloudflare hosting)
3. Define app vision (`documentation/DOC_APP_VISION.md`)
4. Configure Theme

**Agent task sync (`loop-backlog` + `loop-verdict`):**

- At session start: read `src/config/app-tasks.json`; set relevant task `in-progress` when picking up onboarding work.
- After completing a step: archive completed tasks (move to `app-tasks-archive.json`) or update descriptions (e.g. note Theme skipped).
- Checks: Supabase env vars present; hosting configured per README; vision doc `ACTIVE`; optional theme as applicable.
- **Conflict:** `/tasks` UI disk-wins — reconcile with user edits; do not fight pending UI state.

Configuration is via `.env`, README, and docs — there is no in-app setup wizard.

## Flow (README-aligned)

### 1) Prerequisites gate

Run these commands first and inspect output:

```bash
node -v
pnpm -v
git --version
```

Required versions:

- Node.js 22+
- pnpm 9.15.4+
- Git

If versions are missing/too low:

- Stop and do not continue setup
- Name each missing tool and its minimum version; the owner installs or upgrades it
- Re-run the version-check commands until all pass

Only continue when all three checks pass.

### 2) App vision & goals gate (mandatory before fork/clone and setup)

**Template repo:** skip this gate unless the user is preparing a fork or the work changes user-facing product behavior. Record in chat that vision can stay **`DRAFT`** for template-only work.

**Fork / app onboarding:** This fork's **product SSOT** is `documentation/DOC_APP_VISION.md` (problem statement, user persona, app's role).

- Read that file **now**.
- If the vision line still shows **`DRAFT`** (per the status callout at the top), **stop forward progress** on onboarding until task #3 (Define app vision) is addressed: walk the user through filling each section in their own words. Use the placeholders only as prompts; they must be **replaced** with real prose, then set the status token to **`ACTIVE`** on that same line.
- **Do not** continue to **Fork + clone** (next gate) until either:
  - the vision status is **`ACTIVE`**, or
  - the user **explicitly** instructs you to defer (e.g. exploring the repo only) — in that case, record in chat that feature/plan work should run this vision gate or fill `DOC_APP_VISION.md` before product decisions.

Optional: open `documentation/DOC_APP_VISION.md` in the editor for the user when the environment supports it.

### 3) Line endings gate (mandatory on Windows too)

Requirement: files are written and committed with LF endings (CRLF breaks the validators and creates noisy diffs).

- Git: verify `git config core.autocrlf` prints `false`; if not, ask before changing it.
- Editor: the owner confirms it writes LF for this project (the agent cannot read editor settings).

### 4) Fork + clone gate

Requirement: the owner has their own copy of the repo on GitHub (a fork or a copy from the template; README Option B), cloned locally, with dependencies installed.

- Verify: `git remote -v` shows the owner's repo as `origin`; `pnpm install` completes.
- Creating the GitHub copy is the owner's action; wait for confirmation, then verify.

### 5) Branch workflow gate

**Prerequisites:** GitHub CLI `gh` installed and authenticated (`gh auth login`) — the Claude Code desktop PR monitor and auto-merge need it.

**Template repo (harness maintenance):** **`model-c`**.

**Fork:** ask once:

> Claude Code defaults — PR to `main`, merge = production (Model C, default), feature branches → `develop` (Model A), or direct `develop` (Model B)?

Write `src/config/git-workflow.json` accordingly (`"mode": "model-c"` | `"model-a"` | `"model-b"`). Then walk `.claude/rules/git-workflow.md` § Mode behavior table → **fork setup**, **`main` ruleset**, **`develop` ruleset** for the chosen column. Behavior SSOT is that table — do not restate it here.

**Model C:** no `develop`. Configure the `main` ruleset (table row), repo settings (squash-only with PR title as commit message, auto-delete head branches, **allow auto-merge**), Cloudflare production branch `main` with previews on all branches, and **no `NODE_VERSION` build variable** on either the Production or the Previews tab — it overrides `.node-version` and the `preinstall` guard then fails the build, release-please's branch included (`documentation/DOC_CLOUDFLARE_WORKERS.md` § build variables). The baseline release needs no setup: the `bootstrap` job in `.github/workflows/release-please.yml` creates it on the first push to `main`. **Ruleset confirmation gate (C — required):** confirm the live `main` ruleset via `gh api repos/OWNER/REPO/rules/branches/main` (`pull_request` + required `test` and `pr-title` present) before the first merge.

**Model A / B:** create `develop` from `main` once (`git push origin main:develop`).

- **Model A:** `git switch develop && git pull origin develop`, then `git switch -c feature/<name>`.
- **Model B:** `git switch develop && git pull origin develop`; do **not** create `feature/*` for daily work. **Ruleset confirmation gate (B — required):** confirm the live `develop` ruleset matches the table (user confirmation or `gh api repos/OWNER/REPO/rules/branches/develop`): `pull_request` **absent**; `required_status_checks` (`test`) present; `non_fast_forward` + `deletion` present. Do not proceed on click-path instructions alone.
- **First-promotion bootstrap (A/B):** once the promote workflow file exists on `develop`, `main` is fast-forwarded once — **the user runs** the command in `.claude/rules/git-workflow.md` § Promote to production § First promotion bootstrap (agents are blocked from writing to `main`). Use **Promote to production** thereafter.

The settings that table lists (rulesets, squash-only merges, auto-merge, branch deletion) are requirements. The owner applies them in GitHub; the agent verifies with `gh api` where it can and otherwise asks for confirmation.

### 6) Dev server gate

Run:

```bash
pnpm dev
```

Confirm app is reachable at the shown localhost URL. In dev, open `/tasks` via the floating action button to see the onboarding checklist.

### 7) Configuration tasks gate (work through backlog)

**Template repo:** skip tasks #1 (Supabase) and #2 (Cloudflare) unless explicitly testing those paths. Archive or leave them `to-do`; do not treat missing `.env` as a failure.

**Fork onboarding:** walk through backlog tasks in order (skip or archive optional items the user declines):

**Supabase (task #1) — what must be true:**

| Requirement | Why | Verify | Who acts |
|---|---|---|---|
| A Supabase project (one is enough until the app has real users; then isolate staging with a Branching staging branch or a second project) | Until isolated, local and previews share the live database (`documentation/DOC_CLOUDFLARE_WORKERS.md` § Staging backend) | Owner confirms it exists; the project URL answers | Owner |
| Per project or branch, the URL and the publishable (anon) key | The app reads them at build time | Names only, never values: `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (README names the legacy alias) | Owner supplies values; agent writes `.env` if asked |
| Local `.env` points at the project; once staging is isolated, at staging, never at production | Once there are real users, local work must not write their data | Same check; production keys appear only in the hosting build variables | Owner |
| Only publishable values in any `VITE_*` variable | These are compiled into the public bundle (`.claude/rules/security.md` § Secrets) | Scan `.env` and docs for secret-shaped names | Agent |
| The auth providers the app uses are enabled in each project or branch | Sign-in works | `pnpm dev` (restart after `.env` changes), `/login` renders and a sign-in completes | Owner enables; agent verifies |
| Each project's (or branch's) allowed redirect/site URLs include the origins that use it: local dev, previews, and the production origin | Auth and OAuth links must return to the right origin | A sign-in round trip works locally and on a preview | Owner |
| Google sign-in, if used | Provider and origin settings span Supabase and Google Cloud | `documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` is the SSOT for the requirements | Owner |
| Each project's schema equals `supabase/migrations/` | Parity; no dashboard-only changes (`.claude/rules/database.md` § Environments and migrations) | Migration list from the connector or CLI once migrations exist; n/a before the first migration | Agent applies per that section |

**Hosting (task #2 — Put your app online) — what must be true:**

| Requirement | Why | Verify | Who acts |
|---|---|---|---|
| A Cloudflare account, and a Worker whose name equals `name` in `wrangler.jsonc` | Workers Builds fails when the names differ | Compare `wrangler.jsonc` with the Worker list (Cloudflare connector, or the owner reads it off) | Owner creates or connects; agent aligns `wrangler.jsonc` |
| The repo is connected to Workers Builds; production branch `main`; non-production branch builds on for all branches | Per-PR previews are the Stop 2 surface | A PR gets the Cloudflare bot comment with a preview URL | Owner |
| Build variables: `VITE_SUPABASE_*` set for `main` and for non-production branches (the same values until staging is isolated, then production vs staging values); no `NODE_VERSION` variable | Previews must reach the right backend; `.node-version` must pick Node | Preview build log shows Node from `.node-version`; the preview signs in | Owner sets; agent verifies |
| Optional custom domain, `account_id` | Fork-specific; the template omits them | `routes` / `account_id` in `wrangler.jsonc` when the owner wants them | Owner decides; agent edits |

The agent's playbook (build settings, troubleshooting) is the **Agent one-shot brief** in `documentation/DOC_CLOUDFLARE_WORKERS.md`; the task description in `src/config/app-tasks.json` is the plain-language summary.

**App vision (task #3):** Collaborate on `DOC_APP_VISION.md`; set status to **`ACTIVE`**.

**Theme (task #4):** Customize the design tokens in `src/index.css` or skip if defaults suffice.

Update `app-tasks.json` as each step completes.

### 8) Route verification gate

Verify routes from README:

- `/`
- `/tasks` (dev only, via FAB)
- `/login` (when Supabase configured)

If a route fails, troubleshoot before continuing.

### 9) Physical device testing (optional)

If the user needs mobile layout or mobile OAuth on local dev, link **`documentation/DOC_MOBILE_LOCAL_DEV.md`** (SSOT). Do not duplicate adb or redirect steps here.

## Mandatory verification checklist ("test for everything")

Run and verify all relevant checks:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm validate:structure
pnpm test:classify
pnpm test:run
pnpm build
```

Optional during development: `pnpm test:staged` after `git add` to preview pre-commit test selection.

**How to write tests:** `documentation/DOC_TESTING.md` (runners, colocation, naming, `tests/test-utils`).

If any check fails:

- Stop and fix in smallest safe steps
- Re-run failed check(s)
- Re-run full checklist before final confirmation

## Communication rules during onboarding

- Use short steps and numbered instructions.
- After each gate that needs a manual action from the user (dashboard, account, browser), wait for their confirmation; gates the agent can verify itself (commands, files) need no question.
- For any action only the owner can take (a vendor website, an account, a browser prompt), say:
  - what must be true afterwards
  - why it matters
  - how the agent will check it
  - then wait for confirmation and run that check
- Do not skip gates even if user is experienced, unless user explicitly asks to skip **or** context is **template repo** work (see § Template repo vs fork).

## Completion criteria

Only consider onboarding complete when:

**Template repo:** verification checklist passes and user confirms they are ready — Supabase/Cloudflare/vision **`ACTIVE`** not required.

**Fork / app onboarding:**

1. **`documentation/DOC_APP_VISION.md`** is **`ACTIVE`** (or user explicitly deferred with reason recorded)
2. User confirms configuration tasks they wanted are done (backlog archived or updated)
3. Route checks pass
4. Verification checklist passes
5. User confirms they are ready to proceed

---


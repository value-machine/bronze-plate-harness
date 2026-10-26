# Onboarding (first laps on a fresh fork or the template)

Read by [`loop-backlog`](../SKILL.md) when the top task is one of the four seeded onboarding tasks (Supabase, Hosting, App vision, Theme), or when the owner asks for first-time setup ("set up my app", "get me started", "onboard me"). Ported from `start` (v0.42.0). The gates below run **in order** before the first product lap: each gate states what must be true, why, how the agent verifies it, and who acts. A prerequisite the agent can check is checked; an action only the owner can take (an account, a vendor settings page) is named as a requirement and the agent waits for confirmation, then verifies the result.

## Core behavior

- Be careful, explicit, and beginner-friendly. Assume the owner may be new to GitHub and coding agents: the first time a term appears (fork, pull request, connector, preview), explain it in a few plain words.
- Follow the Quick Start flow from `README.md` in order.
- The **seeded backlog tasks** (`src/config/app-tasks.json`, UI at `/tasks` via DevTasksFab in local dev) are the onboarding checklist; `loop-backlog` ranks them first because everything else depends on them (skill-loop D41).
- Validate every step before proceeding.
- Never claim setup is complete without user confirmation and successful verification checks.
- **Requirements, not methods (owner decision).** For anything in an external app (GitHub, Supabase, Cloudflare, Google Cloud, an OS, an editor) state the end state needed, why, and how the agent will check it. Do not write click paths, menu names, or CLI flags from memory: vendors change them with every release. If the owner asks how, look up the vendor's current documentation (connector or MCP first, per `.claude/rules/api-integration.md`) and point to that page. The owner takes the action; wait for confirmation, then verify. Commands and docs of this repo may be cited as written. Always pair a requirement the owner must act on with the direct link to its settings page (`.claude/rules/agent-behavior.md` § Handing an action to the owner).
- **The agent finds the link; this file does not store it.** Links to vendor pages are looked up at the moment they are needed (for the surface the owner uses, from the platform's or vendor's current docs), checked to load, and then handed over. Never copy a deep link from memory or from an old chat.

## Template repo vs fork (read first)

**Working on this plate-harness template** (improving the harness itself — not building an app from a fork):

- **Skip Supabase (task #1)** and **Cloudflare hosting (task #2)**. No project, no Workers Builds link, no `.env` required for most template work. The app runs locally without auth configured.
- **App vision (task #3):** may stay **`DRAFT`** while exploring or contributing to the template; do not block template PRs on it unless the change is product-facing. Never replace the template's placeholder text in `DOC_APP_VISION.md` or the seeded tasks in `app-tasks.json`: forks start from them.
- **Connect tools:** only what the template work needs (usually GitHub access).
- **Still do:** prerequisites, branch workflow (SSOT: `src/config/git-workflow.json` + `.claude/rules/git-workflow.md` § Mode-aware branch gate), `pnpm dev`, and the verification checklist (§ Mandatory verification checklist).

**Working on a fork** (someone cloned this to build their own app): full backlog applies — tools connected, Supabase, hosting, vision **`ACTIVE`**, etc.

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

**Opening message.** Before the first gate, tell the owner in three or four short lines what is about to happen: their own copy of the repo, connecting the tools the agent works through, a few questions about their app, then the services. Say that the agent does what it can itself and only hands over what needs their account.

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

### 2) Fork + clone gate

Requirement: the owner has their own copy of the repo on GitHub (a fork or a copy from the template; README Option B), cloned locally, with dependencies installed.

- Verify: `git remote -v` shows the owner's repo as `origin`; `pnpm install` completes.
- Creating the GitHub copy is the owner's action; wait for confirmation, then verify.
- If `origin` still points at the template, the owner has a clone, not a copy: say what that means in one line (their changes would have nowhere to go), hand over the link to create their own copy of this repo, and once they give its URL, point `origin` at it.

### 3) App vision & goals gate

**Template repo:** skip this gate unless the user is preparing a fork or the work changes user-facing product behavior. Record in chat that vision can stay **`DRAFT`** for template-only work.

**Fork / app onboarding:** This fork's **product SSOT** is `documentation/DOC_APP_VISION.md` (problem statement, user persona, app's role). It comes early because every later choice (which sign-in providers, which data, how the app looks) reads from it.

- Read that file **now**. If the status line shows **`ACTIVE`**, continue to the next gate.
- If it shows **`DRAFT`**, run a short **vision interview**. Say why first, in one line: agents read this page before every product decision, so a few minutes now saves guessing later.
  - Ask **one question at a time**, in plain words, and wait for each answer. Short or rough answers are fine.
  - Cover, in this order: **the problem** (who has it, what they do about it today), **the main user** (who they are, what slows them down, what a good day looks like), **what the app does and does not do** (one sentence each, plus anything it connects to), and optionally **how they will know it works** (one or two goals).
  - Follow up only where an answer is too vague to write a sentence from; at most one follow-up per question.
- Then draft the sections from the answers, in the owner's own words, and show the draft. Don't add product ideas the owner did not give; anything they were unsure about goes under **Optional: open questions**. Remove the placeholder lines and unused optional sections.
- After the owner confirms (or edits) the draft, write it and change the status token to **`ACTIVE`** on that same line.
- **Do not** continue to the service gates until either:
  - the vision status is **`ACTIVE`**, or
  - the user **explicitly** instructs you to defer (e.g. exploring the repo only) — in that case, record in chat that feature/plan work should run this vision gate or fill `DOC_APP_VISION.md` before product decisions.

Optional: open `documentation/DOC_APP_VISION.md` in the editor for the user when the environment supports it.

### 4) Line endings gate (mandatory on Windows too)

Requirement: files are written and committed with LF endings (CRLF breaks the validators and creates noisy diffs).

- Git: verify `git config core.autocrlf` prints `false`, or prints nothing on macOS/Linux (unset means no conversion there); if it prints `true` or `input`, or nothing on Windows, ask before changing it.
- Editor: the owner confirms it writes LF for this project (the agent cannot read editor settings).

### 5) Connect tools gate

The agent sets up most of this repo itself, through connections to the services it uses. Without them, the owner has to copy values between dashboards by hand. This gate connects them once, up front.

| Requirement | Lets the agent | Verify | Who acts |
|---|---|---|---|
| The agent can reach the owner's GitHub repo (sign-in or app access, whichever the owner's coding surface uses) | push branches, open pull requests, read CI and the branch rules (branch workflow gate) | a dry-run push to `origin` succeeds and a read of the repo's branch rules answers | Owner grants access; agent verifies |
| A Supabase connector, signed in to the owner's Supabase account (the repo ships one in `.mcp.json`) | create or find the project, read keys and auth settings, check migrations and logs | a call that lists the owner's Supabase projects or organizations answers | Owner signs in; agent sets `project_ref` in `.mcp.json` once the project exists (Supabase task) |
| A Cloudflare connector, signed in to the owner's Cloudflare account | read the Worker, its builds and the account's workers.dev subdomain (hosting task) | a call that lists the account's Workers answers | Owner signs in; agent verifies |

- **Check first, ask second.** List the tools the agent already has and make one test call per row; skip every row that already works.
- **For each missing row:** say in one line what it lets the agent do for them, then give the link where the owner connects it, found for their coding surface (Claude Code in a terminal or desktop, claude.ai on the web, Cursor) per § Core behavior. Wait, then run the row's check.
- `.mcp.json` ships the Supabase connector read-only (`read_only=true`). Reading is all onboarding needs; letting the agent apply migrations through it is a **data change** for the owner to decide (`.claude/rules/agent-behavior.md` § When to ask).
- The owner may decline a connector. Then the matching task runs its manual path (the owner reads values off the dashboard); record which rows were declined in chat.

### 6) Branch workflow gate

**Prerequisites:** GitHub CLI `gh` installed and authenticated (`gh auth login`) — the Claude Code desktop PR monitor and auto-merge need it. Where `gh` is not available (for example, a cloud session with a GitHub connector), the connector from § Connect tools gate does the same reads.

**Template repo (harness maintenance):** **`model-c`**.

**Fork:** ask once, in plain words, with the recommended option first:

> How should finished changes reach your live app?
> - **Through a pull request, one per change (recommended)** — each change gets its own preview link to try; merging it puts it live. (Model C)
> - **Through a shared test branch** — changes collect on a `develop` branch you can try as a whole, then you release them together. (Model A)
> - **Straight to the test branch, no pull requests** — fastest, but nothing checks a change before it lands. (Model B)

Write `src/config/git-workflow.json` accordingly (`"mode": "model-c"` | `"model-a"` | `"model-b"`). Then walk `.claude/rules/git-workflow.md` § Mode behavior table → **fork setup**, **`main` ruleset**, **`develop` ruleset** for the chosen column. Behavior SSOT is that table — do not restate it here.

**Model C:** no `develop`. Configure the `main` ruleset (table row), repo settings (squash-only with PR title as commit message, auto-delete head branches, **allow auto-merge**), Cloudflare production branch `main` with previews on all branches, and **no `NODE_VERSION` build variable** on either the Production or the Previews tab — it overrides `.node-version` and the `preinstall` guard then fails the build, release-please's branch included (`documentation/DOC_CLOUDFLARE_WORKERS.md` § build variables). The baseline release needs no setup: the `bootstrap` job in `.github/workflows/release-please.yml` creates it on the first push to `main`. **Ruleset confirmation gate (C — required):** confirm the live `main` ruleset via `gh api repos/OWNER/REPO/rules/branches/main` (`pull_request` + required `test` and `pr-title` present) before the first merge.

**Model A / B:** create `develop` from `main` once (`git push origin main:develop`).

- **Model A:** `git switch develop && git pull origin develop`, then `git switch -c feature/<name>`.
- **Model B:** `git switch develop && git pull origin develop`; do **not** create `feature/*` for daily work. **Ruleset confirmation gate (B — required):** confirm the live `develop` ruleset matches the table (user confirmation or `gh api repos/OWNER/REPO/rules/branches/develop`): `pull_request` **absent**; `required_status_checks` (`test`) present; `non_fast_forward` + `deletion` present. Do not proceed on click-path instructions alone.
- **First-promotion bootstrap (A/B):** once the promote workflow file exists on `develop`, `main` is fast-forwarded once — **the user runs** the command in `.claude/rules/git-workflow.md` § Promote to production § First promotion bootstrap (agents are blocked from writing to `main`). Use **Promote to production** thereafter.

The settings that table lists (rulesets, squash-only merges, auto-merge, branch deletion) are requirements. The owner applies them in GitHub; the agent verifies with `gh api` where it can and otherwise asks for confirmation. Hand them over as one list with the link to the repo's settings page, not one at a time.

### 7) Dev server gate

Run:

```bash
pnpm dev
```

Confirm app is reachable at the shown localhost URL. In dev, open `/tasks` via the floating action button to see the onboarding checklist.

### 8) Configuration tasks gate (work through backlog)

**Template repo:** skip tasks #1 (Supabase) and #2 (Cloudflare) unless explicitly testing those paths. Archive or leave them `to-do`; do not treat missing `.env` as a failure.

**Fork onboarding:** walk through backlog tasks in order (skip or archive optional items the user declines). Where § Connect tools gate connected a service, the agent does the reads and checks below through it and asks the owner only for what needs their account:

**Supabase (task #1) — what must be true:**

| Requirement | Why | Verify | Who acts |
|---|---|---|---|
| A Supabase project (one is enough until the app has real users; then isolate staging with a Branching staging branch or a second project) | Until isolated, local and previews share the live database (`documentation/DOC_CLOUDFLARE_WORKERS.md` § Staging backend) | Owner confirms it exists; the project URL answers | Owner |
| Per project or branch, the URL and the publishable (anon) key | The app reads them at build time | Names only, never values: `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (README names the legacy alias) | Owner supplies values; agent writes `.env` if asked |
| Local `.env` points at the project; once staging is isolated, at staging, never at production | Once there are real users, local work must not write their data | Same check; production keys appear only in the hosting build variables | Owner |
| Only publishable values in any `VITE_*` variable | These are compiled into the public bundle (`.claude/rules/security.md` § Secrets) | Scan `.env` and docs for secret-shaped names | Agent |
| The auth providers the app uses are enabled in each project or branch | Sign-in works | `pnpm dev` (restart after `.env` changes), `/login` renders and a sign-in completes | Owner enables; agent verifies |
| The project's **Site URL** is the app's primary origin (the production host, or the local dev origin until a host exists), not the value Supabase starts with | Auth emails and OAuth fall back to the Site URL, so a wrong one sends users to the wrong place | The project's URL configuration page shows it; a sign-in round trip lands on the right origin | Owner |
| The project's (or branch's) allowed redirect URLs include the origins that use it: local dev, previews (a wildcard pattern), and the production origin | Auth and OAuth links must return to an allowed origin | A sign-in round trip works locally and on a preview | Owner |
| Google sign-in, if used | Switching the provider on in Supabase is not enough: it needs a Google OAuth client (ID and secret) that allows the project's Supabase callback URL | `documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` is the SSOT; the project's public auth settings (`/auth/v1/settings` with the publishable key) list `google` as enabled | Owner creates the client; agent verifies |
| Each project's schema equals `supabase/migrations/` | Parity; no dashboard-only changes (`.claude/rules/database.md` § Environments and migrations) | Migration list from the connector or CLI once migrations exist; n/a before the first migration | Agent applies per that section |

**Hand over exact values (after hosting is connected, or the Worker name and workers.dev subdomain are known).** The owner should only copy and paste, so the agent derives every Supabase URL setting, never asks the owner to work them out, and gives them in one block with the direct link to the project's URL configuration page (`https://supabase.com/dashboard/project/<ref>/auth/url-configuration`):

- Derive the production origin from `wrangler.jsonc` `name` plus the account's workers.dev subdomain (Cloudflare connector, or `documentation/DOC_CLOUDFLARE_WORKERS.md`); a custom domain replaces it. Verify the host answers before handing it over.
- **Site URL:** the production origin.
- **Redirect URLs:** for each of the production origin, the preview pattern `https://*-<worker name>.<subdomain>.workers.dev`, and `http://localhost:5173`, list both the bare origin and its `/**` form.
- **Google, if used:** the Google client's allowed callback is `https://<ref>.supabase.co/auth/v1/callback`, with the link to the Google credentials page the owner acts in (`documentation/DOC_SUPABASE_GOOGLE_OAUTH.md`).
- Verify by reading the project's auth settings with the Supabase connector when it is available. When it is not, offer the owner a ready-to-send message for the Supabase dashboard assistant ("show my Site URL and the full redirect allow-list") and compare the answer with the block above.

Gate: a sign-in that starts on a preview returns to that preview, and one on production stays on production.

**Hosting (task #2 — Put your app online) — what must be true:**

| Requirement | Why | Verify | Who acts |
|---|---|---|---|
| A Cloudflare account, and a Worker whose name equals `name` in `wrangler.jsonc` | Workers Builds fails when the names differ | Compare `wrangler.jsonc` with the Worker list (Cloudflare connector, or the owner reads it off) | Owner creates or connects; agent aligns `wrangler.jsonc` |
| The repo is connected to Workers Builds; production branch `main`; non-production branch builds on for all branches | Per-PR previews are the Stop 2 surface | A PR gets the Cloudflare bot comment with a preview URL | Owner |
| Build variables: `VITE_SUPABASE_*` set once for production builds and once for preview builds (Cloudflare keeps one set per kind, not one per branch; the same values until staging is isolated, then production vs staging values); no `NODE_VERSION` variable | Previews must reach the right backend; `.node-version` must pick Node | Preview build log shows Node from `.node-version`; the preview signs in | Owner sets; agent verifies |
| Optional custom domain, `account_id` | Fork-specific; the template omits them | `routes` / `account_id` in `wrangler.jsonc` when the owner wants them | Owner decides; agent edits |

The agent's playbook (build settings, troubleshooting) is the **Agent one-shot brief** in `documentation/DOC_CLOUDFLARE_WORKERS.md`; the task description in `src/config/app-tasks.json` is the plain-language summary.

**App vision (task #3):** done in § App vision & goals gate; archive the task once the status is **`ACTIVE`**.

**Theme (task #4):** Customize the design tokens in `src/index.css` or skip if defaults suffice. Offer a starting point from the vision (who the users are, the feel they described) rather than asking the owner to pick colors cold.

Update `app-tasks.json` as each step completes.

### 9) Route verification gate

Verify routes from README:

- `/`
- `/tasks` (dev only, via FAB)
- `/login` (when Supabase configured)

If a route fails, troubleshoot before continuing.

### 10) Physical device testing (optional)

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
  - the link to the page where they do it (§ Core behavior)
  - how the agent will check it
  - then wait for confirmation and run that check
- Keep each handover to what the owner needs to act; if they ask where a button is, look it up then rather than writing it in advance.
- Do not skip gates even if user is experienced, unless user explicitly asks to skip **or** context is **template repo** work (see § Template repo vs fork).

## Completion criteria

Only consider onboarding complete when:

**Template repo:** verification checklist passes and user confirms they are ready — Supabase/Cloudflare/vision **`ACTIVE`** not required.

**Fork / app onboarding:**

1. **`documentation/DOC_APP_VISION.md`** is **`ACTIVE`** (or user explicitly deferred with reason recorded)
2. The tools in § Connect tools gate are connected, or the owner declined them (recorded)
3. User confirms configuration tasks they wanted are done (backlog archived or updated)
4. Route checks pass
5. Verification checklist passes
6. User confirms they are ready to proceed

---


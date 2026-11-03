# Push safety, PR and production landing

Used by [`loop-ship`](../SKILL.md). Ported from `push` (v0.42.0). Mode behavior: `git-workflow` rule § Mode behavior table.

## Preconditions (Mandatory)

1. The commit step ([`commit-standards.md`](commit-standards.md)) ran for these changes.
2. Working tree must be clean before push:
   - no unstaged changes
   - no staged but uncommitted changes
   - no untracked files that belong to the intended change set
3. There must be at least one local commit to push.

## Hard Restrictions

- **Never run `git add` in this command.**
- **Never run `git commit` in this command.**
- **Never create, amend, or modify commits in this command.**
- If there are uncommitted changes, go back to the commit step.

## Push Safety Flow

1. Branch/push targets: `.claude/rules/git-workflow.md` § Commit and Push Workflow.
2. Verify clean working tree.
3. Verify commits exist to push.
4. Verify remote freshness before push:
   - Run `git fetch origin`
   - Check whether local branch is behind its remote counterpart
   - If behind, STOP and sync first (rebase or merge) before pushing
5. **App-specific changes**: ensure remote points to app repo, not the plate-harness template repo
6. **Full lint (mandatory):** run `pnpm lint`, the exact CI command. The edit hook and `lint-staged` only lint files the agent edited or staged (`documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Local git). If it fails, fix (protected files still need approval per `.claude/rules/agent-behavior.md`) or stop — do not report the push as done until it passes.
7. Push (`git push -u origin <lap branch>`) — no confirmation question inside the loop (skill-loop D25).

## Merge gate (tests)

- **Pre-push does not run Vitest or type-check** — see `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Local git.
- **Authoritative merge gate:** green CI `test` job where work lands — `.claude/rules/git-workflow.md` § Mode behavior table → **how work lands** (full `pnpm test:classify`, `pnpm test:run`, `pnpm type-check`).
- Local pre-commit may run **related** tests only — related green is **not** sufficient to skip waiting for CI.

## Commit vs push

The push step never stages, commits or amends. If it finds anything uncommitted it goes back to the commit step.

## Production landing (promote)

**Model A/B only.** Under Model C, "land on main / release" means the owner's Pass merges the PR (table → **"land on main / promote / release" means**) — never dispatch promote.

Run by `loop-verdict` on a **Pass** (Model A/B), or when the owner asks to land, promote or release:

1. **Do not** `git push origin main`, open a `develop` → `main` PR, or squash-merge.
2. Run **pre-promote check** and, if needed, **ancestor failure reconcile** — SSOT `.claude/rules/git-workflow.md` § Promote to production.
3. `gh workflow run promote-to-production.yml`; report the run URL; do not `gh run watch`.

If promote already failed with `main is not an ancestor of develop`, reconcile on `develop` per that section before re-running the workflow.



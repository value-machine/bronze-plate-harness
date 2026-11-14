# Brief — ci-cost

**Problem:** forks of this boilerplate burn their GitHub Actions budget fast. Every merge re-runs the full suite on `main` and again on the release PR, release-please bills four jobs, no job has a timeout, the orchestrator pushes every open branch after each merge, and every PR runs the whole Vitest suite (about 60 billed minutes per run in one fork).

**Success check:** a PR runs only the tests related to its changed files; the full suite runs weekly and on a manual run; a merge to `main` starts one release job and no second CI run; every job has a timeout; the orchestrator no longer updates every branch after each merge.

**In scope:** `.github/workflows/*.yml`, `scripts/change-classify.cjs` + `scripts/test-staged.cjs` (`--base`), `loop-orchestrate` step 4, docs and the testing rule that describe CI.

**Out of scope:** dropping the GitHub `build` step in favour of the Cloudflare preview build; Vitest sharding; the `pr-title` run on description edits (ci-cost D2).

**Size:** S.

## Plan

1. `ci.yml`: push trigger `develop` only; weekly `schedule`; timeouts; release PRs → version check only; tests through the classifier with `--base`, full on schedule or manual; issue on a failed weekly run.
2. `release-please.yml`: one job; `promote-to-production.yml`: timeout.
3. Classifier: `getChangedFilesSince(base)`; executor `--base` passes when no related tests exist (tests in `scripts/test-staged.test.cjs`).
4. `loop-orchestrate` step 4; docs (`DOC_AGENT_WORKFLOW_LAYERS` § CI test scope, `DOC_TESTING`, `DOC_CONTRIBUTING`, `DOC_CLOUDFLARE_WORKERS`); `.claude/rules/testing.md` (owner consent given).

# Decisions — ci-cost

Job: `temp_job_ci-cost`
Updated: 2026-11-14

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Job timeouts | closed | `pr-title` 5 min, `test` 30 min (90 on the weekly or manual full run), release 10, promote 10 | owner | A hung job otherwise bills up to GitHub's 6-hour cap |
| D2 | `pr-title` on description edits | closed | Keep running it on every `edited` event | loop-build | constraint: a skipped required check counts as passed, so skipping it when only the description changed would let a bad title pass after a body edit. Rejected: skip unless the title changed (owner had approved; dropped for this reason) |
| D3 | CI on push to `main` | closed | Removed; push CI runs on `develop` only | owner | Model C reaches `main` through a PR that already passed; A/B through promote's fast-forward of a tested `develop`. Neither `main` ruleset requires a push run |
| D4 | Release Please cost | closed | One job instead of four; release PRs run only `validate-version-sync` | owner | Release PRs change only the version, CHANGELOG and manifest. Trade-off: the mode-reading step now runs with the release job's write permissions |
| D5 | Orchestrator branch updates | closed | Update a branch from `main` only when it is next to merge, its thread needs the merged change, or GitHub reports a conflict | owner | Each push re-runs that PR's CI; `main` does not require up-to-date branches. Rejected: update every open branch after each merge |
| D6 | CI test scope | closed | PRs and `develop` pushes run Vitest through the pre-commit classifier on the branch diff (`test-staged.cjs --base`); changed files with no related tests pass; the full suite runs weekly (Mon 03:17 UTC), on a manual run, and when the classifier says full; a failed weekly run opens an issue | owner | Reuses the existing classifier instead of a second rule set. Known risk: a break outside the import graph (fixtures, env, dynamic imports) is found up to a week late, and under Model C every merge already deploys production. Rejected: full suite on every PR (cost grows with the app) |
| D7 | Related-tests command | closed | `vitest related --run <paths>` replaces `vitest run related <paths>` | loop-check | Verdict: code wrong, test followed it. Vitest 4 printed `filter: related, …` and found no tests, so pre-commit "related" always fell back to the full suite; the fixed form ran the 2 matching test files |

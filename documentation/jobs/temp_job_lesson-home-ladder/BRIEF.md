# Brief — Order lesson homes so the harness compounds

Task: Order lesson homes so the harness compounds · Lap: temp_job_lesson-home-ladder · Harness: v0.44.0

## Problem
`meta-learn-lessons` picks a lesson's home from a topic table only, so lessons default to prose in always-on rules or skills (context grows every lap), mechanical lessons are not proven to be enforced, and lessons that improve the harness itself never leave this repo.

## Success check
Given a lesson that a one-entry tightening of an existing check can hold, `meta-learn-lessons` proposes that tightening with proof it fails on the defect shape and adds no prose; given a lesson about one area, it picks an area-scoped home (feature README, path-scoped rule or debug patterns) and not an always-on rule; and its report line states the lesson's scope (`repo` or `harness`).

## Owner test
none — harness skills only; nothing changes in the app.

## In scope
- A cheapest-first **home ladder** in `meta-learn-lessons` (owner: `references/lesson-procedure.md` § 3, heading `### 3. Choose where it lives` kept so `PORT_MAP.md` stays valid; `SKILL.md` step 5 points to it). First tier that holds wins:
  1. **One way** — the mistake was possible because two ways exist → a `Foundation:` backlog task to consolidate (this skill changes no product code).
  2. **Check** — tighten an existing check only: one config entry, pattern or test in a validator, lint rule, structure/arch config, or test suite the repo already runs. Never loosen a check or touch a baseline (`architecture` rule § Changing architecture rules and configs). Proof first: it passes on the current tree and fails on the defect shape in a scratch copy outside the repo (not `git worktree`; never in the working tree). The proof runs before the owner yes/no, so the ask carries it. A new validator script (plus its test) is its own lap → backlog task.
  3. **Area-scoped home** — a fact or contract of one feature → that feature's `README.md`; a constraint on a kind of file across features → an existing path-scoped rule (`paths:`), a new one only with its `AGENTS.md` catalog row, `DOC_RULES_INDEX.md` and `loop-plan/references/rules-registry.md` row (topic table first row); symptom → fix → `spec-debug-runtime/references/patterns.md`. Each is read at a fixed step or loads by path; no new notes store.
  4. **Skill or reference edit** — the lesson is about how a loop stage works; loads only when that stage runs.
  5. **Always-on rule** — last; the edit states why tiers 2–4 can't hold it (every later session pays for the line).
  **Fallback:** when tier 1, or a tier-2 check that is too big or unproven, yields a backlog task, continue down the ladder so the lesson holds meanwhile; the persisted line names the task, and that task removes the line when it lands.
  The existing topic table stays as the per-tier file lookup.
- **Blank-model test gates prose only** (tiers 3–5). A blank-model drop may still take tier 1–2 (a lint-catchable textbook mistake → tighten the check).
- **Narrowing a wrong skill or rule** stays the removal-first path (reverse audit); the ladder applies to what is added.
- **Scope tag** on every persisted lesson: `repo` (true only for this app/repo) or `harness` (would help any fork of this harness). Recorded in the report line and as a `Lessons:` line in the lap's `DOC_DECISION_LOG.md` section (`Lesson-scope: harness — <file § section>`), the section `loop-ship` step 3 writes. Outside a lap: a lesson commit of its own, `docs(harness): lesson — <tl;dr>`, with that line in the body. On Drop: the scope goes into the backlog task text.
- `meta-write-adoption-guide`: optional input for a harness-change guide — if the repo tags lessons, gather `Lesson-scope: harness` lines from `DOC_DECISION_LOG.md` (and lesson commits) since the last commit touching the guide file (`git log <that commit>..HEAD`; all history for a new guide) as **sources**, not guide content.
- Two eval cases under `.agents/skills/meta-learn-lessons/evals/` encoding the success check.

## Out of scope
- Will NOT do: a `docs/solutions/`-style retrievable store — excluded (D1).
- Will NOT do: a SKILL.md byte-budget test or parity markers — deferred.
- Will NOT do: new helpers in `eval-scaffold.sh` — use existing ones.
- Will NOT touch: the reverse audit, the owner-consent flow for lessons (merge-is-pass D3), `loop-verdict`, `loop-ship`, `.claude/rules/**`, onboarding.

## Edges
| Feature area | Loop today | Hook point | Ride / new |
|---|---|---|---|
| `meta-learn-lessons` | verdict Change/Drop or `/learn` → reverse audit → blank-model test → topic table → edit → report | `lesson-procedure.md` § 2b, § 3, § 4, § 5, Anti-patterns; SKILL Edges Out, steps 4–7, Examples, Output | ride — same procedure, ordered homes |
| `meta-write-adoption-guide` | owner asks → procedure → guide in `documentation/handoffs/` | `references/procedure.md` (one optional-input step) | ride |
| `documentation/DOC_DECISION_LOG.md` | `loop-ship` step 3 appends the lap section | `Lessons:` line format (written by lessons, read by guides) | ride |
| `.claude/skills/` mirror | regenerated by `scripts/sync-agent-config.mjs` | run sync | ride |

Overrun rule (skill-loop D51): a diff that touches a feature area **not** in this table stops the lap.

## Foundation signals
- none found in the touched files
- Absorbed: none

## Size
S — two skills, one reference each, two eval cases; no code, no structure change.
Cut into laps: none

## Decisions
DECISIONS.md D1–D5. Plan review: Fable, must-fixes 1–6 applied (A1–A6).

## Plan

Acceptance tests (eval layout of `loop-build/evals/new-dependency-asks-owner/`; front-matter `max_turns: 30`, `timeout_seconds: 900`; existing helpers only — `csv_lap` + `csv_built` from `meta-write-skill/scripts/eval-scaffold.sh`, then append a mistake line to the plan's Notes in `place-files.sh`):
- `mechanical-lesson-becomes-check/` — fixture: the lap made a mistake that current `pnpm lint` and `pnpm arch:check` pass on (verify while building) and that a one-entry tightening of an existing check catches. Graders: (1) proposes tightening that check and asks one yes/no (consent stops it before applying); (2) the fail-on-defect proof was run in a scratch copy (trace shows the command), not merely claimed; (3) no prose line added to `.claude/rules/**` or any `SKILL.md`; (4) report line has `scope repo|harness`.
- `area-lesson-avoids-always-on/` — fixture: a lesson about one feature's contract (e.g. the tasks filter) or one kind of file. Graders: (1) home is the feature README or a path-scoped rule, not an always-on rule; (2) report line has scope.
Red against HEAD by inspection (no ladder, no proof, no scope). Not runnable here (no bubblewrap) → unverified; runnable with `meta-write-skill/scripts/run-evals.sh HEAD --case '<name>'`.

Conflict & compliance: protected `.agents/skills/**` — owner consent in chat (D4). SKILL edits follow `meta-write-skill` conventions (template sections, keep SKILL.md ≤ ~6 KB, ladder detail in the reference). `evals/<case>/` whitelisted. No `src/`, no `.claude/rules/**`.

### Phase 1 — eval cases — Done
- Write both cases; verify the mechanical fixture's defect passes current lint/arch and is caught by the intended one-entry tighten (scratch copy).
- Gate: `pnpm validate:structure`; `pnpm validate:skills`.

### Phase 2 — ladder in `meta-learn-lessons` — Done
- `lesson-procedure.md`: § 3 lead-in → ladder + fallback (above), topic table kept below as the per-tier lookup; § 2b → "gates prose tiers 3–5 only"; § 1b/intro "Mechanical lessons → validators" → point at tier 2; § 4 → proof before ask; § 5 Report → `Scope:` (`scope —` when nothing persisted); Anti-patterns → "an always-on line where tiers 2–4 hold".
- `SKILL.md`: Edges Out row (checks, area homes); step 4 (blank-model gates prose); step 5 → "home by the ladder, § 3"; step 7 + Output line → `scope <repo|harness|—>`; rewrite Example 2 (lint-catchable textbook mistake → tighten the check, no prose).
- Gate: `pnpm validate:skills`; `wc -c` SKILL.md.

### Phase 3 — scope reaches forks — Done
- `lesson-procedure.md` § 4/5: `Lessons:` line in the lap's decision-log section; outside a lap the own lesson commit; on Drop scope in the task text.
- `meta-write-adoption-guide/references/procedure.md`: optional-input step (above); keep "no dependency on meta-learn-lessons" true by wording it as "if the repo tags lessons".
- Gate: `pnpm validate:skills`; `pnpm validate:docs`.

### Phase 4 — sync + gates — Done
- Decision rows are folded by `loop-ship` step 3 (not here).
- `node scripts/sync-agent-config.mjs`; gates `node scripts/sync-agent-config.mjs --check`, `pnpm validate:structure`, `pnpm validate:skills`, `pnpm validate:docs`.

### Notes during development
- Mechanical fixture (verified in a scratch copy of the tracked tree, outside the repo): a feature component importing `@/shared/services/supabaseService` passes `pnpm lint` (0 errors) and `pnpm arch:check` (0 errors, 0 warnings); adding `'@/shared/services'` to the feature-components `no-restricted-imports` group in `eslint.config.js` makes `pnpm lint` fail on it (`no-restricted-imports`, exit 1) and still pass on the clean tree (exit 0). `eslint.config.js` itself is untouched by this lap.
- Debt signal (outside the lap): that hole is real. `eslint.config.js` restricts `@/features/*/services` only, and the dependency-cruiser rules `no-direct-service-in-components` / `no-direct-service-in-feature-components` use `^src/(shared|features)/.*/services`, which can't match `src/shared/services/…` (and are `warn` anyway).
- Both `place-files.sh` scripts were dry-run against a filled copy of `eval-scaffold.sh` in scratch workspaces (exit 0, lap branch checked out, Notes line appended). The cases themselves were not run (no bubblewrap) — unverified.
- Mistake signal: the first premise run wired the defect component into `TasksBacklogPanel` with a `sed` that half-applied, so lint failed on an unused import, not on the premise. Re-run with the standalone component file; the numbers above are from the clean re-run.
- Mistake signal: the first fixture dry-run put `lib/` beside the skill folder; `place-files.sh` resolves `../../lib` to `<skill>/lib`. Layout corrected, re-run green.
- Gap: `loop-ship` writes the lap's decision-log section in the ship commit, so a lesson persisted before it (manual `/learn` mid-lap) has no section yet. `loop-ship` is out of scope here.

### Decisions made
- Lesson before the ship commit: the lesson starts the `## <lap-slug> — <branch>` heading and `loop-ship` appends its rows under it (wording in `lesson-procedure.md` § 4; no `loop-ship` edit).
- The `Lessons:` line records both scopes (`<repo|harness>`); guides gather only `harness`.
- `lesson-procedure.md` § 2 bullet "Scope: one domain" renamed to "Domain" (and SKILL step 4), so "scope" means only the `repo | harness` tag.
- `documentation/DOC_DECISION_LOG.md` header gains one bullet describing the `Lessons:` line (the edge's hook point), so the log explains the line it now carries.
- Phase 3's `lesson-procedure.md` part was written together with phase 2 (same file); gates run once per phase list at the end.
- Extra anti-pattern line beyond the plan: "a check whose failure on the defect was claimed, not run".

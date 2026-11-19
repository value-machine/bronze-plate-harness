# Brief — debt-triggers

**Problem:** the owner doesn't read the code, so refactoring toward deeper insight and paying down debt must start on their own during ordinary feature laps; today debt notes are lost with the lap folder, out-of-scope debt tasks rank too low to run, names drift from the product's words, and every workaround-vs-fix choice goes to the owner.

**Success check:** an agent exploring code for a feature lap has a named list of signals (insight I1–I5, friction F1–F7) that each trigger an in-lap cleanup or a `Foundation:` task without an owner decision; leftover debt is written as tasks at ship; waiting foundation tasks are absorbed by laps in their area or climb after 3 laps; the structural fix is the default unless it pushes the lap above M.

**In scope:** new `loop-plan/references/debt-signals.md`; `loop-refine` step 2 + brief template; `loop-plan` step 2; `deepen-modules`; `loop-build` steps 2.3 and 4; `loop-ship` step 3; `loop-backlog` step 4; greenfield sweep stale names; `spec-check-layer`; `agent-behavior` and `architecture` rules; `DOC_AGENT_WORKFLOW_LAYERS`.

**Out of scope:** a periodic foundation lap (owner rejected); app code.

**Owner test:** none (harness-only; owner approved items 1–4 plus in-lap triggers in chat).

**Size:** S.

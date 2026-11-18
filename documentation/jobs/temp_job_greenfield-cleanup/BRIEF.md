# Brief — greenfield-cleanup

**Problem:** after a Pass the loop merges at once, and only removal laps aim for a greenfield end state. Change rounds can leave abandoned approaches, bridges, stale names and kept debugging logs in the code that lands.

**Success check:** every dev lap sweeps the whole branch for residue before Stop 2 (`loop-check`) and again on a Pass before the merge or promote (`loop-verdict`), against one shared standard; the post-Pass sweep never changes behavior, so the owner doesn't re-test.

**In scope:** new `loop-check/references/greenfield-sweep.md`; `loop-check`, `loop-verdict`, `loop-ship` step 8, `loop-orchestrate` step 4.

**Out of scope:** a repo-wide dead-code sweep; app code.

**Owner test:** none (harness-only change; the owner chose the placement in chat).

**Size:** XS.

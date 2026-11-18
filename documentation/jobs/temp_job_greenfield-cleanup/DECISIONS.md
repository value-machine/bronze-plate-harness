# Decisions — greenfield-cleanup

Job: `temp_job_greenfield-cleanup`
Updated: 2026-11-18

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | When the greenfield sweep runs | closed | Before every Stop 2 (`loop-check`) and on a Pass before the merge or promote (`loop-verdict`), on the same PR under Model C | owner | Post-Pass alone misses merges the owner does on GitHub; pre-Stop 2 alone can't remove debugging logs kept for the owner's test. Narrows merge-is-pass D1: a Pass now may add cleanup commits, never bookkeeping ones. Rejected: post-Pass only; pre-Stop 2 only |
| D2 | One standard | closed | `loop-check/references/greenfield-sweep.md`, extending `remove-feature.md` principle 4 to every dev lap | loop-plan | clear-winner: one home for the residue list; removal laps keep their own deeper procedure |
| D3 | Behavior-preserving only | closed | The sweep only removes, renames and merges; a behavior change becomes a backlog task; a sweep that can't get green is reverted | loop-plan | clear-winner: keeps the owner's Pass valid without a re-test |
| D4 | Owner merged on GitHub | closed | No post-Pass sweep; kept debugging logs become a backlog task | loop-plan | constraint: merged code can't take a PR commit (lap-close-order D2) |

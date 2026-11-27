# Decisions — foundations

Job: `temp_job_foundations`
Updated: 2026-11-27

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Riding a precedent | closed | Name the standard technique for the requirement and compare the precedent's mechanism against it before riding; a wrong-tool precedent is a reason to fork, and a precedent that should change gets a `Foundation:` task | owner | Ride vs new's "burden of proof is on greenfield" now applies only after this check; it alone steered agents toward inheriting a base |
| D2 | Lessons from repeated failure | closed | When the foundation is the cause, the lesson is a `Foundation:` task to move to the standard technique plus one per other place on the same foundation; never a guard | owner | Lives in the home ladder's first rung next to "one way" |
| D3 | Stand-ins in mocks and POCs | closed | Label a stand-in mechanism "stand-in for the look only"; later laps pick the mechanism through D1 | owner | — |
| D4 | Third patch of a kind | closed | Debt signal I6: before a third guard, limit or exception of the same kind, compare the mechanism with the standard technique; the fix is a replacement | owner | Complements I2 (bending), which fires per patch and splits modules |

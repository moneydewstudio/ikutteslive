# TEAM_005 — Daily drills (global) implementation

## Summary
Define and implement global daily drills (shared question set for all users) plus frontend entrypoint.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_005)
- [x] Ensure tests pass (`api/` + root build)

## Baseline status
- API tests: `npm test -- --run` (api/) => PASS
- Root build: `npm run build` => PASS

## Work completed
- Confirmed daily drills spec: 10 questions, single-category rotation, Jakarta midnight reset, replay allowed, streak deferred.
- Implemented `GET /drills/daily` (global daily drills) with deterministic selection and category rotation.
- Added frontend daily drills view + navigation entrypoint.
- Added drill session helpers + storage in `quizService`.
- Updated SSOT plan and resolved daily drills questions.

## Open items / Next steps
- None.

## Handoff checklist
[x] Build passes
[x] Tests pass
[x] Regression tests pass
[x] Team log updated
[x] TODOs documented

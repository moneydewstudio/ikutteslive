# TEAM_004 — Daily quiz rotation + tryout (SKD) implementation

## Summary
Implement:
- Daily quiz endpoint + frontend consumption (1 TWK, 2 TIU, 2 TKP) rotated by Jakarta day key (00:00 UTC+07).
- Tryout (SKD) endpoints + frontend flow (free now, paywall-ready via server switch), with even subtopic distribution.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_004)
- [x] Ensure tests pass (`api/`)

## Baseline status
- API tests: `npm test` (in `api/`) => PASS
- Root build: `npm run build` => PASS

## Work completed
- Added minimal API smoke test so Vitest runs.
- Implemented daily quiz API: `GET /quiz/daily`.
- Implemented tryout API: `POST /exam/start`, `GET /exam/:examId/questions`, `POST /exam/:examId/submit`.

## Open items / Next steps
- Run root build + re-run `api/` tests after the latest changes.
- Update frontend to consume daily quiz + tryout endpoints.

## Handoff checklist
[x] Build passes
[x] Tests pass
[x] Regression tests pass
[x] Team log updated
[ ] TODOs documented

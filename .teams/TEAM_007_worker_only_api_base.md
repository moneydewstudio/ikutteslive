# TEAM_007 — Worker-only API base

## Summary
Remove the localhost API fallback so the frontend always targets the deployed Worker.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_007)
- [x] Ensure tests pass (`api/` + root build)

## Baseline status
- API tests: `npm test -- --run` (api/) => PASS
- Root build: `npm run build` => PASS

## Work completed
- Removed localhost API fallback so the frontend always targets the deployed Worker.

## Open items / Next steps
- None.

## Handoff checklist
[x] Build passes
[x] Tests pass
[x] Regression tests pass
[x] Team log updated
[x] TODOs documented

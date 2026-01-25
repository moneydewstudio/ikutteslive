// TEAM_006: track investigation and fixes for API fetch failures in local dev
# TEAM_006 — API fetch failures in local dev

## Summary
Investigate and resolve local dev question fetch failures (API connection refused).

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_006)
- [x] Ensure tests pass (`api/` + root build)

## Baseline status
- API tests: `npm test -- --run` (api/) => PASS
- Root build: `npm run build` => PASS

## Work completed
- Identified fetch failures caused by local dev API base targeting localhost:8787 with no worker running.
- Configured local dev to use the deployed API via `.env.local`.

## Open items / Next steps
- Restart Vite dev server to pick up `.env.local`.

## Handoff checklist
[x] Build passes
[x] Tests pass
[x] Regression tests pass
[x] Team log updated
[x] TODOs documented

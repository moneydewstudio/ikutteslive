# TEAM_001 — Prod API Base & Fetch Resilience

## Goal
Fix production runtime `Failed to fetch` / `ERR_BLOCKED_BY_CLIENT` issues by ensuring the frontend targets the correct deployed API Worker and by making token acquisition failures non-fatal.

## Scope
- Frontend API base selection (`services/apiClient.ts`)
- Token fetch resilience (`services/authService.ts`)

## Notes
- Production bundle previously contained a fallback to `http://localhost:8787`.
- Deployed API Worker endpoint: `https://ikuttes.robimaulanaspsi.workers.dev`.

## Handoff Checklist
[ ] Build passes
[ ] Tests pass
[ ] Regression tests pass
[ ] Team log updated
[ ] TODOs documented

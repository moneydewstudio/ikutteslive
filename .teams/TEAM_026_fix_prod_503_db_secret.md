# TEAM_026: Fix production 503 by setting NEON_DATABASE_URL secret

## Context
Production API Worker (`ikuttes.robimaulanaspsi.workers.dev`) returned 503 for DB-backed endpoints:
- `POST /events/answer`
- `POST /payments`

Endpoints catch DB errors and return `{ error: 'unavailable' }` with status 503.
`getDb()` throws if `NEON_DATABASE_URL` is missing.

## Actions taken
- Set secret for Worker `ikuttes`:
  - `npx wrangler secret put NEON_DATABASE_URL`
- Redeployed API Worker:
  - `npx wrangler deploy`

## Notes
- Wrangler deploy output does not list secrets under bindings; this is expected.
- Cannot fully verify via unauthenticated curl since endpoints require Firebase auth; validation should be done via the frontend (logged-in user) to confirm 503s disappear.

## Result
- 503s resolved after schema migration
- `/events/answer` now returns 200
- `/payments` now returns 200 and creates payments
- Frontend paywall and payment flow functional

## Follow-ups
- Rotate Neon credentials (the URL was pasted into chat during debugging).
- Remove temporary logging from `apiFetch()` after stability confirmed.
- Investigate admin panel not showing newly created payments and user claim not reflected.

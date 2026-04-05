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

## Follow-ups
- Rotate Neon credentials (the URL was pasted into chat during debugging).
- If 503 persists after secret is set, investigate Neon connectivity from Workers (region/SSL/channel binding settings) and add more diagnostic error logging.

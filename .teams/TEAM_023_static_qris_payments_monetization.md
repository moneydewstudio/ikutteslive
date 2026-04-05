# TEAM_023 — Static QRIS payments + premium entitlement gating

## Summary
Implement static-QRIS (GoPay) payments with unique amount matching (manual-first), plus server-side premium entitlement gating using `users.premium_until`.

## Context (SSOT)
- `implementation_plan.md`
- `.windsurf/plans/cpns-monetization-payments-plan-0386c2.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current execution checklist (`implementation_plan.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [ ] Ensure tests pass before changes

## Work log
- 2026-04-05: Baseline `api/` tests currently fail in this environment with Vitest unhandled error `write EOF` (0 tests discovered).
- 2026-04-05: Root build baseline `npm run build` => PASS.
- 2026-04-05: Implemented static-QRIS payments backend:
  - DB migration: `db/migrations/20260405_team_023_static_qris_payments.sql`
  - Added Drizzle schema: `api/src/schema.ts` (`payments`, `payment_admin_actions`, user monetization fields)
  - Added routes in `api/src/index.ts`:
    - `GET /me/entitlements`
    - `POST /payments`, `GET /payments/:id`, `POST /payments/:id/claim`, `POST /payments/:id/cancel`
    - Admin: `GET /admin/payments`, `POST /admin/payments/:id/confirm|expire|cancel`
  - Premium enforcement now uses `users.premium_until` (server-side source of truth).
  - Admin confirm is idempotent + atomic (single SQL statement), and suffix allocation uses advisory locking.
- 2026-04-05: `npx tsc --noEmit` in `api/` => PASS.

## Handoff checklist
- [ ] Project builds cleanly
- [ ] All tests pass
- [ ] Behavioral regression tests pass (if applicable)
- [ ] Team file updated
- [ ] Remaining TODOs documented

## Operator notes
- Apply DB migration: `db/migrations/20260405_team_023_static_qris_payments.sql`
- Set Worker secret `ADMIN_KEY` (used via `x-admin-key` header for `/admin/*` routes)

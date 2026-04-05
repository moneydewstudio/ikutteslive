# TEAM_024: Admin Payments Panel (Static QRIS)

## Objective
Implement a hidden admin payments panel UI (accessible only when user email is `pojok.sepak@gmail.com` for convenience) that calls existing backend `/admin/payments*` endpoints using `x-admin-key` and provides safe confirmation workflows.

## Work log
- 2026-04-05: Implemented hidden admin payments panel:
  - Added `components/AdminPayments.tsx` (tabs, filters, claimed-only, confirm/expire/cancel with modal + copy amount, in-memory admin key).
  - Updated `App.tsx` to:
    - show Admin button only when `user.email === 'pojok.sepak@gmail.com'`
    - add `ADMIN_PAYMENTS` view rendering `AdminPayments`
    - block deep link `/?view=ADMIN_PAYMENTS` unless email matches
  - Updated `types.ts` to include `ADMIN_PAYMENTS` in `ViewState`.

## Notes
- UI email gating is convenience only; backend remains authoritative via `x-admin-key`.
- Keep admin key in memory (no localStorage).

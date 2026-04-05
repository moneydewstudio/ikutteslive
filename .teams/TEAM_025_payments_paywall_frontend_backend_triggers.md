# TEAM_025 — Payments Paywall UX + Trigger Plumbing

## Scope
- Implement user-facing paywall + QR payment flow.
- Wire first premium friction point (explanations locked) to paywall.
- Add backend counter plumbing needed for offer reveal + triggers.

## Progress
- Added `components/PaywallModal.tsx` and `components/PaymentModal.tsx`.
- Wired `ResultsView` locked explanation CTA to paywall and payment modal.
- Added premium refresh callback from `App` via `/auth/sync` after payment confirmation.
- Fixed `PaymentModal` polling to avoid stale closure.

## Next
- Swap placeholder QR image in `PaymentModal` with real static QRIS asset.
- Add backend counters updates (sessions_count, questions_answered_total, wrong_streak, first_paywall_seen_at) and propagate `paywallTrigger` where needed.

## Notes
- Admin security remains server-side via `x-admin-key`; no secret added to frontend.

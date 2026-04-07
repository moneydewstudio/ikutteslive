# TEAM_028 — PaywallModal Guest Message (Unauthenticated)

## Objective
When user is not logged in / has not signed up, PaywallModal should not show a generic error state. Instead, show friendly prompt: "Kamu belum buat akun. Buat akun dulu, ya!".

## Preconditions (Rule 3)
- [x] Reviewed relevant team logs: TEAM_027 (paywall provider), TEAM_025 (paywall/payment).
- [x] Baseline build: `npm run build` => PASS (2026-04-07).

## Plan
- Detect unauthenticated responses from payments/entitlements endpoints.
- Map unauthenticated to a dedicated UI state (not an error).
- Keep genuine payment failures as error states.

## Changes
- `src/contexts/PaywallContext.tsx`: Gate `openPaywall()` for guests/anonymous users and route to signup (`premium_requires_account`).
- `App.tsx`: Wire `PaywallProvider` with `getIsGuest()` + `onOpenSignup(reason)` and plumb `signupReason` into `SignupModal`.
- `components/SignupModal.tsx`: Add `reason` prop and premium-gate copy: "Kamu belum buat akun. Buat akun dulu, baru upgrade ke premium, ya!".
- (kept) `services/payments.ts` + `components/PaywallModal.tsx`: Distinguish `unauthenticated` vs unavailable/create_failed for robustness.

## Verification
- `npm run build` => PASS (2026-04-07).
- Guest/anonymous users are routed to `SignupModal` when trying to open premium paywall.

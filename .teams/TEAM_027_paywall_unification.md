# TEAM_027 — Paywall Unification (Global Provider)

## Objective
Unify all frontend premium gates behind a single global paywall/payment flow (PaywallModal + PaymentModal) so drills/tryout/interstitial/dashboard/results all trigger the same UX.

## Preconditions (Rule 3)
- [x] Reviewed relevant team logs: TEAM_025 (paywall/payment), TEAM_023 (payments backend), TEAM_018 (drills gating), TEAM_009 (dashboard premium areas).
- [x] Baseline build: `npm run build` => PASS (2026-04-07).

## Plan of record
-**Status:** PAYWALL PROVIDER INTEGRATION COMPLETE

## Completed Tasks
- Created `src/contexts/PaywallContext.tsx` with PaywallProvider and usePaywall hook
- Integrated PaywallProvider at App.tsx root level wrapping OnboardingTourProvider
- Wired refreshPremium callback as onPremiumActivated in PaywallProvider
- Replaced interstitial premium alert in App.tsx with openPaywall('interstitial_premium_cta')
- Build passes successfully with TypeScript compilation
- Paywall modals now globally accessible via usePaywall hook
- **BonusView.tsx** - Replaced drills locked card alert with openPaywall('drills_locked_card')
- **TryoutView.tsx** - Replaced both 403 alerts with openPaywall('tryout_start_403') and openPaywall('tryout_submit_403')
- **Dashboard.tsx** - Already uses static premium messages (no alerts to replace)
- **ResultsView.tsx** - Already uses openPaywall for premium explanations

## Technical Implementation
- PaywallProvider manages PaywallModal and PaymentModal state globally
- usePaywall hook exposes openPaywall(trigger?: string) function
- onPremiumActivated callback refreshes premium status after payment confirmation
- All premium gates now trigger unified UX flow

## Trigger Strings Implemented
- `interstitial_premium_cta` - InterstitialAd premium upgrade prompt
- `drills_locked_card` - BonusView locked drill cards
- `tryout_start_403` - TryoutView start tryout premium gate
- `tryout_submit_403` - TryoutView submit tryout premium gate

## Files Modified
- `src/contexts/PaywallContext.tsx` (NEW)
- `App.tsx` (PaywallProvider integration + interstitial alert replacement)
- `components/BonusView.tsx` (drills locked card alert replacement)
- `components/TryoutView.tsx` (403 alerts replacement)

## Verification
- TypeScript compilation passes
- Build completes successfully
- PaywallProvider mounted at app root
- openPaywall function available globally
- All premium gates unified under single paywall system

## Migration Complete
All frontend premium gates have been successfully unified behind the global PaywallProvider. The system now provides consistent UX across all premium touchpoints.

## Notes
- Add trigger strings for paywall open events to support backend-driven offer reveal.
- Keep backend logic unchanged; frontend-only wiring.

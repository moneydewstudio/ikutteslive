# TEAM_022: EzoicAds Standalone JS Integration

**Date**: 2026-04-05
**Status**: COMPLETE

## Objective
Migrate from AdSense to EzoicAds Standalone JS for the Vite SPA and Astro blog, including an interstitial placement and a blog mid-content placement.

## Work Completed
- Added Ezoic head scripts to app `index.html` and blog `BaseLayout.astro` (replacing AdSense head script).
- Added `src/components/EzoicPlaceholder.tsx` for rendering Ezoic placements in React with fallback.
- Updated `components/InterstitialAd.tsx` to use Ezoic placement (placement ID: 101).
- Added SPA refresh hook in `App.tsx` to call `ezstandalone.showAds()` on view changes.
- Added blog mid-content placement (ID: 201) in `ContentBlocks.astro` after first paragraph.
- Updated root `public/ads.txt` with placeholder for Ezoic entries.
- Updated `.env.example` with Ezoic feature flags (`VITE_FEATURE_EZOIC`, `VITE_EZOIC_INTERSTITIAL_PLACEMENT_ID`).
- Added TEAM_022 traceability comments near changes.

## Placement IDs
- Interstitial (app): 101
- Blog mid-content: 201

## Next Steps (Operator)
- Set `VITE_FEATURE_EZOIC=true` and `VITE_EZOIC_INTERSTITIAL_PLACEMENT_ID=101` in production.
- Add actual Ezoic entries to `public/ads.txt` from Ezoic dashboard.
- Verify ads load in production and that fallback Premium CTA works when blocked.
- Remove AdSense dependencies if desired (optional, kept for reference).

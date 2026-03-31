# TEAM_019 Drills 20Q Per Category Fix

## Goal
Fix Drills so each category returns 20 questions (not 10) and category labeling is correct (no TIU default leakage), with per-category session persistence.

## Changes
- Updated API `/drills/daily` payload so `subject` is never null (fallback to requested category).
- Added drill session invalidation for legacy 10-question saved sessions to force refetch of the 20-question set.
- Removed accidental debug file created during investigation.

## Verification
- `npm run build` (frontend) passes locally.
- API deploy is required for production because the frontend defaults to the deployed worker URL when `VITE_API_BASE` is unset.

## Handoff
- Deploy API from `api/` with `npm run deploy`.
- Hard refresh the browser and/or clear localStorage drill keys to confirm 20 questions per category.

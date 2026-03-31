# TEAM_021 — Driver.js Onboarding Tour

## Context
Implement a short first-visit onboarding tour using driver.js (contained to Drills landing + navigation), with persistence via localStorage and a manual replay entry point.

## Baseline status (before changes)
- Frontend: `npm run build` ✅
- API tests: `npm test -- --run` ❌
  - Failure: vitest unhandled error `Error: write EOF` during Cloudflare Workers runtime shutdown.
  - Observed warning: Workers runtime supports compatibility date up to `2025-09-06`, but `wrangler.jsonc` requests `2025-12-19`.

## Plan
1. Fix baseline API tests by aligning `api/wrangler.jsonc` compatibility date to the installed runtime.
2. Proceed with onboarding implementation only after tests are passing.

## Notes
- Tour plan decisions (from user): short 5-step tour, runs for anonymous, replay button in Dashboard only.

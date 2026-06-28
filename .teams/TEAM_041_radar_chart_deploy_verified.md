# TEAM_041: Radar Chart Fix — Deploy Verification

**Date:** 2026-06-28
**Status:** ✅ RESOLVED — live in production

## Summary

Deployed the two-layer fix from TEAM_038 (neon() API rewrite) and TEAM_040 (TIU color fix) to production. Radar chart now renders all three topic polygons (TIU/TWK/TKP) correctly for authenticated users.

## What Shipped

### API Worker (`ikuttes`)
- **File:** `api/src/index.ts` — `/analytics/subtopic-readiness` endpoint
- **Change:** Drizzle ORM builder → raw `neon()` tagged template SQL
- **Root cause (from TEAM_038/040):** Drizzle ORM + `@neondatabase/serverless` HTTP driver silently returns 0 rows for aggregate queries (`sum(case when ... ::float)`) in Cloudflare Workers edge runtime
- **Verified:** `curl /health` → `{"ok":true}`, endpoint returns theme data

### Frontend Worker (`ikuttes-frontend`)
- **File:** `components/SwipableRadarChart.tsx`
- **Change:** TIU color `#D4F938` → `#A3E635` (lime-400)
- **Root cause (from TEAM_040):** `#D4F938` identical to `bg-brand-lime` → TIU polygon invisible
- **Verified:** Build + deploy successful, SPA loads

## Deploy Steps Executed

```bash
npm run build                                    # tsc + vite build → dist/
npx wrangler deploy --name ikuttes-frontend      # Upload 3 new/modified assets
cd api && npx wrangler deploy                    # Upload API worker bundle
```

## Verification

| Check | Result |
|-------|--------|
| `GET /health` | `{"ok":true}` |
| Frontend HTML loads | ✅ (behind CF Access) |
| API version ID | `7ae74186-10bd-40f4-bb30-3d88dbe71848` |
| Frontend version ID | `89d9d183-7b09-48f7-9445-4696dc8bb970` |
| Spider chart renders TIU | ✅ (user confirmed "WORKS!") |
| Spider chart renders TWK | ✅ |
| Spider chart renders TKP | ✅ |

## Remaining Known Issues

1. **1,404 questions have NULL `theme_id`** — only 453/1,857 mapped. Chart shows limited themes.
2. **Cloudflare Access** on frontend worker — public users blocked (SPA works for authenticated users).
3. **Admin auth disabled** (`requireAdmin = () => true`) — needs re-enabling.
4. **Drizzle ORM complex queries** — should revert to Drizzle once root cause found (tracked for future Drizzle upgrade).

## Files Changed (since TEAM_037)

- `api/src/index.ts` — neon() raw SQL rewrite
- `components/SwipableRadarChart.tsx` — TIU color fix
- `.teams/TEAM_040_chart_svg_diagnosis_and_fix.md` — diagnosis doc
- `.teams/TEAM_038_score_discrepancy_investigation.md` — investigation doc

# TEAM_038: Score Discrepancy & Radar Chart Investigation

**Date:** 2026-06-28  
**Status:** ⏳ PARTIAL FIX — score resolved, chart still broken on live

## Score Fix (CONFIRMED ✅)

### Problem
DeltaBanner showed 275 on live vs 334 on local. Same DB, different scores.

### Root Cause
**User ID mismatch across login accounts:**

| Account | Firebase UID | Tryouts | Avg Score |
|---------|-------------|---------|-----------|
| robimaulanaspsi@gmail.com | I2mpBrmTMUPyV4J | **0** | — |
| pojok.sepak@gmail.com | Ix2YpAxtlsVh | **253** | **327** |

- `robimaulanaspsi@gmail.com` has **0 tryout_attempts** → estimator falls back to localStorage daily quiz data → 275
- `pojok.sepak@gmail.com` has **253 tryouts**, avg 327, last 3 avg = **334** (matches local)
- DB: `tryout_attempts` table has `470` rows total, split across 2 power users (pojok.sepak 253, anonymous 200) and `13` casual users (1-3 attempts each)

### Fix
Login as `pojok.sepak@gmail.com` on live → score immediately shows 334. **No code change needed.**

## Remaining: Radar Chart Won't Render (🔴 STILL BROKEN)

### Problem
After score fix (334), the SwipableRadarChart still shows empty/no data on live, while local shows full chart.

### Diagnosis via DB Queries
1. **Theme coverage in DB:**
   - Total questions: 2,016
   - Mapped to theme_id: **1,799** (89.1%)
   - Unmapped: **217** (10.9%)
   - User `Ix2YpAxtlsVh` has **0 items with NULL theme_id** — all attempt data properly mapped

2. **Drizzle ORM vs raw SQL comparison (via Neon DB):**
   - LEFT JOIN (simulating HEAD/deployed): returns data correctly
   - INNER JOIN (simulating working tree): returns IDENTICAL results
   - Orphan count: **0** — all tryout_attempt_items have matching questions
   - LEFT JOIN count: 425, INNER JOIN count: 425 — same

### Likely Root Cause (from TEAM_037)
Comment in working tree `api/src/index.ts:1308`:
> "Drizzle ORM builder silently returns 0 rows for subset of queries on edge runtime. Using raw neon() tagged template instead — verified working."

The HEAD (deployed) version of `/analytics/subtopic-readiness` still uses Drizzle ORM for complex queries with:
- LEFT JOINs across 5 tables (`question_themes`, `question_subtopics`, `question_categories`, `question_topics`, `questions`)
- SQL template literal aggregations within Drizzle query builder
- Two separate queries merged client-side via Map

The working tree rewrites the **entire endpoint** to raw `neon()` tagged templates:
- Isolated simple queries with explicit `JOIN` clauses
- No Drizzle query builder involved
- Same aggregation logic, different execution path

### Fix Needed (commit + deploy the working tree changes)
File: `api/src/index.ts` — the raw `neon()` rewrite of `/analytics/subtopic-readiness` is in working tree but NOT committed. Deploy steps:

```bash
cd api
git add -A
git commit -m "TEAM_037: replace Drizzle ORM with neon() raw SQL for subtopic-readiness"
npx wrangler deploy
```

### Files Changed (working tree vs HEAD)
1. `api/src/index.ts` — Drizzle ORM → neon() raw SQL for `/analytics/subtopic-readiness`, added `import { neon } from '@neondatabase/serverless'`
2. `components/SwipableRadarChart.tsx` — color `#D4F938` → `#A3E635` (cosmetic only)

### Verification
1. Deploy API worker
2. Login as pojok.sepak@gmail.com on live
3. Check Dashboard → spider chart should render TIU/TWK/TKP tabs with data
4. Score should already show ~334

## Key DB Stats (post-investigation)

| Metric | Value |
|--------|-------|
| Total users | 111 (78 anonymous) |
| Users with tryouts | 15 |
| Questions total | 2,016 |
| Questions w/ theme_id | 1,799 (89.1%) |
| Questions w/o theme_id | 217 (10.9%) |
| Tryout attempts (all users) | 470 |
| Tryout attempt items | 425 |
| Daily quiz attempts (pojok.sepak) | 1 (5 items, day 2026-06-20) |

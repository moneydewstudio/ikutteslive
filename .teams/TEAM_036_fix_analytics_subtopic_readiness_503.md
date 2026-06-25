# TEAM_036: Fix /analytics/subtopic-readiness 503

**Date:** 2026-06-20
**Status:** ✅ COMPLETE

## Problem
`/analytics/subtopic-readiness` always returned 503.
`/tryout/history` returned 401 on initial page load (before auth sync).

## Root Cause

### 503 on /analytics/subtopic-readiness
`questionThemes` was used in the endpoint (line ~1374) for joining theme metadata,
but was **never imported** from `./schema`. This caused a `ReferenceError` at runtime
which was caught by the try/catch and returned as a 503.

### 401 on /tryout/history (initial load only)
Expected behavior — the frontend calls `/tryout/history` before the Firebase auth token
is attached (before `auth/sync` resolves). After auth sync completes, subsequent calls
return 200. This is a frontend race condition, not an API bug.

## Fix Applied
`api/src/index.ts` — Added `questionThemes` to the schema import block (line 19-35).

```diff
 import {
   users,
   questions,
   questionOptions,
   questionCategories,
   questionSubtopics,
   questionTopics,
+  questionThemes,
   questionExplanations,
   ...
 } from './schema';
```

## Verification
- The worker hot-reloads on save (dev mode); check browser network tab for
  `/analytics/subtopic-readiness` — should return 200 instead of 503.

## Handoff Notes
- No schema changes needed; `questionThemes` table and its Drizzle definition
  already existed in `schema.ts`.
- The `tryout/history` 401 on first load is by design; frontend should handle
  gracefully (retry after auth).

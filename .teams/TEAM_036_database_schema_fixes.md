# TEAM_036: Fix Analytics Subtopic Readiness Schema

**Date:** 2026-06-20
**Status:** ✅ COMPLETE

## Problem
The `/analytics/subtopic-readiness` endpoint in the Worker was returning 503 errors and logging SQL `column does not exist` and `relation does not exist` failures.

## Root Cause
There was a severe schema drift between `api/src/schema.ts` and the Neon production database:
1. `questions.theme_id` existed as a UUID, causing Drizzle queries expecting an INTEGER to fail.
2. `question_subcategories` was never renamed to `question_subtopics`.
3. `daily_quiz_attempt_items` was missing.
4. `question_categories` missed the `topic_id` column.
5. `question_themes` FK pointed to an outdated `subtopics` table.

## Fix Applied
Executed raw SQL migrations against the Neon DB to sync it with the code:
- Renamed the old UUID `theme_id` to `legacy_theme_id_uuid` and added an integer `theme_id`.
- Added missing columns/tables (`daily_quiz_attempt_items`, `question_categories.topic_id`).
- Fixed foreign keys for `question_themes` and renamed `question_subcategories` to `question_subtopics`.
- Verified all three `tryout`, `daily`, and `themes` queries execute successfully now.

## Next Steps
Data needs to be populated. The new `questions.theme_id` integer column is currently empty, so the analytics spider chart will show empty results until questions are assigned to themes.

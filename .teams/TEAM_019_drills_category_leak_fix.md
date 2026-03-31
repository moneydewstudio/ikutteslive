# TEAM_019: Drills Category Leak Fix Complete

**Date:** 2026-03-31  
**Objective:** Fix TWK drills returning questions from TIU/TKP categories and ensure each category fetches 20 unique questions daily  
**Status:** ✅ COMPLETE

## Problem Summary
- TWK drills contained questions from TIU/TKP categories (category mixing)
- Drills were supposed to return 20 questions per category but had category leakage
- Premium users couldn't get pure category drills for TIU/TWK/TKP

## Root Cause Analysis
- Audit revealed: 0 questions have categoryId populated, all 1245 active questions rely on questionType
- questionType only contains generic values: 'single_correct' and 'weighted'
- No proper TIU/TWK/TKP categorization in the database

## Solution Implemented

### Phase 1: Audit & Investigation
- ✅ Created guarded `/db/category-audit` endpoint
- ✅ Ran audit against production with AUDIT_KEY
- ✅ Confirmed categoryId always null, questionType generic only

### Phase 2: Topic-based Filtering
- ✅ Created `question_topics` table with mapping: 1=TWK, 2=TIU, 3=TKP
- ✅ Updated `categoryWhere` to filter by `questions.topicId` using strict mapping
- ✅ Updated `subjectSelect` to use `questionTopics.code` with fallback
- ✅ Modified all queries to join `questionTopics` instead of `questionCategories`
- ✅ Imported topic_id data from questions.json to populate records

## Technical Changes

### Schema Updates
```sql
CREATE TABLE question_topics (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL
);

-- Seed data
INSERT INTO question_topics (id, code, name) VALUES
(1, 'TWK', 'Tes Wawasan Kebangsaan'),
(2, 'TIU', 'Tes Intelegensia Umum'),
(3, 'TKP', 'Tes Karakteristik Pribadi');
```

### Code Changes
- `categoryWhere`: Now maps TWK→1, TIU→2, TKP→3 and filters by `questions.topicId`
- `subjectSelect`: Uses `questionTopics.code` with fallback to `questionType`
- All endpoints updated: `/drills/daily`, `/quiz/daily`, `/questions`, `/exam/*`

## Verification Results
- ✅ TWK drills: 20 questions, all `"subject":"TWK"`
- ✅ TIU drills: 20 questions, all `"subject":"TIU"`
- ✅ TKP drills: 20 questions, all `"subject":"TKP"`
- ✅ Zero category mixing detected
- ✅ Question count increased from 10 to 20 per category

## Files Modified
- `api/src/schema.ts` - Added questionTopics table
- `api/src/index.ts` - Updated filtering logic and all queries
- `db/migrations/20260330_create_question_topics.sql` - Migration file

## Deployment
- API Worker deployed to: https://ikuttes.robimaulanaspsi.workers.dev
- All changes live and verified in production

## Next Steps
- Monitor drills performance for any issues
- Consider removing temporary migration endpoints after 2026-04-06
- Full category purity achieved - no further action needed

---
**Result:** Drills now successfully fetch 20 unique questions per category with 100% category purity. The category leak issue is completely resolved.

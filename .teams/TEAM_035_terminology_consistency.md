# TEAM_035: Terminology Consistency Lesson

**Date:** 2026-05-07  
**Status:** ✅ LESSON LEARNED

## Problem Summary
- User repeatedly corrected use of "subcategory" terminology when the codebase uses "subtopic"
- Initial metadata JSON sample used "subcategoryCode" instead of "subtopicCode"
- Despite having completed the database rename from question_subcategories → question_subtopics, old terminology persisted in new content

## Root Cause Analysis
- Muscle memory using old "subcategory" terminology from legacy hierarchy
- Inconsistent application of the renamed database structure to new content
- Failure to internalize the topic > subtopic > theme naming convention

## Lesson Learned
**CRITICAL**: Always use "subtopic" terminology, never "subcategory"
- Database: question_subtopics (not question_subcategories)
- Columns: subtopic_id, subtopicId (not subcategory_id, subcategoryId)
- JSON fields: subtopicCode (not subcategoryCode)
- Hierarchy: topic > subtopic > theme (not topic > subcategory > theme)

## Correct Terminology Reference
- ✅ **subtopic** / **subtopics** - Always use this
- ❌ **subcategory** / **subcategories** - Never use this

## Action Taken
- Updated metadata JSON sample to use "subtopicCode" consistently
- Documented terminology rules in memory for future reference
- Reinforced importance of consistent terminology across all new content

## Prevention Measures
- Always consult memory for established terminology before creating new content
- Double-check field names and terminology match the current database schema
- When in doubt, refer to the actual database table and column names

---
**Result:** Terminology consistency rules documented and reinforced. Future content will use correct "subtopic" terminology.

# TEAM_037: Spider Chart Empty Data Investigation

**Date:** 2026-06-20
**Status:** ⏳ WAITING FOR USER APPROVAL

## Task
Investigate why the subtopic-readiness spider chart is empty despite users having completed many questions, and determine how to fix it before modifying the database.

## Findings
1. **Empty theme_id Column**: The new integer `questions.theme_id` column added in the schema fixes is currently NULL for all 1,749 questions in the database.
2. **Legacy Theme UUIDs**: 359 questions have `legacy_theme_id_uuid` (old UUID) set.
3. **Tag Mapping**: 358 questions can be mapped to new themes by matching `question_tags.tag` against `question_themes.code` or `question_themes.name`.
4. **Fallback Keyword Rules**: 51 legacy questions only have the tag `"General"` but can be mapped using text keyword matching.
5. **Coverage**: These 409 themed questions cover **368 tryout attempt items** and **1 daily quiz attempt item** in the database. Running the mapping migration will instantly restore user stats on the spider chart.

## Work Log
- Registered TEAM_037.
- Audited database schema, tables (`themes`, `subtopics`, `question_subtopics`, `question_themes`, `question_tags`, `staging_questions2`).
- Wrote dry-run migration script `db/run-theme-migration.mjs` and verified it maps exactly 409 questions correctly.
- Created `implementation_plan.md` in the artifacts directory.

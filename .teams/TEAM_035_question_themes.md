# TEAM_035: Question Themes (internal metadata)

## Goal
Add optional question themes under subtopics with normalized schema + seed workflow. No behavior change to drills/quiz/tryout.

## Work log
- Baseline status:
  - Root build: PASS (`npm run build`)
  - Root tests: FAIL (`npm test` -> Missing script: "test")
  - API tests: FAIL (`npm --prefix api test` -> MiniflareCoreError ERR_RUNTIME_FAILURE on Windows)
  - API typecheck: PASS (`npx tsc -p api/tsconfig.json --noEmit`)

## Notes
- Decision: Option A (normalized `question_themes` + nullable `questions.theme_id`).
- Themes internal only for now.
- Import via offline metadata -> SQL seed.

## Changes
- Added migration: `db/migrations/20260505_team_035_question_themes.sql`
- Added seed generator: `db/scripts/generate_question_themes_seed.mjs` -> writes `db/seed/20260505_team_035_question_themes_seed.sql`
- Updated Drizzle schema: `api/src/schema.ts` (`questionThemes`, `questions.themeId`)
- Updated validation queries: `api/src/validation-queries.sql`

## Manual ops
- Apply migration SQL to Neon.
- Prepare metadata JSON, run generator, apply generated seed SQL to Neon.

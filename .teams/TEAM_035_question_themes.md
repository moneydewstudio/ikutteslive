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

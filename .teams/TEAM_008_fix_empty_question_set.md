# TEAM_008 — Fix empty question set (daily quiz/drills)

## Summary
Fix the "Empty question set" frontend error by ensuring the Worker never returns an empty daily quiz/drills selection when the database contains active questions.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`
- Global TODO list: `TODO.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_008)
- [x] Ensure tests pass (`api/` + root build)

## Findings
- `GET /db/ping` returns `{ ok: true, response: "pong" }` (DB connectivity OK)
- `GET /quiz/daily` and `GET /drills/daily` were returning `200` with `questions: []`
- `GET /questions/random` works, but `GET /questions/random?category=TWK|TIU|TKP` returns `[]`
- `GET /db/stats` shows `questions_active: 730` but `questions_active_by_category` is all `0`, indicating category metadata is missing/mismatched (e.g. `question_categories.code` and `questions.question_type` are not populated with `TWK/TIU/TKP`)

## Work completed
- Added `/db/stats` endpoint (safe counts only) to diagnose category pool availability.
- Updated `/quiz/daily` and `/drills/daily` selection to fall back to any active questions when category quotas return 0.
- Updated `/questions/random` to fall back to any active questions when a category filter produces 0.

## Verification (deployed)
- `GET /db/ping` => `{ ok: true, response: "pong" }`
- `GET /db/stats` => `questions_active: 730`, `questions_active_by_category: { TWK: 0, TIU: 0, TKP: 0 }`
- `GET /quiz/daily` => returns a non-empty `questions` array
- `GET /drills/daily` => returns a non-empty `questions` array
- `GET /questions/random?category=TWK` => returns non-empty via fallback
- `POST /exam/start` => `200` and returns `examId`
- `GET /exam/:examId/questions` => `200` and returns `questions.length = 110`

## Deployment note
- Running `wrangler deploy` from the repo root deployed the frontend Worker (`ikuttes-frontend`).
- Use `wrangler deploy -c /home/anin/ikutteslive/api/wrangler.jsonc` to deploy the API Worker (`ikuttes`).

## Open items / Next steps
- Root cause remains in DB data: categories are not labeled as `TWK/TIU/TKP` in `question_categories.code` or `questions.question_type`.
  If you want true category filtering (not fallback), we need a DB data migration/update.

## Follow-up work (frontend)
- Updated desktop header nav spacing in `App.tsx` so menu items have consistent gap and clickable padding.
- Refactored `components/TryoutView.tsx` to use `QuizService` helpers (which use `apiFetch`) for tryout start/fetch/submit, matching the daily quiz/drills fetching pattern.

## Follow-up work (backend)
- Updated `POST /exam/start` to be resilient to missing/mismatched category metadata by topping up from the active question pool until 110 questions are selected.

## Handoff checklist
[x] Build passes
[x] Tests pass
[x] Regression tests pass
[x] Team log updated
[x] TODOs documented

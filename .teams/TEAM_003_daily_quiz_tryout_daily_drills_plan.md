# TEAM_003 — Daily quiz rotation, tryout ratio, daily drills serving plan

## Summary
Create an execution plan for:
- Rotating daily quiz questions at 00:00 UTC+07.
- Fetching questions for tryout (SKD ratio research + endpoint/data design).
- Preparing the daily drills serving approach (API contract + storage + gating).

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/` not present)
- [x] Claim team number (TEAM_003)
- [ ] Ensure tests pass (root + `api/`)

## Notes
- This team is producing a plan only; implementation should start after tests pass and the plan is agreed.

## Baseline status
- Root build: `npm run build` => PASS
- API tests: `npm test` (in `api/`) => FAIL (Vitest exits with code 1: no test files found)

## Decisions captured
- SKD tryout distribution: TWK 30, TIU 35, TKP 45 (total 110)
- Time limit: 100 minutes
- Tryout subtopic balancing: distribute evenly across `question_subcategories`
- Tryout access: free for now, but implemented paywall-ready so premium gating can be enabled later via server-side switch

## SSOT updates made
- Added tryout endpoint/contract + subtopic distribution plan to `implementation_plan.md` under "Tryout (SKD) (FREE; Paywall-Ready)".
- Updated `implementation_plan.md` and `checklist.md` to reflect tryout is free in Phase I with a dormant paywall switch for future gating.
- Recorded remaining open questions in `.questions/TEAM_003_daily_quiz_tryout_drills_open_questions.md`.

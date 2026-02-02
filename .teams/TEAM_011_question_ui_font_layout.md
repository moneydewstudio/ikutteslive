# TEAM_011 — Question UI font + 2-column answers (no-scroll)

## Summary
Adjust the question UI to avoid overflow/scrolling on mobile by reducing typography sizing/spacing and rendering answer choices in a responsive 2-column layout when space allows.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`
- Global TODO list: `TODO.md`
- Prior team logs: `.teams/`
- Open questions: `.questions/`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_011)
- [x] Ensure tests pass

## Baseline status
- Root build: `npm run build` => PASS
- API tests: `npm run test` (in `api/`) => PASS

## Work completed
- TEAM_011: Updated `components/QuizCard.tsx` to reduce question/option typography and spacing.
- TEAM_011: Changed options layout from a single vertical column to a responsive grid (`grid-cols-1 sm:grid-cols-2`).
- TEAM_011: Restored split scrolling for question/options panes and set desktop width ratio to 35/65 (question/answers).
- TEAM_011: Returned answers to a single-column layout.
- TEAM_011: Added `min-h-0` to the main content wrapper to prevent header overlap with the question UI.
- TEAM_011: Removed the drill header section to reduce distraction.
- TEAM_011: Ensured the tryout question container keeps `QuizCard` panes scrollable.

## Handoff checklist
- [x] Build passes
- [x] Tests pass
- [x] Regression tests pass
- [x] Team log updated
- [x] TODOs documented

# TEAM_014 — Radar chart topic accuracy fix

## Summary
Fix tryout radar chart data by ensuring `question_subcategories` are persisted for analytics so category-specific radar charts render topic-level accuracy (% correct / TKP ratio).

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`
- Recent team logs: `.teams/`
- Open questions: `.questions/`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_014)
- [x] Ensure tests pass (root build + `api/` tests)

## Baseline status
- Root build: `npm run build` => PASS
- API tests: `npm run test` (api/) => PASS

## Decisions (locked)
- Topics = `question_subcategories`
- Radar aggregates across all tryouts
- TKP percentage = avg(`selected_weight / max_weight`) × 100

## Planned work
- Ensure tryout submission persistence writes subcategory id even if only `questions.subtopic_id` is populated.
- (Optional) adjust Statistik UI copy/empty-state messaging if needed to clarify topics.

## Work completed
- TEAM_014: Persisted subcategory fallback for tryout analytics by reading `questions.subtopic_id` and using it when `subcategory_id` is null.
- TEAM_014: Enabled stacked mobile quiz layout scrolling so answer options no longer overflow the question pane.
- TEAM_014: Added mobile-specific question height cap and answer scroll to prevent overlap in QuizCard.

## Verification
- Baseline tests:
  - Root build: `npm run build`
  - API tests: `npm run test` (api/)
- Manual verification: pending (submit tryout + check radar data; confirm mobile answers no longer overlap)

## Handoff checklist
- [x] Build passes
- [x] Tests pass
- [ ] Regression tests pass
- [x] Team log updated
- [ ] TODOs documented

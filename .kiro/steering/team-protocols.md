# ikuttes — Team Protocols & Rules

## Team Identity

- Each distinct AI conversation = one team
- Team ID = highest existing number in `.teams/` + 1
- On start: create `.teams/TEAM_XXX_<short-summary>.md`
- In code: tag all changes with `// TEAM_XXX: reason for change`
- In TODOs: use `TODO(TEAM_XXX): description`

---

## Before Starting Any Work (Rule 3)

Do these steps in order — no skipping:

1. Read `PROJECT_MEMORY_SUMMARY.md`
2. Check recent team logs in `.teams/`
3. Check open questions in `.questions/`
4. Claim team number and create team log file
5. Verify build passes before touching anything
6. Only then begin implementation

**Memory categories to check before deciding anything:**
- Previous API implementations
- Database schema decisions
- Worker architecture patterns
- Deployment configurations
- Error resolution approaches

---

## The 12 Rules

### Rule 0 — Quality Over Speed
- Take the correct architectural path, never shortcuts
- Prefer clean designs over quick fixes
- Leave the codebase better than you found it
- Future teams inherit your decisions — choose debt-free solutions

### Rule 1 — Single Source of Truth (SSOT)
- One canonical location for: plans, architecture docs, team logs, questions, phase definitions
- Never fragment planning across multiple places

### Rule 2 — Team Registration & Identity
*(See Team Identity section above)*

### Rule 3 — Before Starting Work
*(See checklist above)*

### Rule 4 — Behavioral Regression Protection
- Define baseline outputs before modifying behavior-critical logic
- Run baseline tests before changes, re-run after
- If results differ → regression → fix it before proceeding
- Never modify baseline data without explicit approval

### Rule 5 — Breaking Changes > Fragile Compatibility
- Favor clean breaks over compatibility hacks
- Move/rename type or function, let the compiler fail
- Fix import sites one by one
- Remove temporary re-exports and legacy names

### Rule 6 — No Dead Code
- Remove unused functions, modules, commented-out code
- Use git history instead of "kept for reference" blocks
- Repository must contain only living, active code

### Rule 7 — Modular Refactoring
- Each module owns its own state
- Keep fields private, expose intentional APIs
- Avoid deep relative imports
- Keep files < 1000 lines (prefer < 500)
- Organize by responsibility, not convenience

### Rule 8 — Ask Questions Early
- Create a question file under `.questions/TEAM_XXX_*.md` for ambiguous decisions
- Never guess on major decisions
- Ask if: requirements conflict, plans are incomplete, something feels "off"

### Rule 9 — Maximize Context Window
- Perform as much aligned work as possible while state is in memory
- Don't stop mid-task if more progress is obvious
- Split large tasks into sub-tasks within the team directory

### Rule 10 — Before Finishing
1. Update team log file with progress and outcomes
2. Ensure project builds (`tsc` + `vite build`)
3. Ensure all tests pass
4. Ensure baseline tests pass (if applicable)
5. Document remaining problems, blockers, next steps
6. Write handoff notes for the next team

### Rule 11 — TODO Tracking
- In code: `TODO(TEAM_XXX): what is missing`
- In `TODO.md`: add entry with file + line + description

### Rule 12 — Quick Reference

| Concept | Location |
|---------|----------|
| Project memory | `PROJECT_MEMORY_SUMMARY.md` |
| Team logs | `.teams/TEAM_XXX_*.md` |
| Open questions | `.questions/TEAM_XXX_*.md` |
| Global TODOs | `TODO.md` |
| Steering rules | `.kiro/steering/` |

---

## Team Log File Format

```markdown
# TEAM_XXX — <Short Title>

**Date:** YYYY-MM-DD
**Status:** In Progress | Complete | Blocked

## Goal
What this team was asked to do.

## Changes Made
- File: reason

## Problems Encountered
- Description + resolution

## Handoff Notes
What the next team needs to know.
```

---

## Key Lessons (Do Not Repeat These Mistakes)

| Mistake | Fix |
|---------|-----|
| Using `subcategory` terminology | Always use `subtopic` — table is `question_subtopics` |
| Neon URL as psql string | Must be HTTP URL: `https://...neon.tech/...` |
| Embedding API in frontend worker | Separate workers — frontend proxies to API worker |
| Using categories/subcategories for exam filtering | Use direct `topicId` filtering (TEAM_019) |
| html-to-image blank output | Set `position: static` + `backgroundColor` on offscreen element |
| Re-adding expired endpoints | Check TEAM_024 removed list before adding any `/db/*` endpoints |

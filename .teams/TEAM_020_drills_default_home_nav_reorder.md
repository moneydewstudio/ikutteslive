# TEAM_020 — Drills Default Home + Nav Reorder

## Goal
Make Drills landing (BONUS) the default first view, reorder top and bottom navigation accordingly, and adjust Latihan (Quiz) click behavior so re-clicking after completion starts a new session.

## Baseline
- `npm run build` passed before changes.

## Plan of record
- Default landing view: `BONUS`.
- Stop auto-starting quiz on fresh load.
- Reorder nav: Drills, Latihan, Tryout, Statistik, Blog.
- Active-state mapping: Drills tab active for `BONUS` and `DRILLS`.
- Latihan click behavior:
  - Mid-quiz: resume (`view='QUIZ'`).
  - Completed: start new (`handleStartQuiz()`).

## Work log
- 2026-03-31: Baseline `npm run build` passed.
- 2026-03-31: Implemented Drills-as-home (default `view='BONUS'`), nav reorder (desktop header + bottom nav), and unified Latihan click behavior.
- 2026-03-31: Verification: `npm run build` passed after changes.
- 2026-03-31: Added CSS to prevent mobile pull-to-refresh (touch-action: none, overscroll-behavior: none).

## Handoff notes
- Run `npm run build` after changes.

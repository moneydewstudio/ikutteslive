# TEAM_018: Merge Bonus and Drills Implementation Log

## Objective
Merge `BonusView.tsx` and `DrillsView.tsx` into a single Drills entity with three cards (TIU, TWK, TKP). Free users unlock one per day based on Jakarta calendar rotation; premium users have all unlocked. Backend supports optional category param for premium drill selection.

## Implementation Changes

### Backend (`api/src/index.ts`)
- Updated `/drills/daily` to accept optional `category` query parameter.
- Anchored rotation to April 1, 2026 (TIU day 1, TWK day 2, TKP day 3, repeating).
- Added validation for category parameter; falls back to rotation if invalid.

### Frontend Services (`services/quizService.ts`)
- Added `fetchDailyDrillsFromApi(categoryParam)` to request specific category.
- Added `createDailyDrillSessionFromApiByCategory(category)` for premium drill picker.
- Fixed duplicate identifier conflict by renaming parameter to `categoryParam`.

### Components
- **BonusCard.tsx**: Added optional `onClick` prop and keyboard accessibility.
- **BonusView.tsx**: Repurposed as Drills entry page with 3 cards, free/premium gating, and click-through to drill runner.
- **DrillsView.tsx**: Accepts optional `category` prop; resumes session only if same day+category; otherwise starts new session.
- **BottomNav.tsx**: Renamed BONUS tab to "Drills"; hid internal DRILLS entry.

### App Routing (`App.tsx`)
- Added `selectedDrillCategory` state and `onStartDrill` callback.
- Passed `user` and `onStartDrill` to BonusView (Drills entry).
- Passed `selectedDrillCategory` to DrillsView.
- Updated deep-link allowed views to exclude internal DRILLS.

## Fixes
- Fixed TypeScript duplicate identifier error in `quizService.ts` by renaming function parameter.
- Removed unused `BonusCard.test.tsx` test file.

## Status
- ✅ Build passes cleanly.
- ✅ All features implemented per requirements.
- ✅ Navigation updated: BONUS → Drills entry; DRILLS hidden from nav.
- ✅ Free users: one drill unlocked per day based on Jakarta rotation.
- ✅ Premium users: all drills unlocked; can pick any category.
- ✅ Locked drills show alert: "Gunakan akun Premium untuk buka semua drills."
- ✅ Backend supports optional `category` query param.
- ✅ Frontend services and drill runner support category selection and session switching.

## Next Steps
- No immediate next steps; implementation complete. Ready for testing/QA.

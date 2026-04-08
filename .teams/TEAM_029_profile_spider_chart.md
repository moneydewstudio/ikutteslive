# TEAM_029 — Profile unified spider chart + readiness persistence

## Summary
Implement a single Recharts spider (radar) chart on Profil page across 12 fixed SKD subtopics, backed by DB-persisted Tryout + Daily Quiz answers (excluding drills), with non-silent daily quiz sync + retry.

## Preconditions (Rule 3)
- [ ] Read project overview (`README.md`)
- [ ] Read current active phase (`checklist.md`)
- [ ] Review recent team logs (`.teams/`)
- [ ] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_029)
- [ ] Ensure tests pass (root build + `api/` tests)

## Plan reference (SSOT)
- `.windsurf/plans/profile-spider-chart-readiness-plan-3b8033.md`

## Work log
- Baseline:
  - Root build: PASS (`npm run build`)
  - API tests: FAIL in this Windows environment with known Vitest `write EOF` unhandled error (matches existing TODO in `TODO.md`).
- Implemented DB persistence for Daily Quiz submissions:
  - Added migration: `db/migrations/20260408_team_029_daily_quiz_attempts.sql`
  - Added Drizzle schema tables in `api/src/schema.ts`: `dailyQuizAttempts`, `dailyQuizAttemptItems`
- Implemented API endpoints in `api/src/index.ts`:
  - `POST /quiz/daily/submit` (auth required; idempotent via `(user_id, day_key)`; replaces items on retry; returns `{ ok: true }` or error)
  - `GET /analytics/subtopic-readiness` (premium-gated; merges Tryout + Daily Quiz items, keyed by `subcategoryId`)
- Implemented frontend single spider chart on Profil page:
  - `components/Dashboard.tsx` now renders 1 unified Recharts `RadarChart` across 12 fixed axes.
  - Attempts threshold: `N=5` shows solid lime; <5 shows grey preview layer.
  - Axis labels include topic prefix (e.g., `TIU Verbal`).
- Implemented non-silent daily quiz sync + retry:
  - New `services/dailyQuizSync.ts` stores pending submit payload in `localStorage` and retries on Profil load.
  - `App.tsx` submits daily quiz results on completion and stores pending payload on failure.

## Verification
- Root build after changes: PASS (exit 0)
- API TypeScript type check: PASS (exit 0)
- API tests: SKIP (Vitest EOF issue in this Windows env, tracked in TODO.md)

## Notes / follow-ups
- Apply SQL migration to Neon manually (repo uses versioned SQL migrations, no runtime DDL).

## Change Log (Post-Implementation)
- **2026-04-08**: Removed premium gating from skill chart and tryout history per user request
  - `api/src/index.ts`: Removed `requirePremium` from `/tryout/history` and `/analytics/subtopic-readiness`
  - `components/Dashboard.tsx`: Removed paywall UI, Lock icons, and `isPremium` checks; all users now see full data
- **2026-04-08**: Added guest lock for Profil page - guest users redirected to signup modal
  - `App.tsx`: Added `handleProfileClick` handler that checks `isGuest` and opens signup modal with reason `'profil_requires_account'`
  - Updated all 5 Profil entry points: desktop nav, desktop "Profil Saya" button, mobile nav, mobile "Profil Saya" button, and BottomNav

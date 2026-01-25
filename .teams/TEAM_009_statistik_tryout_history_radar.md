# TEAM_009 — Statistik page revamp (premium tryout history + radar analytics)

## Summary
Revamp the "Statistik Saya" page to:
- Replace badges and "Sesi Terakhir" with **premium-gated** "Riwayat Tryout" (clickable rows → detail view).
- Replace "Skor Kesiapan" with **3 premium-gated radar charts** (TWK/TIU/TKP) showing **subtopic ability**.
- Add SSOT memo on how to resize global font size.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`
- Global TODO list: `TODO.md`
- Prior team logs: `.teams/`
- Open questions: `.questions/`

## Locked decisions (SSOT-ready)
- Gating:
  - Riwayat Tryout + radar charts are **premium-gated**.
  - Endpoints `/tryout/history` and `/analytics/*` must be protected by `requirePremium`.
- TKP metric:
  - Per item contribution = `selected_weight / max_weight`.
  - Subtopic ability = **average** of ratios.
  - Display as percentage (`×100`).
  - UI must not use “correct/incorrect” wording for TKP.
- Analytics scope:
  - **Tryout-only** for now.
  - Persist only during `POST /exam/:examId/submit`.
  - Schema should allow future extension to `source_type`.
- UX:
  - Riwayat Tryout rows are clickable and open a minimal detail view.

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_009)
- [x] Ensure tests pass (root build + `api/` tests)

## Baseline status
- Root build: `npm run build` => PASS
- API tests: `npm run test` (in `api/`) => PASS

## Work completed
- TEAM_009: Updated SSOT (`checklist.md`) with font-size memo and locked Statistik decisions.
- TEAM_009: Added DB schema tables for tryout persistence (`api/src/schema.ts`).
- TEAM_009: Added Option A SQL migration to create Neon tables:
  - `db/migrations/202601250821_team_009_tryout_history.sql`
- TEAM_009: Persist tryout submissions in `POST /exam/:examId/submit` (best-effort) and added premium endpoints:
  - `GET /tryout/history`
  - `GET /analytics/subtopic-accuracy`
- TEAM_009: Added/updated API tests for premium gating (`api/src/index.test.ts`).
- TEAM_009: Revamped Statistik UI (`components/Dashboard.tsx`) to remove badges + Sesi Terakhir and replace readiness score with premium-gated radar charts + tryout history.

## Apply instructions (Neon)
- Apply the migration SQL in:
  - `db/migrations/202601250821_team_009_tryout_history.sql`
- Apply method:
  - Neon console → SQL Editor → paste & run
  - or `psql "$NEON_DATABASE_URL" -f db/migrations/202601250821_team_009_tryout_history.sql`
- After applying, new tryout submissions will start being recorded and will power:
  - `GET /tryout/history`
  - `GET /analytics/subtopic-accuracy`

## Handoff checklist
[x] Build passes
[x] Tests pass
[ ] Regression tests pass
[ ] Team log updated
[ ] TODOs documented

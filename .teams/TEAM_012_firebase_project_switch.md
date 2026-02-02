# TEAM_012 — Firebase project switch (ikuttes-64d28 -> ikuttes)

## Summary
Switch the codebase Firebase configuration from the non-existent `ikuttes-64d28` project to the existing Firebase project `ikuttes`, ensuring frontend auth + Worker JWT verification stay aligned and localhost works against real Firebase (no emulators).

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
- [x] Claim team number (TEAM_012)
- [x] Ensure tests pass

## Baseline status
- Root build: `npm run build` => PASS (before + after changes)
- API tests: `npm run test` (in `api/`) => PASS (before + after changes)

## Work completed

- TEAM_012: Identified mismatch between codebase Firebase project (`ikuttes-64d28`) and actual Firebase CLI project (`ikuttes`).
- TEAM_012: Verified canonical Firebase web app config for `ikuttes` via Firebase CLI:
  - `firebase apps:list --project ikuttes`
  - `firebase apps:sdkconfig WEB <appId> --project ikuttes`
- TEAM_012: Updated frontend Firebase initialization to use Vite env vars (instead of hardcoded config) in `services/firebase.ts`.
- TEAM_012: Added typed declarations for `VITE_FIREBASE_*` env vars in `vite-env.d.ts`.
- TEAM_012: Added `VITE_FIREBASE_*` values for `ikuttes` to `.env.local` and `.env.production`.
- TEAM_012: Ensured Firebase CLI default project is `ikuttes` via `.firebaserc`.
- TEAM_012: Updated Worker config `api/wrangler.jsonc` to align JWT verification issuer/audience by setting `FIREBASE_PROJECT_ID` to `ikuttes` and removing committed `NEON_DATABASE_URL` from `vars`.
- TEAM_012: Updated `api/.dev.vars` to include `FIREBASE_PROJECT_ID=ikuttes` for local Worker test/dev.

- TEAM_012: Enabled premium flag hydration in the frontend by calling `POST /auth/sync` after Firebase login and mapping `is_premium` -> `user.isPro`.

## Premium unlock (for manual user testing)

**Source of truth:** Neon Postgres `users.is_premium` (not Firestore).

**Flow:**
- User signs in with Firebase Auth (Google).
- Frontend calls `POST /auth/sync` (Worker).
- Worker verifies Firebase ID token and upserts user row in Neon.
- Worker returns `{ userId, is_premium }`.
- Frontend sets `user.isPro = is_premium` which unlocks Statistik premium UI.

**How to grant premium to your account (manual):**
- Ensure you have a `users` row (login once so `/auth/sync` runs).
- In Neon SQL editor run:

```sql
update users
set is_premium = true
where id = '<YOUR_FIREBASE_UID>';
```

**Verify:**
- Refresh the frontend; Statistik should show "Akun Premium".
- `GET /tryout/history` and `GET /analytics/subtopic-accuracy` should return `200` (not `403`).

## TODOs / follow-ups

- TODO(TEAM_012): Cloudflare deploy is required for the Worker change to take effect in production (cannot be done here due to wrangler auth/network issues).
- TODO(TEAM_012): Ensure Firebase Auth authorized domains include `localhost` for popup sign-in to work locally (Firebase Console -> Authentication -> Settings -> Authorized domains).
- TODO(TEAM_012): In Cloudflare Worker production, set `NEON_DATABASE_URL` via `wrangler secret put NEON_DATABASE_URL` (do not keep it in `wrangler.jsonc`).

## Handoff checklist
- [x] Build passes
- [x] Tests pass
- [x] Regression tests pass
- [x] Team log updated
- [x] TODOs documented

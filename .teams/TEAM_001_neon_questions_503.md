# TEAM_001 — Neon questions 503

## Summary
Investigate and fix intermittent and deployed `503 Service Unavailable` responses from `GET /questions/random`, which prevents the frontend practice (Latihan) flow from loading questions from Neon DB.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`

## Preconditions (Rule 3)
- [x] Read project overview / execution checklist (`checklist.md`)
- [x] Read current active phase (Phase I is defined in `checklist.md`)
- [x] Review recent team logs (`.teams/` was empty)
- [x] Review open questions (`.questions/` not present)
- [x] Claim team number (TEAM_001)
- [ ] Ensure tests pass (to run: `api: npm test`, root: no test script)

## Observations
- `GET /questions/random` sometimes returns `200` then later `503` after worker reload.
- Both local and deployed Workers show Neon fetch failures.
- Current handler swallows the root error (catches without logging) and returns `503 { error: 'unavailable' }`.
- `api/src/db.ts` currently runs schema creation/migrations via `ensureDatabase()` on every cold start / reload, including `CREATE EXTENSION` and DDL.

## Root cause (confirmed)
- `question_options` schema mismatch:
  - Worker queried `question_options.label` / `question_options.text`.
  - Actual Neon schema has `question_options.option_key` / `question_options.option_text` and `questions.id` is `integer`.
  - This caused `NeonDbError: column "label" does not exist` and a `503`.

## Fixes implemented
- **Worker DB access** (`api/src/db.ts`)
  - Removed runtime schema bootstrapping/migrations from request path.
  - Set `neonConfig.fetchFunction = fetch` for edge runtime reliability.
- **Worker schema alignment** (`api/src/schema.ts`)
  - Updated to match actual Neon schema (integer ids; `question_text`; `option_key`/`option_text`; `explanation_text`).
  - Removed unused `attempts` from worker schema (dead code + prevented `uuid is not defined` crash).
- **Diagnostics** (`api/src/index.ts`)
  - Added server-side logging for `/questions/random` and `/auth/sync` failures.
- **Secrets hygiene** (`api/wrangler.jsonc`)
  - Removed committed `NEON_DATABASE_URL` value; it must be provided via `.dev.vars` (local) and Wrangler secret (prod).

## Hypotheses
- Runtime schema migration (`ensureDatabase/ensureSchema`) is intermittently failing (permissions / extension creation / DDL locks), causing `503`.
- Lack of error logging makes diagnosis hard.

## Next steps
- Run `api` tests (`npm test` in `api/`).
- Remove runtime schema creation from the Worker DB path; keep schema management as an explicit offline step.
- Add minimal error logging in `/questions/random` and `/db/ping` to reveal underlying errors (without leaking secrets).
- Verify locally (`wrangler dev`) and via deployed logs.

## Verification
- Local `wrangler dev`:
  - `GET /db/ping` => `200 { ok: true, response: "pong" }`
  - `GET /questions/random?limit=2` => `200` with options and `correct_option_id`
- Frontend build:
  - `npm run build` (repo root) => success

## Remaining work
- Frontend UX for transient API failures (show error state instead of blank screen when `/questions/random` fails).
- Deployed worker: ensure `NEON_DATABASE_URL` is set as a Wrangler secret and re-deploy; verify logs show no query errors.

## Handoff checklist
- [ ] Build passes
- [ ] Tests pass
- [ ] Regression tests pass
- [ ] Team log updated
- [ ] TODOs documented

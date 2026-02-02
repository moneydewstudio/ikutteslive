# TEAM_013 — Tryout/Drill cannot load questions

## Summary
Investigate and fix a regression where Tryout and Drills fail to load questions.

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
- [x] Claim team number (TEAM_013)
- [x] Ensure tests pass (`api/` + root build)

## Baseline status
- Root build: `npm run build` => PASS
- API tests: `npm test -- --run` (api/) => PASS

## Findings
- Frontend is configured to use deployed Worker via `.env.local`:
  - `VITE_API_BASE=https://ikuttes.robimaulanaspsi.workers.dev`
- Deployed API Worker is reachable, but DB is not configured:
  - `GET /health` => `200 {"ok":true}`
  - `GET /db/ping` => `500 {"ok":false,"error":"NEON_DATABASE_URL is not configured"}`
  - `GET /drills/daily` => `503 {"error":"unavailable"}`
  - `POST /exam/start` => `503 {"error":"unavailable"}`

Conclusion: Tryout/Drills cannot load questions because the deployed API Worker is missing the `NEON_DATABASE_URL` secret.

- Tryout scoring returning `0` can happen when:
  - Category codes are missing/mismatched (`question_categories.code` not `TWK/TIU/TKP`), and the scoring logic depends on exact string matches.
  - `question_options.is_correct` is not populated for the dataset, so correctness comparison always fails.

- Mobile Tryout view could not scroll because the Tryout overlay wrapper used `overflow-hidden` on all breakpoints.

## Work completed
- Reproduced failures against the deployed Worker and confirmed the root cause is missing `NEON_DATABASE_URL`.

- TEAM_013: Fixed tryout scoring robustness in `api/src/index.ts`:
  - Normalize category using `subjectSelect` fallback and uppercasing.
  - For TWK/TIU: compute correctness using `resolveCorrectOptionKey()`:
    - prefer explicit `is_correct=true`
    - else fall back to highest positive `weight` (only if present)
  - Score TWK/TIU as correct-count (1 point per correct) and scale passing thresholds accordingly.

- TEAM_013: Enabled Tryout scroll on mobile only in `components/TryoutView.tsx` by using `overflow-y-auto md:overflow-hidden`.

## Verification
- After setting the secret, these should work:
  - `GET /db/ping` => `{ ok: true, response: "pong" }`
  - `GET /drills/daily` => `200` with non-empty `questions`
  - `POST /exam/start` => `200` with `examId`

- Local verification (repo):
  - Root build: `npm run build` => PASS
  - API tests: `npm test -- --run` (api/) => PASS

- Manual tryout verification:
  - Start Tryout, answer at least 1 TWK/TIU question correctly.
  - Submit.
  - Expect `sections.TWK` or `sections.TIU` to be > 0 (not all zeros).

Note: backend scoring changes require deploying the API Worker to production to take effect.

## TODOs / follow-ups
- Configure the Worker secret in production.
- (Optional) Configure `TRYOUT_TOKEN_SECRET` in production (separate security TODO; not required to load questions).

## Fix (production)

Set the `NEON_DATABASE_URL` secret for the deployed API Worker:

From repo root:

```
npx wrangler secret put NEON_DATABASE_URL -c api/wrangler.jsonc
```

Or from the `api/` directory:

```
npx wrangler secret put NEON_DATABASE_URL
```

## Alternative fix (local API dev)

- Run API worker locally: `npm run dev` (in `api/`)
- Point frontend to it:
  - set `VITE_API_BASE=http://localhost:8787` in `.env.local`

## Handoff checklist
- [x] Build passes
- [x] Tests pass
- [x] Regression tests pass
- [x] Team log updated
- [x] TODOs documented

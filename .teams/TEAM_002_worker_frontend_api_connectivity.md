# TEAM_002 — Frontend/API connectivity investigation

## Summary
Deployed frontend shows `TypeError: Failed to fetch` because the production bundle is still using the fallback API base URL (`http://localhost:8787`) when `VITE_API_BASE` is not set at build time.

Separately, the deployed API Worker at `https://ikuttes.robimaulanaspsi.workers.dev` is reachable and CORS preflight succeeds, but DB calls fail because `NEON_DATABASE_URL` is not configured as a Worker secret.

## Evidence
- Frontend bundle contains `VITE_API_BASE || "http://localhost:8787"`.
- `curl https://ikuttes.robimaulanaspsi.workers.dev/db/ping` returns 500 with `NEON_DATABASE_URL is not configured`.
- CORS preflight to `/questions/random` returns 204 with `access-control-allow-headers: authorization,content-type`.

## Changes made
- TEAM_002: Updated `services/apiClient.ts` to use `import.meta.env.VITE_API_BASE` directly (Vite-injectable) and only fall back to `http://localhost:8787` in dev.
- TEAM_002: Added `vite-env.d.ts` so the frontend build is type-safe with `import.meta.env`.
- TEAM_002: Added `.env.production` with `VITE_API_BASE=https://ikuttes.robimaulanaspsi.workers.dev`.

## Verification
- API: `GET https://ikuttes.robimaulanaspsi.workers.dev/db/ping` returns `{ ok: true, response: "pong" }`.
- Frontend deploy now serves `assets/index-CTwXAEQz.js` and the bundle contains `"https://ikuttes.robimaulanaspsi.workers.dev"` (no `localhost:8787` literal).

## Notes
- If the browser still reports `index-2l7TPMbT.js:1464` and calls `localhost:8787`, it is loading a cached *old* HTML/JS pair. Fix via hard refresh (disable cache) or open an incognito window.

## Fix plan
- Set `NEON_DATABASE_URL` secret for the `ikuttes` API Worker (must be a raw `postgresql://...` URL; no `psql` prefix/quotes).
- Ensure frontend build-time env sets `VITE_API_BASE=https://ikuttes.robimaulanaspsi.workers.dev` and redeploy the frontend Worker.

## Handoff checklist
- [ ] Build passes
- [ ] Tests pass
- [ ] Regression tests pass
- [ ] Team log updated
- [ ] TODOs documented

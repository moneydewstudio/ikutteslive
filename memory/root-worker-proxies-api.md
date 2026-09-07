---
name: root-worker-proxies-api
description: Root wrangler.jsonc + worker.ts is a proxy-only worker; Hono routes live in api/
metadata:
  type: project
---

The project has two Cloudflare Workers:
1. **`ikuttes-frontend`** (root `wrangler.jsonc` + `worker.ts`) — serves the Vite-built SPA from `dist/` and proxies a whitelist of API paths to the `ikuttes` worker
2. **`ikuttes`** (`api/wrangler.jsonc` + `api/src/index.ts`) — Hono app with all the actual API logic

The root `worker.ts` proxy whitelist at line 21-32:
```ts
if (url.pathname.startsWith('/drills/') || url.pathname.startsWith('/quiz/') || /* ... */) {
  // proxy to https://ikuttes.robimaulanaspsi.workers.dev
}
```

`/webhook/qris` is NOT in the whitelist, so the root worker falls through to `env.ASSETS.fetch(request)` (the SPA) and returns 200 with `index.html`. **That's why a 404 in Hono looked like `Ok` in the edge logs** during the QRIS-ify integration — Cloudflare's edge `Ok` means the request reached the worker, not that the route matched.

**Why:** Two-worker architecture isolates the SPA bundle from the API bundle and lets them scale independently. The proxy is intentional for CORS-free same-origin access from the SPA.

**How to apply:** When adding new API routes, decide:
- If it's a payment/admin/webhook/internal endpoint → add to `api/src/index.ts` only. Don't add to root `worker.ts` whitelist. The proxy in root `worker.ts` is for SPA→API calls that need to be same-origin (auth headers via cookies).
- If it's SPA-facing public data → consider whether to also add to root `worker.ts` whitelist (e.g. `/drills/`, `/themes/`) so the SPA can call it without cross-origin.
- Always test new routes with `wrangler tail` from both workers in separate terminals to confirm which one handled the request.

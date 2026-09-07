---
name: qrisify-singular-route
description: QRIS-ify webhook URL is singular /webhook/qris, not plural
metadata:
  type: feedback
---

QRIS-ify fires webhooks at `/webhook/qris` (singular). My initial code registered `app.post('/webhooks/qris', ...)` (plural) — webhook silently 200'd through the SPA fallback (Cloudflare's `Ok` log line), the handler never ran, and no premium was granted. Spent 30 min debugging before noticing the route mismatch in the spec.

**Why:** Spec-mandated, easy to misread. The trailing `s` muscle-memory from `/payments`, `/webhooks`, etc. bites.

**How to apply:** Register as `app.post('/webhook/qris', ...)` in api/src/index.ts. Update setup-qrisify.mjs default URL to `.../webhook/qris` (singular). Always copy webhook URL verbatim from QRIS-ify docs.

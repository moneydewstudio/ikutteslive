---
name: qrisify-sandbox-key
description: QRIS-ify uses two API keys — qris_live_ and qris_test_ — for production vs sandbox
metadata:
  type: project
---

QRIS-ify has two API key prefixes: `qris_live_...` (real money) and `qris_test_...` (sandbox). The `mode: TEST` vs `LIVE` on a transaction is determined entirely by which key you used to create it. The `/api/v1/transactions/:id/test-pay` endpoint only works on TEST-mode transactions — calling it on a LIVE one returns 403.

**Why:** Avoid charging real users during testing. The QRIS-ify dashboard has separate Live and Test key fields; you generate them in the Merchants page.

**How to apply:** When `wrangler secret put QRISIFY_API_KEY`, paste the `qris_test_...` key for sandbox. Switch to `qris_live_...` for production. Never reuse the test key in production deploys.

---
name: qrisify-qr-proxy
description: Always proxy QRIS-ify image responses through own API worker; never put qrisify URL in <img src>
metadata:
  type: project
---

QRIS-ify does not send `Access-Control-Allow-Origin` on their `/api/v1/transactions/:id/qr` PNG response. When the frontend's `<img src="https://qrisify.adihub.my.id/...">` fires, the browser's CORB blocks the response (status 200, but `net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`). The image either never renders or breaks shortly after.

**Why:** Cross-origin resource policy + CORB. Cross-origin `<img>` for *display* should normally work, but Chrome treats PNGs from opaque origins as suspicious when fetched with a non-`no-cors` mode, and modern fetch() defaults to `cors` mode.

**How to apply:** Always proxy the image through the same origin. In `api/src/index.ts`:
- `GET /payments/:id/qr` — fetches from QRIS-ify server-side, returns the PNG body
- Store the proxy URL in `payments.qrisify_qr_image_url` and `POST /payments` response, not the raw QRIS-ify URL
- Set `Cache-Control: public, max-age=60` so the browser doesn't refetch on every modal poll
- No auth on the proxy route — UUIDs are unguessable and the QR is non-sensitive (anyone scanning pays for you, that's their problem)

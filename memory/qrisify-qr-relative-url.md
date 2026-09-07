---
name: qrisify-qr-relative-url
description: QRIS-ify returns qr_image_url as relative path "transactions/<id>/qr", not a full URL
metadata:
  type: project
---

The QRIS-ify `/api/v1/transactions` response includes `qr_image_url: "transactions/<id>/qr"` — a *relative* path, not `https://qrisify.adihub.my.id/api/v1/transactions/<id>/qr`. If you store or display this URL as-is, the browser resolves it relative to your own domain → 404.

**Why:** Convenience for the QRIS-ify frontend (which is on the same origin), but a footgun for third-party integrators. The OpenAPI spec uses `format: uri` which suggests a full URL, but the actual response is relative.

**How to apply:** Always normalize before storing or returning:
```ts
const qrImageUrl = /^https?:\/\//.test(txn.qr_image_url)
  ? txn.qr_image_url
  : `${QRISIFY_BASE}/${txn.qr_image_url.replace(/^\/+/, '')}`;
```
But since you also need a proxy anyway (see [[qrisify-qr-proxy]]), the cleanest path is to store the proxy URL (`/payments/<id>/qr`) directly, constructed from your own internal payment ID. No URL massaging needed.

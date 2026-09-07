---
name: qrisify-idempotency
description: QRIS-ify retries webhooks 5 times; webhook handler must be re-delivery-safe
metadata:
  type: project
---

Per the QRIS-ify spec: "Webhook di-retry otomatis jika endpoint tidak merespons 2xx: 5 percobaan dengan interval 10 detik, 30 detik, 2 menit, 10 menit, 30 menit." They also note: "QRIS-ify memungkinkan pengiriman ulang webhook (otomatis via retry atau manual via dashboard)."

Initial webhook handler gated the SQL UPDATE on `where p.status = 'pending'`. After the first SUCCESS delivery, the row was `confirmed`, so re-deliveries matched zero rows and silently no-op'd. Worse, if the first delivery actually succeeded but the response got lost (e.g. Cloudflare edge timeout), the next delivery would also no-op and the user never gets premium.

**Why:** At-least-once delivery semantics. Always design for re-delivery, not first-time-only.

**How to apply:** Use `where p.status in ('pending', 'confirmed')` in the UPDATE. Idempotency comes from the user already having `premium_until` extended — re-extending from a still-valid future timestamp is a no-op, but extending from an expired timestamp correctly re-grants. The `purchase_count = + 1` line is the only real concern; if re-deliveries cause double-counting, add a `last_confirmed_at` column and skip the increment if `now() - last_confirmed_at < interval '5 minutes'`.

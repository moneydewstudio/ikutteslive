---
name: qrisify-amount-override
description: QRISIFY_PLAN_3_DAY_AMOUNT and QRISIFY_PLAN_30_DAY_AMOUNT env vars override default prices for sandbox testing
metadata:
  type: project
---

In `api/src/index.ts`:
```ts
const DEFAULT_PLAN_AMOUNT: Record<PlanType, number> = { '3_day': 9900, '30_day': 19000 };
const planBaseAmount = (c: any, planType: PlanType) => {
  const key = planType === '3_day' ? 'QRISIFY_PLAN_3_DAY_AMOUNT' : 'QRISIFY_PLAN_30_DAY_AMOUNT';
  const override = Number(c.env?.[key]);
  return Number.isFinite(override) && override > 0 ? override : DEFAULT_PLAN_AMOUNT[planType];
};
```

Set `QRISIFY_PLAN_3_DAY_AMOUNT=1` to trigger the webhook with a 1 IDR payment (sandbox only — real `qris_live_` keys would charge real money). Read at request time, not module init, so a `wrangler secret put` change is picked up without a code change. Env name is per-plan, so you can override one or both.

**Why:** Avoid charging real users while testing the webhook flow. The QRIS-ify `/test-pay` endpoint simulates payment success without moving money, but the amount still has to be valid for their payment provider sandbox.

**How to apply:** For sandbox testing:
```bash
cd api
wrangler secret put QRISIFY_PLAN_3_DAY_AMOUNT   # paste: 1
# ... trigger payment, watch tail ...
wrangler secret delete QRISIFY_PLAN_3_DAY_AMOUNT   # back to default 9900
```
The `scripts/setup-qrisify.mjs` script has an optional prompt for this.

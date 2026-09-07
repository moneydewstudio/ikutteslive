---
name: require-admin-disabled
description: requireAdmin() in api/src/index.ts is hardcoded to return true — anyone can hit /admin/* routes
metadata:
  type: project
---

Line 116 of `api/src/index.ts`:
```ts
const requireAdmin = (c: any) => true;
```

It's commented as "TEMPORARILY DISABLED: allow access without admin key for debugging." This means anyone who knows the route shape can call `/admin/payments/...` to confirm/expire/cancel payments without `x-admin-key`. **Do not ship to production** with money flowing through payments.

**Why:** Defense-in-depth on payment operations. The UI is gated by `user.email === 'pojok.sepak@gmail.com'` (convenience only) — the backend was supposed to be the real check.

**How to apply:** Replace with a proper check that reads `c.env.ADMIN_KEY` and compares against the `x-admin-key` header. Pattern:
```ts
const requireAdmin = (c: any) => {
  const expected = String(c.env.ADMIN_KEY || '');
  if (!expected) return false;
  return c.req.header('x-admin-key') === expected;
};
```
Then `wrangler secret put ADMIN_KEY` to a strong random string. Do this before flipping `QRISIFY_API_KEY` to live mode.

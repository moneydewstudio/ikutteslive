import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../types';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { getDb } from '../db';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

// Extract Bearer token
const getBearer = (authHeader?: string | null) => {
  if (!authHeader) return null;
  const m = authHeader.match(/^Bearer\s+([^\s]+)$/i);
  return m ? m[1] : null;
};

export const withUserContext: MiddlewareHandler<AppEnv> = async (c, next) => {
  const token = getBearer(c.req.header('authorization'));
  const projectId = c.env.FIREBASE_PROJECT_ID;

  if (!token || !projectId) {
    return next();
  }

  try {
    const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = String(payload.sub || '');
    const email = (payload as JWTPayload & { email?: string }).email;

    // Try DB lookup to enrich with premium flag; if DB unavailable, default false
    let is_premium = false;
    try {
      const db = await getDb({ NEON_DATABASE_URL: c.env.NEON_DATABASE_URL });
      const res = await db.select({ isPremium: users.isPremium }).from(users).where(eq(users.id, uid)).limit(1);
      if (res.length > 0) is_premium = !!res[0].isPremium;
    } catch {
      // swallow errors to avoid blocking requests if DB is not configured locally
    }

    c.set('user', { id: uid, email, is_premium });
  } catch (e) {
    // ignore invalid tokens, treat as anonymous
  }

  await next();
};

export const requirePremium: MiddlewareHandler<AppEnv> = async (c, next) => {
  const user = c.get('user');
  if (!user?.is_premium) {
    return c.json({ error: 'forbidden', code: 'PREMIUM_REQUIRED', status: 'locked', preview: 'Upgrade required' }, 403);
  }
  await next();
};

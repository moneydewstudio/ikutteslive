import { describe, expect, it } from 'vitest';
import app from './index';

// TEAM_004: add minimal API smoke tests so `npm test` passes and we have baseline regression coverage

describe('api smoke', () => {
  it('GET /health returns ok', async () => {
    const res = await app.request('http://localhost/health', {}, {
      FIREBASE_PROJECT_ID: '',
      NEON_DATABASE_URL: '',
    } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it('GET /tryout/history is premium-gated', async () => {
    const res = await app.request('http://localhost/tryout/history', {}, {
      FIREBASE_PROJECT_ID: '',
      NEON_DATABASE_URL: '',
    } as any);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json?.code).toBe('PREMIUM_REQUIRED');
  });

  it('GET /analytics/subtopic-accuracy is premium-gated', async () => {
    const res = await app.request('http://localhost/analytics/subtopic-accuracy', {}, {
      FIREBASE_PROJECT_ID: '',
      NEON_DATABASE_URL: '',
    } as any);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json?.code).toBe('PREMIUM_REQUIRED');
  });
});

import { describe, expect, it } from 'vitest';
import app from './index';
import { resolveCorrectOptionKey } from './index';
import * as schema from './schema';

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
    const json = (await res.json()) as any;
    expect(json?.code).toBe('PREMIUM_REQUIRED');
  });

  it('GET /analytics/subtopic-accuracy is premium-gated', async () => {
    const res = await app.request('http://localhost/analytics/subtopic-accuracy', {}, {
      FIREBASE_PROJECT_ID: '',
      NEON_DATABASE_URL: '',
    } as any);

    expect(res.status).toBe(403);
    const json = (await res.json()) as any;
    expect(json?.code).toBe('PREMIUM_REQUIRED');
  });

  it('exports questionThemes table', () => {
    expect(schema).toHaveProperty('questionThemes');
  });
});

describe('tryout scoring', () => {
  it('resolveCorrectOptionKey prefers explicit correct option', () => {
    const key = resolveCorrectOptionKey([
      { key: 'a', isCorrect: null, weight: null },
      { key: 'b', isCorrect: true, weight: null },
      { key: 'c', isCorrect: null, weight: 10 },
    ]);
    expect(key).toBe('b');
  });

  it('resolveCorrectOptionKey falls back to highest positive weight when explicit correct is missing', () => {
    // TEAM_013: dataset fallback for TKP-like scoring when `is_correct` is not populated
    const key = resolveCorrectOptionKey([
      { key: 'a', isCorrect: null, weight: 1 },
      { key: 'b', isCorrect: null, weight: 5 },
      { key: 'c', isCorrect: null, weight: 3 },
    ]);
    expect(key).toBe('b');
  });

  it('resolveCorrectOptionKey returns null when there is no explicit correct and no positive weights', () => {
    const key = resolveCorrectOptionKey([
      { key: 'a', isCorrect: null, weight: null },
      { key: 'b', isCorrect: null, weight: 0 },
      { key: 'c', isCorrect: null, weight: -1 },
    ]);
    expect(key).toBe(null);
  });
});

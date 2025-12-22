/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './types';
import { withUserContext, requirePremium } from './middleware/auth';
import { getDb } from './db';
import { users, questions, questionOptions, questionCategories, questionExplanations } from './schema';
import { eq, inArray, desc } from 'drizzle-orm';

const app = new Hono<AppEnv>();

// Attach user context for all requests (non-blocking if token missing/invalid)
app.use(cors());
app.use(withUserContext);

app.get('/health', (c) => c.json({ ok: true }));

app.get('/db/ping', async (c) => {
  try {
    const db = await getDb(c.env);
    const result = await db.execute("SELECT 'pong'::text as response");
    return c.json({ ok: true, response: (result.rows?.[0] as { response: string } | undefined)?.response ?? null });
  } catch (error) {
    return c.json({ ok: false, error: error instanceof Error ? error.message : 'unknown error' }, 500);
  }
});

app.post('/auth/sync', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  try {
    const db = await getDb(c.env);
    const existing = await db
      .select({ id: users.id, isPremium: users.isPremium })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({ id: user.id, email: user.email ?? null });
      return c.json({ userId: user.id, is_premium: false });
    }

    return c.json({ userId: user.id, is_premium: !!existing[0].isPremium });
  } catch (e) {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/user/me', (c) => {
  const user = c.get('user');
  if (!user) return c.json({ id: null, is_premium: false });
  return c.json(user);
});

app.get('/questions/random', async (c) => {
  const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') ?? '5')));
  const category = c.req.query('category') as 'TIU' | 'TWK' | 'TKP' | undefined;

  try {
    const db = await getDb(c.env);
    const base = db
      .select({
        id: questions.id,
        subject: questionCategories.code,
        difficulty: questions.difficulty,
        text: questions.stem,
      })
      .from(questions)
      .leftJoin(questionCategories, eq(questions.categoryId, questionCategories.id));

    const query = category ? base.where(eq(questionCategories.code, category)) : base;

    const rows = await query.limit(limit);
    const ids = rows.map((r) => r.id);

    let opts: { questionId: string; label: string; text: string }[] = [];
    if (ids.length) {
      const result = await db
        .select({ questionId: questionOptions.questionId, label: questionOptions.label, text: questionOptions.text })
        .from(questionOptions)
        .where(inArray(questionOptions.questionId, ids));
      opts = result as unknown as { questionId: string; label: string; text: string }[];
    }

    const grouped: Record<string, { id: string; text: string }[]> = {};
    for (const o of opts) {
      if (!grouped[o.questionId]) grouped[o.questionId] = [];
      grouped[o.questionId].push({ id: o.label.toLowerCase(), text: o.text });
    }

    const payload = rows.map((r) => ({
      id: r.id,
      subject: (r.subject as unknown as string) ?? null,
      difficulty: r.difficulty,
      text: r.text,
      image_url: null,
      options: grouped[r.id] ?? [],
    }));

    return c.json(payload);
  } catch {
    // Fallback demo data without explanations
    return c.json([
      {
        id: 'demo1',
        subject: 'TIU',
        difficulty: 3,
        text: '1 + 1 = ?',
        image_url: null,
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '2' },
          { id: 'c', text: '3' },
          { id: 'd', text: '4' },
          { id: 'e', text: '5' },
        ],
      },
      {
        id: 'demo2',
        subject: 'TWK',
        difficulty: 2,
        text: 'Ibu kota Indonesia?',
        image_url: null,
        options: [
          { id: 'a', text: 'Bandung' },
          { id: 'b', text: 'Jakarta' },
          { id: 'c', text: 'Surabaya' },
          { id: 'd', text: 'Medan' },
          { id: 'e', text: 'Makassar' },
        ],
      },
    ]);
  }
});

app.get('/explanations/:id', requirePremium, async (c) => {
  const id = c.req.param('id');
  try {
    const db = await getDb(c.env);
    const res = await db
      .select({ content: questionExplanations.content, tier: questionExplanations.tier })
      .from(questionExplanations)
      .where(eq(questionExplanations.questionId, id))
      .orderBy(desc(questionExplanations.tier))
      .limit(1);
    if (!res.length) return c.json({ error: 'not_found' }, 404);
    return c.json({ explanation: res[0].content, tier: res[0].tier });
  } catch {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/analytics/weakness', requirePremium, (c) => c.json({ data: [] }));
app.get('/rank/percentile', requirePremium, (c) => c.json({ percentile: 0 }));
app.post('/exam/start', requirePremium, (c) => c.json({ status: 'started' }));

export default app;

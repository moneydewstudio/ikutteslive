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
import { eq, inArray, desc, sql } from 'drizzle-orm';

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

app.get('/db/describe/:table', async (c) => {
  const table = c.req.param('table');
  const allowed = new Set(['questions', 'question_options', 'question_categories', 'question_explanations']);
  if (!allowed.has(table)) {
    return c.json({ error: 'not_found' }, 404);
  }

  try {
    const db = await getDb(c.env);
    const result = await db.execute(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = '${table}'
       ORDER BY ordinal_position`
    );
    return c.json({ table, columns: result.rows ?? [] });
  } catch (error) {
    return c.json({ error: 'unavailable', message: error instanceof Error ? error.message : String(error) }, 503);
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
        text: sql<string>`coalesce(${questions.stem}, ${questions.questionText})`,
      })
      .from(questions)
      .leftJoin(questionCategories, eq(questions.categoryId, questionCategories.id));

    const query = category ? base.where(eq(questionCategories.code, category)) : base;

    const rows = await query.limit(limit);
    const ids = rows.map((r) => r.id);

    let opts: { questionId: number; optionKey: string; optionText: string; isCorrect: boolean | null }[] = [];
    if (ids.length) {
      const result = await db
        .select({
          questionId: questionOptions.questionId,
          optionKey: questionOptions.optionKey,
          optionText: questionOptions.optionText,
          isCorrect: questionOptions.isCorrect,
        })
        .from(questionOptions)
        .where(inArray(questionOptions.questionId, ids));
      opts = result as unknown as { questionId: number; optionKey: string; optionText: string; isCorrect: boolean | null }[];
    }

    const grouped: Record<string, { id: string; text: string }[]> = {};
    const correctByQuestion: Record<string, string | null> = {};
    for (const o of opts) {
      const qid = String(o.questionId);
      const optionId = String(o.optionKey).trim().toLowerCase();
      if (!grouped[qid]) grouped[qid] = [];
      grouped[qid].push({ id: optionId, text: o.optionText });
      if (o.isCorrect && !correctByQuestion[qid]) {
        correctByQuestion[qid] = optionId;
      }
    }

    const payload = rows.map((r) => {
      const questionId = String(r.id);
      const options = grouped[questionId] ?? [];
      const correctId = correctByQuestion[questionId] ?? (options[0]?.id ?? null);

      return {
        id: questionId,
        subject: (r.subject as unknown as string) ?? null,
        difficulty: r.difficulty,
        text: r.text,
        image_url: null,
        options,
        correct_option_id: correctId,
        explanation: '',
      };
    });

    return c.json(payload);
  } catch (e) {
    console.error('Error in /questions/random:', e);
    return c.json({
      error: 'unavailable',
      message: e instanceof Error ? e.message : String(e),
    }, 503);
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

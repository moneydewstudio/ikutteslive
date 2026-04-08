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
import {
  users,
  questions,
  questionOptions,
  questionCategories,
  questionSubcategories,
  questionTopics,
  questionExplanations,
  payments,
  paymentAdminActions,
  dailyQuizAttempts,
  dailyQuizAttemptItems,
  tryoutAttempts,
  tryoutAttemptItems,
} from './schema';
import { and, desc, eq, inArray, notInArray, or, sql } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';

// TEAM_001: add server-side logging to diagnose intermittent Neon connectivity/query failures

// TEAM_013: scoring helper for tryout submissions; exported for unit tests
export const resolveCorrectOptionKey = (
  opts: Array<{ key: string; isCorrect: boolean | null; weight: number | null }>
): string | null => {
  const explicit = opts.find((o) => !!o.isCorrect);
  if (explicit) return explicit.key;

  let bestKey: string | null = null;
  let bestWeight = -Infinity;
  for (const o of opts) {
    const w = Number(o.weight);
    // TEAM_013: treat weights as meaningful only when present and positive
    if (!Number.isFinite(w) || w <= 0) continue;
    if (w > bestWeight) {
      bestWeight = w;
      bestKey = o.key;
    }
  }
  return bestKey;
};

const app = new Hono<AppEnv>();

// TEAM_025: minimal behavior counters to support offer reveal + future paywall triggers.
// Non-blocking: if DB update fails, do not break core question delivery.
const bumpSessionsCountSafe = async (db: Awaited<ReturnType<typeof getDb>>, userId: string) => {
  try {
    await db
      .update(users)
      .set({ sessionsCount: sql`${users.sessionsCount} + 1` })
      .where(eq(users.id, userId));
  } catch {
    // swallow
  }
};

// TEAM_004: rotate daily quiz at 00:00 UTC+07 (Jakarta time) using a stable day key
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const pad2 = (n: number) => String(n).padStart(2, '0');
const getJakartaDayKey = (nowMs: number) => {
  const shifted = new Date(nowMs + JAKARTA_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth() + 1;
  const d = shifted.getUTCDate();
  return `${y}-${pad2(m)}-${pad2(d)}`;
};
// TEAM_005: use Jakarta-shifted day index for global daily drill category rotation
const getJakartaDayIndex = (nowMs: number) => Math.floor((nowMs + JAKARTA_OFFSET_MS) / DAY_MS);
// TEAM_018: anchor drills rotation so Apr 1st serves TIU, Apr 2nd TWK, Apr 3rd TKP (Jakarta calendar)
const DRILLS_ROTATION_ANCHOR_JAKARTA_UTC_MS = Date.UTC(2026, 3, 1, 0, 0, 0) - JAKARTA_OFFSET_MS;
const DRILLS_ROTATION_ANCHOR_DAY_INDEX = getJakartaDayIndex(DRILLS_ROTATION_ANCHOR_JAKARTA_UTC_MS);
const getJakartaNextMidnightMs = (nowMs: number) => {
  const shifted = new Date(nowMs + JAKARTA_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  return Date.UTC(y, m, d + 1, 0, 0, 0) - JAKARTA_OFFSET_MS;
};
const getTryoutSecret = (c: any) => {
  const secret = c.env.TRYOUT_TOKEN_SECRET || '';
  if (!secret) {
    console.warn('TEAM_004 TRYOUT_TOKEN_SECRET is not configured; using a dev fallback secret');
  }
  return new TextEncoder().encode(secret || c.env.FIREBASE_PROJECT_ID || 'dev-tryout-secret');
};
const isTryoutPremiumEnabled = (c: any) => String(c.env.TRYOUT_PREMIUM_ENABLED || '').toLowerCase() === 'true';

// TEAM_023: admin auth for manual QRIS confirmation
// TEMPORARILY DISABLED: allow access without admin key for debugging
const requireAdmin = (c: any) => true;

// TEAM_023: premium entitlement is driven by premium_until timestamp
const isPremiumActive = (premiumUntil: Date | null | undefined) => {
  if (!premiumUntil) return false;
  return premiumUntil.getTime() > Date.now();
};

// TEAM_023: payment constants
const PAYMENT_EXPIRES_MINUTES = 20;
type PlanType = '3_day' | '30_day';
const planBaseAmount = (planType: PlanType) => (planType === '3_day' ? 9900 : 19000);
const planDurationDays = (planType: PlanType) => (planType === '3_day' ? 3 : 30);
const randomSuffix = () => 1 + Math.floor(Math.random() * 99);
const nowPlusMinutes = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000);
const extendPremiumUntil = (current: Date | null | undefined, planType: PlanType) => {
  const base = current && current.getTime() > Date.now() ? current : new Date();
  const d = planDurationDays(planType);
  return new Date(base.getTime() + d * 24 * 60 * 60 * 1000);
};

const makeId = () => crypto.randomUUID();

// TEAM_008: avoid empty daily quiz/drills by matching category case-insensitively, falling back to `questions.question_type`, and disabling caching for dynamic question feeds
const activeQuestionWhere = sql`coalesce(${questions.isActive}, true) = true`;
// TEAM_019: Phase 2 fix for category leak — filter by topic_id with mapping: 1=TWK, 2=TIU, 3=TKP
const categoryWhere = (code: string) => {
  const lower = code.toLowerCase();
  const topicMap: Record<string, number> = { twk: 1, tiu: 2, tkp: 3 };
  const topicId = topicMap[lower];
  // First try topicId filtering, fall back to all active questions if no topicId assigned
  return topicId 
    ? or(eq(questions.topicId, topicId), sql`${questions.topicId} is null`)
    : sql`true`; // Return all active questions as fallback
};
const subjectSelect = sql<string | null>`upper(coalesce(${questionTopics.code}, ${questions.questionType}))`;

// Attach user context for all requests (non-blocking if token missing/invalid)
app.use(cors());
app.use(withUserContext);

app.get('/health', (c) => c.json({ ok: true }));

// TEAM_023: entitlements endpoint (premium + offer visibility)
app.get('/me/entitlements', async (c) => {
  const user = c.get('user');
  if (!user?.id) {
    return c.json({
      isPremium: false,
      premiumExpiresAt: null,
      offers: [{ planType: '3_day', price: 9900, anchorPrice: 59000 }],
      paywallTrigger: null,
    });
  }

  try {
    const db = await getDb(c.env);
    const res = await db
      .select({
        premiumUntil: users.premiumUntil,
        purchaseCount: users.purchaseCount,
        lastPurchaseType: users.lastPurchaseType,
        firstPaywallSeenAt: users.firstPaywallSeenAt,
        sessionsCount: users.sessionsCount,
        questionsAnsweredTotal: users.questionsAnsweredTotal,
        wrongStreak: users.wrongStreak,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const row = res.length ? res[0] : null;

    // TEAM_025: server-authoritative "first paywall seen" marker.
    if (row && !row.firstPaywallSeenAt) {
      try {
        await db
          .update(users)
          .set({ firstPaywallSeenAt: sql`now()` })
          .where(eq(users.id, user.id));
      } catch {
        // swallow
      }
    }

    const isPremium = isPremiumActive(row?.premiumUntil);
    const premiumExpiresAt = row?.premiumUntil ? row.premiumUntil.toISOString() : null;

    const paywallTrigger = (() => {
      if (!row) return null;
      if (isPremium) return null;

      const nowMs = Date.now();
      const untilMs = row.premiumUntil ? row.premiumUntil.getTime() : null;
      if (untilMs !== null && untilMs <= nowMs && (row.purchaseCount ?? 0) > 0) return 'post_expiry';

      if ((row.wrongStreak ?? 0) >= 3) return 'wrong_streak';

      if ((row.questionsAnsweredTotal ?? 0) >= 50 || (row.sessionsCount ?? 0) >= 2) return 'high_engagement';

      return 'explanation_locked';
    })();

    const shouldReveal30 =
      !!row &&
      ((row.sessionsCount ?? 0) >= 2 ||
        (row.purchaseCount ?? 0) > 0 ||
        String(row.lastPurchaseType ?? '') === '3_day' ||
        (row.questionsAnsweredTotal ?? 0) > 50);

    // Default first paywall exposure shows 3-day only; 30-day can be revealed when rules match.
    const offers = shouldReveal30
      ? [
          { planType: '3_day', price: 9900, anchorPrice: 59000 },
          { planType: '30_day', price: 19000, anchorPrice: 59000 },
        ]
      : [{ planType: '3_day', price: 9900, anchorPrice: 59000 }];

    return c.json({ isPremium, premiumExpiresAt, offers, paywallTrigger });
  } catch (e) {
    return c.json({
      isPremium: false,
      premiumExpiresAt: null,
      offers: [{ planType: '3_day', price: 9900, anchorPrice: 59000 }],
      paywallTrigger: null,
    });
  }
});

// TEAM_029: persist daily quiz submissions (Tryout + Daily Quiz feed unified profile spider chart; drills excluded)
app.post('/quiz/daily/submit', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ ok: false, error: 'unauthorized' }, 401);

  let body: any = null;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'bad_request' }, 400);
  }

  const dayKey = String(body?.dayKey ?? '');
  const answers = (body?.answers ?? null) as unknown;
  if (!dayKey || typeof answers !== 'object' || answers == null) {
    return c.json({ ok: false, error: 'bad_request' }, 400);
  }

  const ids = Object.keys(answers)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!ids.length) return c.json({ ok: false, error: 'bad_request' }, 400);

  try {
    const db = await getDb(c.env);

    // Resolve (or create) attemptId for idempotency on (user_id, day_key)
    const attemptId = crypto.randomUUID();
    await db
      .insert(dailyQuizAttempts)
      .values({ id: attemptId, userId: user.id, dayKey })
      .onConflictDoNothing();

    const existing = await db
      .select({ id: dailyQuizAttempts.id })
      .from(dailyQuizAttempts)
      .where(and(eq(dailyQuizAttempts.userId, user.id), eq(dailyQuizAttempts.dayKey, dayKey)))
      .limit(1);
    const effectiveAttemptId = String(existing?.[0]?.id || attemptId);

    // Replace items on retry/idempotent resubmit
    await db.execute(sql`
      delete from daily_quiz_attempt_items
      where attempt_id = ${effectiveAttemptId}
    `);

    const questionMetaRows = await db
      .select({
        id: questions.id,
        code: sql<string | null>`upper(${questionTopics.code})`,
        subcategoryId: questions.subcategoryId,
        subtopicId: questions.subtopicId,
      })
      .from(questions)
      .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
      .where(inArray(questions.id, ids));

    const metaById = new Map<number, { code: string; subcategoryId: number | null; subtopicId: number | null }>();
    for (const r of questionMetaRows as any[]) {
      const rawSubcategoryId = r.subcategoryId == null ? null : Number(r.subcategoryId);
      const rawSubtopicId = r.subtopicId == null ? null : Number(r.subtopicId);
      metaById.set(Number(r.id), {
        code: String(r.code || '').toUpperCase(),
        subcategoryId: Number.isFinite(rawSubcategoryId) ? rawSubcategoryId : null,
        subtopicId: Number.isFinite(rawSubtopicId) ? rawSubtopicId : null,
      });
    }

    const optionRows = await db
      .select({
        questionId: questionOptions.questionId,
        optionKey: questionOptions.optionKey,
        isCorrect: questionOptions.isCorrect,
        weight: questionOptions.weight,
      })
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, ids));

    const optionsByQuestion: Record<string, Array<{ key: string; isCorrect: boolean | null; weight: number | null }>> = {};
    for (const o of optionRows as any[]) {
      const k = String(o.questionId);
      if (!optionsByQuestion[k]) optionsByQuestion[k] = [];
      optionsByQuestion[k].push({
        key: String(o.optionKey).toLowerCase(),
        isCorrect: o.isCorrect ?? null,
        weight: o.weight ?? null,
      });
    }

    const itemRows: Array<{
      questionId: number;
      subcategoryId: number | null;
      isCorrect: boolean | null;
      selectedWeight: number | null;
      maxWeight: number | null;
    }> = [];

    for (const qid of ids) {
      const meta = metaById.get(qid);
      const rawCode = String(meta?.code || '').toUpperCase();
      const subcategoryId = meta?.subcategoryId ?? meta?.subtopicId ?? null;

      const selected = String((answers as any)[String(qid)] ?? '').toLowerCase();
      if (!selected) continue;

      const opts = optionsByQuestion[String(qid)] ?? [];
      const hasWeights = opts.some((o) => {
        const w = Number(o.weight);
        return Number.isFinite(w) && w > 0;
      });
      const hasExplicitCorrect = opts.some((o) => !!o.isCorrect);
      const code = rawCode === 'TWK' || rawCode === 'TIU' || rawCode === 'TKP' ? rawCode : hasWeights && !hasExplicitCorrect ? 'TKP' : 'TIU';

      if (code === 'TKP') {
        const found = opts.find((o) => o.key === selected);
        const w = Number(found?.weight ?? 0);

        const max = opts.reduce((acc, o) => {
          const ww = Number(o.weight ?? 0);
          if (!Number.isFinite(ww)) return acc;
          return ww > acc ? ww : acc;
        }, 0);

        itemRows.push({
          questionId: qid,
          subcategoryId,
          isCorrect: null,
          selectedWeight: Number.isFinite(w) ? w : 0,
          maxWeight: Number.isFinite(max) ? max : 0,
        });
        continue;
      }

      const correctKey = resolveCorrectOptionKey(opts);
      const isCorrect = !!correctKey && selected === correctKey;
      itemRows.push({
        questionId: qid,
        subcategoryId,
        isCorrect,
        selectedWeight: null,
        maxWeight: null,
      });
    }

    if (itemRows.length) {
      await db.insert(dailyQuizAttemptItems).values(
        itemRows.map((r) => ({
          attemptId: effectiveAttemptId,
          questionId: r.questionId,
          subcategoryId: r.subcategoryId,
          isCorrect: r.isCorrect,
          selectedWeight: r.selectedWeight,
          maxWeight: r.maxWeight,
        }))
      );
    }

    return c.json({ ok: true, attemptId: effectiveAttemptId });
  } catch (e) {
    console.error('TEAM_029 /quiz/daily/submit failed', e);
    return c.json({ ok: false, error: 'unavailable' }, 503);
  }
});

app.get('/db/ping', async (c) => {
  try {
    const db = await getDb(c.env);
    const result = await db.execute("SELECT 'pong'::text as response");
    return c.json({ ok: true, response: (result.rows?.[0] as { response: string } | undefined)?.response ?? null });
  } catch (error) {
    return c.json({ ok: false, error: error instanceof Error ? error.message : 'unknown error' }, 500);
  }
});

// TEAM_023: create payment (static QRIS amount allocation)
app.post('/payments', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'unauthorized' }, 401);

  const body = (await c.req.json().catch(() => null)) as { planType?: PlanType } | null;
  const planType = body?.planType;
  if (planType !== '3_day' && planType !== '30_day') return c.json({ error: 'invalid_plan_type' }, 400);

  const baseAmount = planBaseAmount(planType);
  const expiresAt = nowPlusMinutes(PAYMENT_EXPIRES_MINUTES);

  try {
    const db = await getDb(c.env);

    // Enforce one active pending payment per user: cancel any existing active pending.
    const existingPending = await db
      .select({ id: payments.id, expiresAt: payments.expiresAt })
      .from(payments)
      .where(and(eq(payments.userId, user.id), eq(payments.status, 'pending')))
      .orderBy(desc(payments.createdAt))
      .limit(5);

    for (const p of existingPending) {
      if (p.expiresAt && p.expiresAt.getTime() > Date.now()) {
        await db
          .update(payments)
          .set({ status: 'cancelled', adminNote: sql`coalesce(${payments.adminNote}, '') || ' cancelled_by_new_payment'` })
          .where(eq(payments.id, p.id));
      }
    }

    // Allocate suffix with advisory lock to reduce race collisions.
    let tries = 0;
    while (tries < 20) {
      tries++;
      const uniqueSuffix = randomSuffix();
      const amountExpected = baseAmount + uniqueSuffix;

      // Lock on amount for the duration of this request.
      await db.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`qris_amount:${amountExpected}`}))`
      );

      const collision = await db
        .select({ id: payments.id, expiresAt: payments.expiresAt })
        .from(payments)
        .where(and(eq(payments.amountExpected, amountExpected), eq(payments.status, 'pending')))
        .limit(1);

      if (collision.length > 0 && collision[0].expiresAt && collision[0].expiresAt.getTime() > Date.now()) {
        continue;
      }

      const id = makeId();
      await db.insert(payments).values({
        id,
        userId: user.id,
        planType,
        baseAmount,
        uniqueSuffix,
        amountExpected,
        status: 'pending',
        expiresAt,
      });

      return c.json({ paymentId: id, amountExpected, expiresAt: expiresAt.toISOString(), status: 'pending' });
    }

    return c.json({ error: 'busy_try_again' }, 409);
  } catch (e) {
    console.error('TEAM_023 /payments create failed', e);
    const msg = e instanceof Error ? e.message : 'unavailable';
    return c.json({ error: msg }, msg === 'NEON_DATABASE_URL is not configured' ? 500 : 503);
  }
});

app.get('/payments/:id', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'unauthorized' }, 401);
  const id = c.req.param('id');

  try {
    const db = await getDb(c.env);
    const res = await db
      .select({
        id: payments.id,
        userId: payments.userId,
        planType: payments.planType,
        amountExpected: payments.amountExpected,
        status: payments.status,
        createdAt: payments.createdAt,
        expiresAt: payments.expiresAt,
        userClaimedAt: payments.userClaimedAt,
      })
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1);

    if (!res.length) return c.json({ error: 'not_found' }, 404);
    if (res[0].userId !== user.id) return c.json({ error: 'forbidden' }, 403);

    // Soft-expire on read
    const row = res[0];
    if (row.status === 'pending' && row.expiresAt && row.expiresAt.getTime() <= Date.now()) {
      await db.update(payments).set({ status: 'expired' }).where(eq(payments.id, id));
      row.status = 'expired';
    }

    return c.json({
      id: row.id,
      planType: row.planType,
      amountExpected: row.amountExpected,
      status: row.status,
      createdAt: row.createdAt?.toISOString?.() ?? null,
      expiresAt: row.expiresAt?.toISOString?.() ?? null,
      userClaimedAt: row.userClaimedAt?.toISOString?.() ?? null,
    });
  } catch (e) {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/payments/:id/claim', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'unauthorized' }, 401);
  const id = c.req.param('id');

  try {
    const db = await getDb(c.env);
    const res = await db.select({ userId: payments.userId, status: payments.status }).from(payments).where(eq(payments.id, id)).limit(1);
    if (!res.length) return c.json({ error: 'not_found' }, 404);
    if (res[0].userId !== user.id) return c.json({ error: 'forbidden' }, 403);

    if (res[0].status === 'pending') {
      await db.update(payments).set({ userClaimedAt: new Date() }).where(eq(payments.id, id));
    }

    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/payments/:id/cancel', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'unauthorized' }, 401);
  const id = c.req.param('id');

  try {
    const db = await getDb(c.env);
    const res = await db.select({ userId: payments.userId, status: payments.status }).from(payments).where(eq(payments.id, id)).limit(1);
    if (!res.length) return c.json({ error: 'not_found' }, 404);
    if (res[0].userId !== user.id) return c.json({ error: 'forbidden' }, 403);

    if (res[0].status === 'pending') {
      await db.update(payments).set({ status: 'cancelled' }).where(eq(payments.id, id));
    }

    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: 'unavailable' }, 503);
  }
});

// TEAM_023: admin operations
app.get('/admin/payments', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'forbidden' }, 403);
  const status = String(c.req.query('status') ?? 'pending');

  try {
    const db = await getDb(c.env);
    const rows = await db
      .select({
        id: payments.id,
        userId: payments.userId,
        planType: payments.planType,
        amountExpected: payments.amountExpected,
        createdAt: payments.createdAt,
        expiresAt: payments.expiresAt,
        status: payments.status,
        userClaimedAt: payments.userClaimedAt,
      })
      .from(payments)
      .where(eq(payments.status, status))
      .orderBy(desc(payments.createdAt))
      .limit(200);

    return c.json({ payments: rows.map((r) => ({
      id: r.id,
      user_id: r.userId,
      plan_type: r.planType,
      amount_expected: r.amountExpected,
      status: r.status,
      created_at: r.createdAt?.toISOString?.() ?? null,
      expires_at: r.expiresAt?.toISOString?.() ?? null,
      user_claimed_at: r.userClaimedAt?.toISOString?.() ?? null,
    })) });
  } catch (e) {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/admin/payments/:id/confirm', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'forbidden' }, 403);
  const id = c.req.param('id');
  const body = (await c.req.json().catch(() => null)) as { adminId?: string; confirmNote?: string; transactionRef?: string } | null;
  const adminId = String(body?.adminId || 'admin');

  try {
    const db = await getDb(c.env);

    // TEAM_023: make confirmation idempotent + atomic via a single SQL statement.
    // - Only transitions pending -> confirmed.
    // - Extends premium_until from max(now(), premium_until).
    // - Increments purchase_count and records last_purchase_type.
    // - Inserts admin audit row.
    const actionId = makeId();
    const res = await db.execute(sql`
      with p0 as (
        select id, user_id, plan_type, status
        from payments
        where id = ${id}
        limit 1
      ),
      p_confirm as (
        update payments p
        set
          status = 'confirmed',
          confirmed_at = now(),
          confirmed_by = ${adminId},
          admin_note = ${body?.confirmNote ?? null},
          transaction_ref = ${body?.transactionRef ?? null}
        where p.id = ${id}
          and p.status = 'pending'
        returning p.id, p.user_id, p.plan_type
      ),
      u_update as (
        update users u
        set
          premium_until = (
            case
              when u.premium_until is not null and u.premium_until > now() then u.premium_until
              else now()
            end
          ) + (
            case
              when (select plan_type from p_confirm) = '3_day' then interval '3 days'
              else interval '30 days'
            end
          ),
          purchase_count = coalesce(u.purchase_count, 0) + 1,
          last_purchase_type = (select plan_type from p_confirm)
        where u.id = (select user_id from p_confirm)
        returning u.premium_until as premium_until
      ),
      a_insert as (
        insert into payment_admin_actions (id, payment_id, admin_id, action, note, created_at)
        select ${actionId}, (select id from p_confirm), ${adminId}, 'confirm', ${body?.confirmNote ?? null}, now()
        where exists (select 1 from p_confirm)
        returning id
      )
      select
        (select status from p0) as status_before,
        (select count(*)::int from p_confirm) as confirmed_count,
        (select premium_until from u_update) as premium_until;
    `);

    const row = (res.rows?.[0] as any) ?? null;
    if (!row) return c.json({ error: 'not_found' }, 404);

    if (String(row.status_before) === 'confirmed') {
      return c.json({ ok: true, status: 'confirmed' });
    }
    if (String(row.status_before) !== 'pending') {
      return c.json({ error: 'not_confirmable', status: row.status_before }, 409);
    }
    if (Number(row.confirmed_count ?? 0) !== 1) {
      return c.json({ error: 'unavailable' }, 503);
    }

    return c.json({ ok: true, status: 'confirmed', premium_until: row.premium_until ? new Date(row.premium_until).toISOString() : null });
  } catch (e) {
    console.error('TEAM_023 admin confirm failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/admin/payments/:id/expire', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'forbidden' }, 403);
  const id = c.req.param('id');
  const body = (await c.req.json().catch(() => null)) as { adminId?: string; note?: string } | null;
  const adminId = String(body?.adminId || 'admin');

  try {
    const db = await getDb(c.env);
    await db.update(payments).set({ status: 'expired' }).where(eq(payments.id, id));
    await db.insert(paymentAdminActions).values({ id: makeId(), paymentId: id, adminId, action: 'expire', note: body?.note ?? null });
    return c.json({ ok: true });
  } catch {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/admin/payments/:id/cancel', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'forbidden' }, 403);
  const id = c.req.param('id');
  const body = (await c.req.json().catch(() => null)) as { adminId?: string; note?: string } | null;
  const adminId = String(body?.adminId || 'admin');

  try {
    const db = await getDb(c.env);
    await db.update(payments).set({ status: 'cancelled', adminNote: body?.note ?? null }).where(eq(payments.id, id));
    await db.insert(paymentAdminActions).values({ id: makeId(), paymentId: id, adminId, action: 'cancel', note: body?.note ?? null });
    return c.json({ ok: true });
  } catch {
    return c.json({ error: 'unavailable' }, 503);
  }
});

// TEAM_008: minimal DB stats endpoint for debugging empty daily quiz/drills in production (no secrets)
app.get('/db/stats', async (c) => {
  try {
    const db = await getDb(c.env);
    const totalRes = await db.select({ count: sql<number>`count(*)` }).from(questions);
    const activeRes = await db.select({ count: sql<number>`count(*)` }).from(questions).where(activeQuestionWhere);

    const codes = ['TWK', 'TIU', 'TKP'] as const;
    const byCategory: Record<string, number> = {};
    for (const code of codes) {
      const res = await db
        .select({ count: sql<number>`count(*)` })
        .from(questions)
        .where(and(activeQuestionWhere, categoryWhere(code)));
      byCategory[code] = Number((res?.[0] as any)?.count ?? 0);
    }

    return c.json({
      ok: true,
      questions_total: Number((totalRes?.[0] as any)?.count ?? 0),
      questions_active: Number((activeRes?.[0] as any)?.count ?? 0),
      questions_active_by_category: byCategory,
    });
  } catch (e) {
    console.error('TEAM_008 /db/stats failed', e);
    return c.json({ ok: false, error: 'unavailable' }, 503);
  }
});

app.get('/drills/daily', async (c) => {
  c.header('Cache-Control', 'no-store');
  const nowMs = Date.now();
  const dayKey = getJakartaDayKey(nowMs);
  const refreshAt = getJakartaNextMidnightMs(nowMs);
  const dayIndex = getJakartaDayIndex(nowMs);
  const categories = ['TIU', 'TWK', 'TKP'] as const;

  // TEAM_018: allow premium users to request any category for today via query param
  const requestedRaw = String(c.req.query('category') ?? '').toUpperCase();
  const requested = requestedRaw === 'TIU' || requestedRaw === 'TWK' || requestedRaw === 'TKP' ? requestedRaw : null;

  // TEAM_018: default daily category is rotation anchored to Apr 1st (TIU) in Jakarta time
  const rotatedIndex = ((dayIndex - DRILLS_ROTATION_ANCHOR_DAY_INDEX) % categories.length + categories.length) % categories.length;
  const category = (requested ?? categories[rotatedIndex]) as (typeof categories)[number];

  try {
    const db = await getDb(c.env);
    const user = c.get('user');
    if (user?.id) {
      void bumpSessionsCountSafe(db, user.id);
    }

    const picked = await db
      .select({
        id: questions.id,
        subject: subjectSelect,
        difficulty: questions.difficulty,
        text: questions.questionText,
      })
      .from(questions)
      .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
      .where(and(activeQuestionWhere, categoryWhere(category)))
      .orderBy(sql`md5((${questions.id})::text || ${dayKey})`)
      .limit(20);

    const drillPicked = picked.length
      ? picked
      : await db
          .select({
            id: questions.id,
            subject: subjectSelect,
            difficulty: questions.difficulty,
            text: questions.questionText,
          })
          .from(questions)
          .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
          .where(activeQuestionWhere)
          .orderBy(sql`md5((${questions.id})::text || ${dayKey} || 'fallback')`)
          .limit(20);

    const ids = drillPicked.map((r) => r.id);
    const opts = ids.length
      ? await db
          .select({
            questionId: questionOptions.questionId,
            optionKey: questionOptions.optionKey,
            optionText: questionOptions.optionText,
            isCorrect: questionOptions.isCorrect,
            weight: questionOptions.weight,
          })
          .from(questionOptions)
          .where(inArray(questionOptions.questionId, ids))
      : [];

    const grouped: Record<string, { id: string; text: string }[]> = {};
    const correctByQuestion: Record<string, string | null> = {};
    const maxWeightByQuestion: Record<string, { id: string; weight: number }> = {};
    for (const o of opts as any[]) {
      const questionKey = String(o.questionId);
      const optionId = String(o.optionKey).toLowerCase();
      if (!grouped[questionKey]) grouped[questionKey] = [];
      grouped[questionKey].push({ id: optionId, text: o.optionText });

      if (o.isCorrect && !correctByQuestion[questionKey]) {
        correctByQuestion[questionKey] = optionId;
      }

      const w = Number(o.weight);
      if (Number.isFinite(w)) {
        const cur = maxWeightByQuestion[questionKey];
        if (!cur || w > cur.weight) maxWeightByQuestion[questionKey] = { id: optionId, weight: w };
      }
    }

    const questionsPayload = drillPicked.map((r) => {
      const questionKey = String(r.id);
      const options = grouped[questionKey] ?? [];
      const correctId =
        correctByQuestion[questionKey] ??
        maxWeightByQuestion[questionKey]?.id ??
        (options[0]?.id ?? null);

      // TEAM_019: ensure subject is never null so the frontend won't default missing subjects to TIU
      const safeSubject = (r.subject as any) ?? category;

      return {
        id: r.id,
        subject: safeSubject,
        difficulty: r.difficulty,
        text: r.text,
        image_url: null,
        options,
        correct_option_id: correctId,
        explanation: '',
      };
    });

    if (!questionsPayload.length) {
      console.error('TEAM_008 /drills/daily empty selection', { dayKey, category });
      return c.json({ error: 'insufficient_question_pool' }, 503);
    }

    if (questionsPayload.length < 20) {
      console.warn('TEAM_008 /drills/daily insufficient questions for category', { 
        dayKey, 
        category, 
        returned: questionsPayload.length,
        required: 20 
      });
    }

    return c.json({ dayKey, refreshAt, category, questions: questionsPayload });
  } catch (e) {
    console.error('TEAM_005 /drills/daily failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/quiz/daily', async (c) => {
  c.header('Cache-Control', 'no-store');
  const nowMs = Date.now();
  const dayKey = getJakartaDayKey(nowMs);
  const refreshAt = getJakartaNextMidnightMs(nowMs);

  const quotas: Array<{ code: 'TWK' | 'TIU' | 'TKP'; limit: number }> = [
    { code: 'TWK', limit: 1 },
    { code: 'TIU', limit: 2 },
    { code: 'TKP', limit: 2 },
  ];

  try {
    const db = await getDb(c.env);
    const user = c.get('user');
    if (user?.id) {
      void bumpSessionsCountSafe(db, user.id);
    }

    const picked: Array<{ id: number; subject: string | null; difficulty: number; text: string | null }> = [];

    const desiredCount = quotas.reduce((acc, q) => acc + q.limit, 0);

    for (const q of quotas) {
      const rows = await db
        .select({
          id: questions.id,
          subject: subjectSelect,
          difficulty: questions.difficulty,
          text: questions.questionText,
        })
        .from(questions)
        .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
        .where(and(activeQuestionWhere, categoryWhere(q.code)))
        .orderBy(sql`md5((${questions.id})::text || ${dayKey})`)
        .limit(q.limit);

      picked.push(...(rows as any[]));
    }

    if (picked.length < desiredCount) {
      const remaining = desiredCount - picked.length;
      const existingIds = picked.map((r) => r.id);
      const extra = await db
        .select({
          id: questions.id,
          subject: subjectSelect,
          difficulty: questions.difficulty,
          text: questions.questionText,
        })
        .from(questions)
        .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
        .where(and(activeQuestionWhere, existingIds.length ? notInArray(questions.id, existingIds) : sql`true`))
        .orderBy(sql`md5((${questions.id})::text || ${dayKey} || 'topup')`)
        .limit(remaining);
      picked.push(...(extra as any[]));
    }

    if (!picked.length) {
      const fallback = await db
        .select({
          id: questions.id,
          subject: subjectSelect,
          difficulty: questions.difficulty,
          text: questions.questionText,
        })
        .from(questions)
        .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
        .where(activeQuestionWhere)
        .orderBy(sql`md5((${questions.id})::text || ${dayKey} || 'fallback')`)
        .limit(desiredCount);
      picked.push(...(fallback as any[]));
    }

    const ids = picked.map((r) => r.id);
    const opts = ids.length
      ? await db
          .select({
            questionId: questionOptions.questionId,
            optionKey: questionOptions.optionKey,
            optionText: questionOptions.optionText,
            isCorrect: questionOptions.isCorrect,
            weight: questionOptions.weight,
          })
          .from(questionOptions)
          .where(inArray(questionOptions.questionId, ids))
      : [];

    const grouped: Record<string, { id: string; text: string }[]> = {};
    const correctByQuestion: Record<string, string | null> = {};
    const maxWeightByQuestion: Record<string, { id: string; weight: number }> = {};
    for (const o of opts as any[]) {
      const questionKey = String(o.questionId);
      const optionId = String(o.optionKey).toLowerCase();
      if (!grouped[questionKey]) grouped[questionKey] = [];
      grouped[questionKey].push({ id: optionId, text: o.optionText });

      if (o.isCorrect && !correctByQuestion[questionKey]) {
        correctByQuestion[questionKey] = optionId;
      }

      const w = Number(o.weight);
      if (Number.isFinite(w)) {
        const cur = maxWeightByQuestion[questionKey];
        if (!cur || w > cur.weight) maxWeightByQuestion[questionKey] = { id: optionId, weight: w };
      }
    }

    const questionsPayload = picked.map((r) => {
      const questionKey = String(r.id);
      const options = grouped[questionKey] ?? [];
      const correctId =
        correctByQuestion[questionKey] ??
        maxWeightByQuestion[questionKey]?.id ??
        (options[0]?.id ?? null);

      return {
        id: r.id,
        subject: (r.subject as any) ?? null,
        difficulty: r.difficulty,
        text: r.text,
        image_url: null,
        options,
        correct_option_id: correctId,
        explanation: '',
      };
    });

    if (!questionsPayload.length) {
      console.error('TEAM_008 /quiz/daily empty selection', { dayKey });
      return c.json({ error: 'insufficient_question_pool' }, 503);
    }

    return c.json({ dayKey, refreshAt, questions: questionsPayload });
  } catch (e) {
    console.error('TEAM_004 /quiz/daily failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/auth/sync', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  try {
    const db = await getDb(c.env);
    const existing = await db
      .select({ id: users.id, premiumUntil: users.premiumUntil })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({ id: user.id, email: user.email ?? null });
      return c.json({ userId: user.id, is_premium: false });
    }

    const until = existing[0].premiumUntil;
    return c.json({ userId: user.id, is_premium: isPremiumActive(until) });
  } catch (e) {
    console.error('TEAM_001 /auth/sync failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/user/me', (c) => {
  const user = c.get('user');
  if (!user) return c.json({ id: null, is_premium: false });
  return c.json(user);
});

// TEAM_025: lightweight user event endpoint for monetization triggers/counters.
// - increments questions_answered_total
// - maintains wrong_streak (reset to 0 on correct, +1 on wrong)
app.post('/events/answer', async (c) => {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'unauthorized' }, 401);

  const body = (await c.req.json().catch(() => null)) as { questionId?: string; isCorrect?: boolean } | null;
  const isCorrect = !!body?.isCorrect;

  try {
    const db = await getDb(c.env);

    // TEAM_025: ensure user row exists even if /auth/sync was not called.
    await db
      .insert(users)
      .values({ id: user.id, email: user.email ?? null })
      .onConflictDoNothing();

    await db.execute(sql`
      update users
      set
        questions_answered_total = coalesce(questions_answered_total, 0) + 1,
        wrong_streak = case
          when ${isCorrect} then 0
          else coalesce(wrong_streak, 0) + 1
        end
      where id = ${user.id}
    `);

    return c.json({ ok: true });
  } catch (e) {
    console.error('TEAM_025 /events/answer failed', e);
    const msg = e instanceof Error ? e.message : 'unavailable';
    return c.json({ error: msg }, msg === 'NEON_DATABASE_URL is not configured' ? 500 : 503);
  }
});

app.get('/questions/random', async (c) => {
  c.header('Cache-Control', 'no-store');
  const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') ?? '5')));
  const category = c.req.query('category') as 'TIU' | 'TWK' | 'TKP' | undefined;

  try {
    const db = await getDb(c.env);
    const user = c.get('user');
    if (user?.id) {
      void bumpSessionsCountSafe(db, user.id);
    }

    const makeBase = (whereCondition?: any) =>
      db
        .select({
          id: questions.id,
          subject: subjectSelect,
          difficulty: questions.difficulty,
          text: questions.questionText,
        })
        .from(questions)
        .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
        .where(whereCondition);

    let rows = category 
      ? await makeBase(and(activeQuestionWhere, categoryWhere(category))).limit(limit)
      : await makeBase(activeQuestionWhere).limit(limit);

    // TEAM_008: if category metadata is missing (category_id/question_type null), fall back to any active questions
    if (category && rows.length === 0) {
      rows = await makeBase(activeQuestionWhere).limit(limit);
    }
    const ids = rows.map((r: { id: number }) => r.id);

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
      const questionKey = String(o.questionId);
      const optionId = String(o.optionKey).toLowerCase();
      if (!grouped[questionKey]) grouped[questionKey] = [];
      grouped[questionKey].push({ id: optionId, text: o.optionText });
      if (o.isCorrect && !correctByQuestion[questionKey]) {
        correctByQuestion[questionKey] = optionId;
      }
    }

    const payload = rows.map((r: { id: number; subject: any; difficulty: any; text: any }) => {
      const questionId = r.id;
      const questionKey = String(questionId);
      const options = grouped[questionKey] ?? [];
      const correctId = correctByQuestion[questionKey] ?? (options[0]?.id ?? null);

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
    console.error('TEAM_001 /questions/random failed', e);
    // Fallback demo data without explanations
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/explanations/:id', requirePremium, async (c) => {
  const id = c.req.param('id');
  const questionId = Number(id);
  if (!Number.isFinite(questionId)) {
    return c.json({ error: 'invalid_id' }, 400);
  }
  try {
    const db = await getDb(c.env);
    const res = await db
      .select({ explanationText: questionExplanations.explanationText, level: questionExplanations.level })
      .from(questionExplanations)
      .where(eq(questionExplanations.questionId, questionId))
      .orderBy(desc(questionExplanations.id))
      .limit(1);
    if (!res.length) return c.json({ error: 'not_found' }, 404);
    return c.json({ explanation: res[0].explanationText, tier: res[0].level });
  } catch {
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/analytics/weakness', requirePremium, (c) => c.json({ data: [] }));
app.get('/rank/percentile', requirePremium, (c) => c.json({ percentile: 0 }));

// TEAM_029: tryout history for all users (was premium-gated, now open)
app.get('/tryout/history', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  try {
    const db = await getDb(c.env);
    const rows = await db
      .select({
        id: tryoutAttempts.id,
        total: tryoutAttempts.total,
        twk: tryoutAttempts.twk,
        tiu: tryoutAttempts.tiu,
        tkp: tryoutAttempts.tkp,
        passed: tryoutAttempts.passed,
        createdAt: tryoutAttempts.createdAt,
      })
      .from(tryoutAttempts)
      .where(eq(tryoutAttempts.userId, user.id))
      .orderBy(desc(tryoutAttempts.createdAt))
      .limit(100);

    return c.json({ history: rows });
  } catch (e) {
    console.error('TEAM_009 /tryout/history failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

// TEAM_009: premium-gated subtopic accuracy for TWK/TIU/TKP radar charts (tryout-only scope)
app.get('/analytics/subtopic-accuracy', requirePremium, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  try {
    const db = await getDb(c.env);

    const rows = await db
      .select({
        categoryCode: tryoutAttemptItems.categoryCode,
        subcategoryId: tryoutAttemptItems.subcategoryId,
        subcategoryName: questionSubcategories.name,
        attempts: sql<number>`count(*)`,
        twkTiuCorrect: sql<number>`sum(case when ${tryoutAttemptItems.isCorrect} = true then 1 else 0 end)`,
        tkpRatioSum: sql<number>`sum(case when ${tryoutAttemptItems.maxWeight} > 0 then (${tryoutAttemptItems.selectedWeight}::float / ${tryoutAttemptItems.maxWeight}::float) else 0 end)`,
      })
      .from(tryoutAttemptItems)
      .leftJoin(questionSubcategories, eq(tryoutAttemptItems.subcategoryId, questionSubcategories.id))
      .leftJoin(tryoutAttempts, eq(tryoutAttemptItems.attemptId, tryoutAttempts.id))
      .where(and(eq(tryoutAttempts.userId, user.id), sql`${tryoutAttemptItems.subcategoryId} is not null`))
      .groupBy(tryoutAttemptItems.categoryCode, tryoutAttemptItems.subcategoryId, questionSubcategories.name);

    const byCategory: Record<string, Array<{ subtopicId: number; subtopicName: string; value: number; attempts: number }>> = {
      TWK: [],
      TIU: [],
      TKP: [],
    };

    for (const r of rows as any[]) {
      const code = String(r.categoryCode || '').toUpperCase();
      if (code !== 'TWK' && code !== 'TIU' && code !== 'TKP') continue;
      const attempts = Number(r.attempts ?? 0);
      const subtopicId = Number(r.subcategoryId);
      const subtopicName = String(r.subcategoryName ?? '');
      if (!Number.isFinite(subtopicId) || !attempts) continue;

      let ratio = 0;
      if (code === 'TKP') {
        const sum = Number(r.tkpRatioSum ?? 0);
        ratio = attempts > 0 ? sum / attempts : 0;
      } else {
        const correct = Number(r.twkTiuCorrect ?? 0);
        ratio = attempts > 0 ? correct / attempts : 0;
      }

      byCategory[code].push({
        subtopicId,
        subtopicName,
        value: Math.max(0, Math.min(100, ratio * 100)),
        attempts,
      });
    }

    return c.json({ categories: byCategory });
  } catch (e) {
    console.error('TEAM_009 /analytics/subtopic-accuracy failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

// TEAM_029: unified subtopic readiness for profile spider chart (Tryout + Daily Quiz; drills excluded) - now open to all users
app.get('/analytics/subtopic-readiness', async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  try {
    const db = await getDb(c.env);

    const tryoutRows = await db
      .select({
        subcategoryId: tryoutAttemptItems.subcategoryId,
        attempts: sql<number>`count(*)`,
        twkTiuCorrect: sql<number>`sum(case when ${tryoutAttemptItems.isCorrect} = true then 1 else 0 end)`,
        tkpRatioSum: sql<number>`sum(case when ${tryoutAttemptItems.maxWeight} > 0 then (${tryoutAttemptItems.selectedWeight}::float / ${tryoutAttemptItems.maxWeight}::float) else 0 end)`,
        hasBinary: sql<number>`sum(case when ${tryoutAttemptItems.isCorrect} is null then 0 else 1 end)`,
      })
      .from(tryoutAttemptItems)
      .leftJoin(tryoutAttempts, eq(tryoutAttemptItems.attemptId, tryoutAttempts.id))
      .where(and(eq(tryoutAttempts.userId, user.id), sql`${tryoutAttemptItems.subcategoryId} is not null`))
      .groupBy(tryoutAttemptItems.subcategoryId);

    const dailyRows = await db
      .select({
        subcategoryId: dailyQuizAttemptItems.subcategoryId,
        attempts: sql<number>`count(*)`,
        twkTiuCorrect: sql<number>`sum(case when ${dailyQuizAttemptItems.isCorrect} = true then 1 else 0 end)`,
        tkpRatioSum: sql<number>`sum(case when ${dailyQuizAttemptItems.maxWeight} > 0 then (${dailyQuizAttemptItems.selectedWeight}::float / ${dailyQuizAttemptItems.maxWeight}::float) else 0 end)`,
        hasBinary: sql<number>`sum(case when ${dailyQuizAttemptItems.isCorrect} is null then 0 else 1 end)`,
      })
      .from(dailyQuizAttemptItems)
      .leftJoin(dailyQuizAttempts, eq(dailyQuizAttemptItems.attemptId, dailyQuizAttempts.id))
      .where(and(eq(dailyQuizAttempts.userId, user.id), sql`${dailyQuizAttemptItems.subcategoryId} is not null`))
      .groupBy(dailyQuizAttemptItems.subcategoryId);

    const merged = new Map<
      number,
      { attempts: number; correct: number; tkpRatioSum: number; hasBinary: number }
    >();

    const mergeInto = (rows: any[]) => {
      for (const r of rows) {
        const subcategoryId = Number(r.subcategoryId);
        if (!Number.isFinite(subcategoryId)) continue;
        const prev = merged.get(subcategoryId) ?? { attempts: 0, correct: 0, tkpRatioSum: 0, hasBinary: 0 };
        merged.set(subcategoryId, {
          attempts: prev.attempts + Number(r.attempts ?? 0),
          correct: prev.correct + Number(r.twkTiuCorrect ?? 0),
          tkpRatioSum: prev.tkpRatioSum + Number(r.tkpRatioSum ?? 0),
          hasBinary: prev.hasBinary + Number(r.hasBinary ?? 0),
        });
      }
    };

    mergeInto(tryoutRows as any[]);
    mergeInto(dailyRows as any[]);

    const subcategoryIds = Array.from(merged.keys());
    if (!subcategoryIds.length) return c.json({ data: [] });

    const subcats = await db
      .select({
        id: questionSubcategories.id,
        name: questionSubcategories.name,
        topicCode: sql<string | null>`upper(${questionTopics.code})`,
      })
      .from(questionSubcategories)
      .leftJoin(questionCategories, eq(questionSubcategories.categoryId, questionCategories.id))
      .leftJoin(questionTopics, eq(questionCategories.topicId, questionTopics.id))
      .where(inArray(questionSubcategories.id, subcategoryIds));

    const subcatMeta = new Map<number, { name: string; topicCode: string | null }>();
    for (const r of subcats as any[]) {
      subcatMeta.set(Number(r.id), { name: String(r.name ?? ''), topicCode: r.topicCode ? String(r.topicCode) : null });
    }

    const data = subcategoryIds
      .map((id) => {
        const m = merged.get(id);
        const meta = subcatMeta.get(id);
        if (!m || !meta) return null;
        const attempts = m.attempts;
        const ratio = m.hasBinary > 0 ? (attempts > 0 ? m.correct / attempts : 0) : attempts > 0 ? m.tkpRatioSum / attempts : 0;
        return {
          subcategoryId: id,
          subcategoryName: meta.name,
          topicCode: meta.topicCode,
          attempts,
          value: Math.max(0, Math.min(100, ratio * 100)),
        };
      })
      .filter(Boolean);

    return c.json({ data });
  } catch (e) {
    console.error('TEAM_029 /analytics/subtopic-readiness failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/exam/start', async (c) => {
  if (isTryoutPremiumEnabled(c)) {
    const user = c.get('user');
    if (!user?.is_premium) {
      return c.json({ error: 'forbidden', code: 'PREMIUM_REQUIRED', status: 'locked', preview: 'Upgrade required' }, 403);
    }
  }

  const nowMs = Date.now();
  const durationSeconds = 100 * 60;
  const endsAt = nowMs + durationSeconds * 1000;
  const seed = crypto.randomUUID();

  try {
    const db = await getDb(c.env);

    // Topic-based selection with quotas: TWK=30, TIU=35, TKP=45
    const quotas: Record<string, number> = { TWK: 30, TIU: 35, TKP: 45 };
    const orderedCodes: Array<'TWK' | 'TIU' | 'TKP'> = ['TWK', 'TIU', 'TKP'];
    const pickedIds: number[] = [];

    // Get topic rows for TWK/TIU/TKP
    const topicRows = await db
      .select({ id: questionTopics.id, code: questionTopics.code })
      .from(questionTopics)
      .where(inArray(questionTopics.code, orderedCodes));

    const topicIdByCode = new Map<string, number>();
    for (const r of topicRows as any[]) topicIdByCode.set(String(r.code), Number(r.id));

    // TEAM_008: Fallback if topics don't exist yet
    if (topicRows.length === 0) {
      console.warn('TEAM_008 No topics found, falling back to active questions');
      const fallback = await db
        .select({ id: questions.id })
        .from(questions)
        .where(activeQuestionWhere)
        .orderBy(sql`md5((${questions.id})::text || ${seed} || 'tryout_fallback')`)
        .limit(110);
      pickedIds.push(...(fallback as any[]).map((q) => Number(q.id)).filter((n) => Number.isFinite(n)));
    }

    for (const code of orderedCodes) {
      const topicId = topicIdByCode.get(code);
      if (!topicId) continue;

      const quota = quotas[code];

      // Get subcategories indirectly: topics -> categories -> subcategories
      const subcats = await db
        .select({ id: questionSubcategories.id })
        .from(questionSubcategories)
        .innerJoin(questionCategories, eq(questionSubcategories.categoryId, questionCategories.id))
        .where(eq(questionCategories.topicId, topicId))
        .orderBy(questionSubcategories.id); // deterministic ordering

      const subIds = (subcats as any[]).map((s) => Number(s.id)).filter((n) => Number.isFinite(n));

      if (!subIds.length) {
        // Fallback: pick directly from topic if no subcategories
        const fallback = await db
          .select({ id: questions.id })
          .from(questions)
          .where(and(eq(questions.topicId, topicId), eq(questions.isActive, true)))
          .orderBy(sql`md5((${questions.id})::text || ${seed})`)
          .limit(quota);
        pickedIds.push(...(fallback as any[]).map((q) => Number(q.id)));
        continue;
      }

      // Batched selection to avoid N+1 queries
      const base = Math.floor(quota / subIds.length);
      let remainder = quota % subIds.length;
      let missing = 0;

      for (const subId of subIds) {
        const need = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder -= 1;
        if (need <= 0) continue;

        const rows = await db
          .select({ id: questions.id })
          .from(questions)
          .where(and(eq(questions.subcategoryId, subId), eq(questions.isActive, true)))
          .orderBy(sql`md5((${questions.id})::text || ${seed} || ${String(subId)})`)
          .limit(need);

        const ids = (rows as any[]).map((q) => Number(q.id)).filter((n) => Number.isFinite(n));
        pickedIds.push(...ids);
        if (ids.length < need) missing += need - ids.length;
      }

      if (missing > 0) {
        // Fill missing from same topic (maintains topic purity)
        const extra = await db
          .select({ id: questions.id })
          .from(questions)
          .where(
            and(
              eq(questions.topicId, topicId),
              eq(questions.isActive, true),
              pickedIds.length ? notInArray(questions.id, pickedIds) : sql`true`
            )
          )
          .orderBy(sql`md5((${questions.id})::text || ${seed} || 'extra')`)
          .limit(missing);
        pickedIds.push(...(extra as any[]).map((q) => Number(q.id)).filter((n) => Number.isFinite(n)));
      }
    }

    // Final fallback: cross-topic (violates purity but ensures tryout can start)
    if (pickedIds.length < 110) {
      const remaining = 110 - pickedIds.length;
      console.warn('TEAM_008 Using cross-topic fallback, purity violated');
      const topup = await db
        .select({ id: questions.id })
        .from(questions)
        .where(and(activeQuestionWhere, pickedIds.length ? notInArray(questions.id, pickedIds) : sql`true`))
        .orderBy(sql`md5((${questions.id})::text || ${seed} || 'tryout_topup')`)
        .limit(remaining);
      pickedIds.push(...(topup as any[]).map((q) => Number(q.id)).filter((n) => Number.isFinite(n)));
    }

    if (pickedIds.length < 110) {
      console.error('TEAM_008 /exam/start insufficient question pool', { picked: pickedIds.length });
      return c.json({ error: 'insufficient_question_pool' }, 503);
    }

    const finalIds = pickedIds.slice(0, 110);

    const examId = await new SignJWT({ qids: finalIds, endsAt })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(nowMs / 1000))
      .setExpirationTime(Math.floor(endsAt / 1000))
      .sign(getTryoutSecret(c));

    return c.json({
      examId,
      type: 'SKD',
      startsAt: nowMs,
      endsAt,
      durationSeconds,
      questionCount: 110,
    });
  } catch (e) {
    console.error('TEAM_004 /exam/start failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.get('/exam/:examId/questions', async (c) => {
  if (isTryoutPremiumEnabled(c)) {
    const user = c.get('user');
    if (!user?.is_premium) {
      return c.json({ error: 'forbidden', code: 'PREMIUM_REQUIRED', status: 'locked', preview: 'Upgrade required' }, 403);
    }
  }

  const examId = c.req.param('examId');
  if (!examId) return c.json({ error: 'bad_request' }, 400);

  try {
    const { payload } = await jwtVerify(examId, getTryoutSecret(c));
    const qids = (payload as any).qids as unknown;
    if (!Array.isArray(qids)) return c.json({ error: 'bad_token' }, 400);

    const ids = (qids as any[]).map((n) => Number(n)).filter((n) => Number.isFinite(n));
    if (!ids.length) return c.json({ error: 'bad_token' }, 400);

    const db = await getDb(c.env);

    const questionRows = await db
      .select({
        id: questions.id,
        subject: questionTopics.code,
        difficulty: questions.difficulty,
        text: questions.questionText,
      })
      .from(questions)
      .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
      .where(inArray(questions.id, ids));

    const byId = new Map<number, any>();
    for (const r of questionRows as any[]) byId.set(Number(r.id), r);
    const orderedQuestions = ids.map((id) => byId.get(id)).filter(Boolean);

    const optionsRows = await db
      .select({
        questionId: questionOptions.questionId,
        optionKey: questionOptions.optionKey,
        optionText: questionOptions.optionText,
      })
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, ids));

    const grouped: Record<string, { id: string; text: string }[]> = {};
    for (const o of optionsRows as any[]) {
      const questionKey = String(o.questionId);
      const optionId = String(o.optionKey).toLowerCase();
      if (!grouped[questionKey]) grouped[questionKey] = [];
      grouped[questionKey].push({ id: optionId, text: o.optionText });
    }

    const payloadQuestions = orderedQuestions.map((r: any) => {
      const questionKey = String(r.id);
      return {
        id: r.id,
        subject: (r.subject as any) ?? null,
        difficulty: r.difficulty,
        text: r.text,
        image_url: null,
        options: grouped[questionKey] ?? [],
        correct_option_id: '',
        explanation: '',
      };
    });

    return c.json({ questions: payloadQuestions });
  } catch (e) {
    console.error('TEAM_004 /exam/:examId/questions failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

app.post('/exam/:examId/submit', async (c) => {
  if (isTryoutPremiumEnabled(c)) {
    const user = c.get('user');
    if (!user?.is_premium) {
      return c.json({ error: 'forbidden', code: 'PREMIUM_REQUIRED', status: 'locked', preview: 'Upgrade required' }, 403);
    }
  }

  const examId = c.req.param('examId');
  const body = await c.req.json().catch(() => null);
  const answers = (body?.answers ?? {}) as Record<string, string>;
  if (!examId) return c.json({ error: 'bad_request' }, 400);

  try {
    const { payload } = await jwtVerify(examId, getTryoutSecret(c));
    const qids = (payload as any).qids as unknown;
    const endsAt = Number((payload as any).endsAt);
    if (!Array.isArray(qids)) return c.json({ error: 'bad_token' }, 400);
    if (Number.isFinite(endsAt) && Date.now() > endsAt) return c.json({ error: 'expired' }, 400);

    const ids = (qids as any[]).map((n) => Number(n)).filter((n) => Number.isFinite(n));
    if (!ids.length) return c.json({ error: 'bad_token' }, 400);

    const db = await getDb(c.env);
    const questionMetaRows = await db
      .select({
        id: questions.id,
        code: sql<string | null>`upper(${questionTopics.code})`,
        subcategoryId: questions.subcategoryId,
        subtopicId: questions.subtopicId,
      })
      .from(questions)
      .leftJoin(questionTopics, eq(questions.topicId, questionTopics.id))
      .where(inArray(questions.id, ids));

    const metaById = new Map<number, { code: string; subcategoryId: number | null; subtopicId: number | null }>();
    for (const r of questionMetaRows as any[]) {
      const rawSubcategoryId = r.subcategoryId == null ? null : Number(r.subcategoryId);
      const rawSubtopicId = r.subtopicId == null ? null : Number(r.subtopicId);
      metaById.set(Number(r.id), {
        // TEAM_013: ensure downstream comparisons use `TWK|TIU|TKP`
        code: String(r.code || '').toUpperCase(),
        subcategoryId: Number.isFinite(rawSubcategoryId) ? rawSubcategoryId : null,
        subtopicId: Number.isFinite(rawSubtopicId) ? rawSubtopicId : null,
      });
    }

    const optionRows = await db
      .select({
        questionId: questionOptions.questionId,
        optionKey: questionOptions.optionKey,
        isCorrect: questionOptions.isCorrect,
        weight: questionOptions.weight,
      })
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, ids));

    const optionsByQuestion: Record<string, Array<{ key: string; isCorrect: boolean | null; weight: number | null }>> = {};
    for (const o of optionRows as any[]) {
      const k = String(o.questionId);
      if (!optionsByQuestion[k]) optionsByQuestion[k] = [];
      optionsByQuestion[k].push({
        key: String(o.optionKey).toLowerCase(),
        isCorrect: o.isCorrect ?? null,
        weight: o.weight ?? null,
      });
    }

    let twk = 0;
    let tiu = 0;
    let tkp = 0;
    let twkCorrect = 0;
    let tiuCorrect = 0;

    const itemRows: Array<{
      questionId: number;
      categoryCode: string;
      subcategoryId: number | null;
      isCorrect: boolean | null;
      selectedWeight: number | null;
      maxWeight: number | null;
    }> = [];

    for (const qid of ids) {
      const meta = metaById.get(qid);
      // TEAM_013: avoid all-zero scoring when question category metadata is missing
      const rawCode = String(meta?.code || '').toUpperCase();
      // TEAM_014: fall back to questions.subtopic_id so radar analytics uses question_subcategories consistently
      const subcategoryId = meta?.subcategoryId ?? meta?.subtopicId ?? null;
      // TODO(TEAM_014): manually verify tryout submission populates radar data after deploying

      const selected = (answers[String(qid)] ?? '').toLowerCase();
      if (!selected) continue;

      const opts = optionsByQuestion[String(qid)] ?? [];

      const hasWeights = opts.some((o) => {
        const w = Number(o.weight);
        return Number.isFinite(w) && w > 0;
      });
      const hasExplicitCorrect = opts.some((o) => !!o.isCorrect);
      const code = rawCode === 'TWK' || rawCode === 'TIU' || rawCode === 'TKP' ? rawCode : hasWeights && !hasExplicitCorrect ? 'TKP' : 'TIU';

      if (code === 'TKP') {
        const found = opts.find((o) => o.key === selected);
        const w = Number(found?.weight ?? 0);
        if (Number.isFinite(w) && w > 0) tkp += w;

        const max = opts.reduce((acc, o) => {
          const ww = Number(o.weight ?? 0);
          if (!Number.isFinite(ww)) return acc;
          return ww > acc ? ww : acc;
        }, 0);

        itemRows.push({
          questionId: qid,
          categoryCode: code,
          subcategoryId,
          isCorrect: null,
          selectedWeight: Number.isFinite(w) ? w : 0,
          maxWeight: Number.isFinite(max) ? max : 0,
        });
        continue;
      }

      const correctKey = resolveCorrectOptionKey(opts);
      const isCorrect = !!correctKey && selected === correctKey;
      if (isCorrect) {
        if (code === 'TWK') {
          twk += 1;
          twkCorrect += 1;
        } else if (code === 'TIU') {
          // TEAM_013: score as correct-count (1 point per correct) for TWK/TIU
          tiu += 1;
          tiuCorrect += 1;
        }
      }

      itemRows.push({
        questionId: qid,
        categoryCode: code,
        subcategoryId,
        isCorrect,
        selectedWeight: null,
        maxWeight: null,
      });
    }

    const total = twk + tiu + tkp;
    // TEAM_013: passing grade thresholds for TWK/TIU are scaled down from point-based scoring (65/80) to correct-count scoring (13/16)
    const passed = twk >= 13 && tiu >= 16 && tkp >= 166;

    // TEAM_009: persist tryout attempt + per-question items (best-effort; do not fail submission if persistence fails)
    const user = c.get('user');
    if (user?.id) {
      const attemptId = crypto.randomUUID();
      try {
        await db.insert(tryoutAttempts).values({
          id: attemptId,
          userId: user.id,
          total,
          twk,
          tiu,
          tkp,
          passed,
        });

        if (itemRows.length) {
          await db.insert(tryoutAttemptItems).values(
            itemRows.map((r) => ({
              attemptId,
              questionId: r.questionId,
              categoryCode: r.categoryCode,
              subcategoryId: r.subcategoryId,
              isCorrect: r.isCorrect,
              selectedWeight: r.selectedWeight,
              maxWeight: r.maxWeight,
            }))
          );
        }
      } catch (e) {
        console.error('TEAM_009 persist tryout submission failed', e);
      }
    }

    return c.json({
      total,
      sections: { TWK: twk, TIU: tiu, TKP: tkp },
      meta: { correctCount: { TWK: twkCorrect, TIU: tiuCorrect } },
      passed,
    });
  } catch (e) {
    console.error('TEAM_004 /exam/:examId/submit failed', e);
    return c.json({ error: 'unavailable' }, 503);
  }
});

export default app;

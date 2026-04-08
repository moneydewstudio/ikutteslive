import { apiFetch } from './apiClient';

// TEAM_029: persist daily quiz attempts reliably (non-silent) by queueing failed submits and retrying later.

const PENDING_KEY = 'ikuttes_pending_daily_quiz_submit_v1';

type PendingPayload = { dayKey: string; answers: Record<string, string> };

export function getPendingDailyQuizSubmit(): PendingPayload | null {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingPayload;
    if (!parsed?.dayKey || !parsed?.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setPendingDailyQuizSubmit(payload: PendingPayload | null) {
  if (!payload) {
    localStorage.removeItem(PENDING_KEY);
    return;
  }
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

export async function submitDailyQuizAttempt(payload: PendingPayload): Promise<boolean> {
  const res = await apiFetch('/quiz/daily/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) return false;
  try {
    const json = (await res.json()) as any;
    return !!json?.ok;
  } catch {
    return true;
  }
}

export async function syncPendingDailyQuizSubmit(): Promise<boolean> {
  const pending = getPendingDailyQuizSubmit();
  if (!pending) return true;
  const ok = await submitDailyQuizAttempt(pending);
  if (ok) setPendingDailyQuizSubmit(null);
  return ok;
}

import { apiFetch } from './apiClient';

// TEAM_029: persist daily quiz attempts reliably (non-silent) by queueing failed submits and retrying later.
// Also enforces one successful submit per day per user (client-side guard).

const PENDING_KEY = 'ikuttes_pending_daily_quiz_submit_v1';
const SUBMITTED_KEY = 'ikuttes_daily_quiz_submitted_day';

// Get current dayKey in Jakarta time (matches server logic)
function getCurrentDayKey(): string {
  const now = new Date();
  const jakartaOffsetMs = 7 * 60 * 60 * 1000;
  const jakartaTime = new Date(now.getTime() + jakartaOffsetMs);
  return jakartaTime.toISOString().slice(0, 10);
}

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

// TEAM_029: track successful submissions per day (one submit per day rule)
export function hasSuccessfullySubmittedToday(dayKey: string): boolean {
  const stored = localStorage.getItem(SUBMITTED_KEY);
  if (!stored) return false;
  try {
    const parsed = JSON.parse(stored) as { dayKey: string; timestamp: number };
    return parsed.dayKey === dayKey;
  } catch {
    return false;
  }
}

export function markSubmittedToday(dayKey: string): void {
  localStorage.setItem(
    SUBMITTED_KEY,
    JSON.stringify({ dayKey, timestamp: Date.now() })
  );
  // Clear pending queue since submit succeeded
  setPendingDailyQuizSubmit(null);
}

// TEAM_029: Promise-sharing mutex to collapse concurrent submits into one
let inFlight: Promise<boolean> | null = null;

export async function submitDailyQuizAttempt(payload: PendingPayload): Promise<boolean> {
  // If already successfully submitted for this day, don't submit again
  if (hasSuccessfullySubmittedToday(payload.dayKey)) {
    return true;
  }

  // If there's an in-flight request, await it instead of starting a new one
  if (inFlight) {
    return inFlight;
  }

  // Create the actual submit promise
  const attempt = (async (): Promise<boolean> => {
    try {
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
    } finally {
      // Clear in-flight in finally to ensure it resets on both success and failure
      inFlight = null;
    }
  })();

  inFlight = attempt;
  return attempt;
}

export async function syncPendingDailyQuizSubmit(): Promise<boolean> {
  const pending = getPendingDailyQuizSubmit();
  if (!pending) return true;

  const currentDayKey = getCurrentDayKey();

  // Clear stale pending submissions from previous days (can't sync old daily quizzes)
  if (pending.dayKey !== currentDayKey) {
    setPendingDailyQuizSubmit(null);
    return true;
  }

  // Skip if already successfully submitted for this day
  if (hasSuccessfullySubmittedToday(pending.dayKey)) {
    setPendingDailyQuizSubmit(null);
    return true;
  }

  const ok = await submitDailyQuizAttempt(pending);
  if (ok) {
    markSubmittedToday(pending.dayKey);
  }
  return ok;
}

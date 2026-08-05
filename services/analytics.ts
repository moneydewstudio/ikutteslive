import { getAnalytics, isSupported, logEvent, setUserId, Analytics } from 'firebase/analytics';
import { app } from './firebase';

/**
 * GA4 (Firebase Analytics) wrapper — deliberately fails silent.
 * Firebase Analytics throws in non-browser envs, when IndexedDB is blocked
 * (private/incognito), or when measurementId is missing; those must never
 * crash the app or spam console. `failed` flag stops retry loops.
 */
let analytics: Analytics | null = null;
let failed = false;

export async function initAnalytics(): Promise<void> {
  if (analytics || failed || typeof window === 'undefined') return;
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    } else {
      failed = true;
    }
  } catch (e) {
    failed = true;
    console.warn('[GA4] init skipped:', e);
  }
}

export function track(eventName: string, params?: Record<string, unknown>): void {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params as Record<string, unknown>);
  } catch (e) {
    console.warn(`[GA4] event failed: ${eventName}`, e);
  }
}

export function trackUserId(uid: string): void {
  if (!analytics) return;
  try {
    setUserId(analytics, uid);
  } catch {
    // ignore — non-fatal
  }
}

const FREQ_KEY = 'interstitial_last_shown';
const MIN_INTERVAL_MS = 90_000;
const MIN_NAV_COUNT = 3;

export function shouldShowInterstitial(navCount: number): boolean {
  const last = Number(sessionStorage.getItem(FREQ_KEY) || 0);
  const elapsed = Date.now() - last;
  return navCount >= MIN_NAV_COUNT && elapsed >= MIN_INTERVAL_MS;
}

export function recordInterstitialShown(): void {
  sessionStorage.setItem(FREQ_KEY, String(Date.now()));
}

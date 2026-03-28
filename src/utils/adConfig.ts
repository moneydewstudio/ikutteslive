export const AD_CONFIG = {
  clientId: import.meta.env.VITE_ADSENSE_CLIENT_ID ?? 'ca-pub-1577646736137540',
  slots: {
    interstitial: '',
  },
  testMode: import.meta.env.VITE_ADSENSE_TEST_MODE === 'true',
  skipTimerSeconds: 5,
  maxLoadWaitMs: 8_000, // if ad hasn't filled in 8 s, show fallback
} as const;

export type AppEnv = {
  Bindings: {
    FIREBASE_PROJECT_ID: string;
    NEON_DATABASE_URL: string;
    // TEAM_019: guard for temporary audit endpoints (Phase 1 drills category leak investigation)
    AUDIT_KEY?: string;
    // TEAM_004: sign/verify tryout session tokens without adding new DB tables (free now; paywall-ready)
    TRYOUT_TOKEN_SECRET?: string;
    // TEAM_004: dormant paywall switch; when enabled, tryout endpoints require premium
    TRYOUT_PREMIUM_ENABLED?: string;
  };
  Variables: {
    user?: {
      id: string;
      email?: string;
      is_premium: boolean;
      streak?: number;
    };
  };
};

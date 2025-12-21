export type AppEnv = {
  Bindings: {
    FIREBASE_PROJECT_ID: string;
    NEON_DATABASE_URL: string;
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

// TEAM_010: Neon/Drizzle client for Astro SSR blog

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

neonConfig.fetchFunction = fetch;

export type DbEnv = {
  NEON_DATABASE_URL?: string;
};

export const getDb = (env: DbEnv) => {
  if (!env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not configured');
  }
  const sql = neon(env.NEON_DATABASE_URL);
  return drizzle(sql, { schema });
};

export type BlogDb = ReturnType<typeof getDb>;

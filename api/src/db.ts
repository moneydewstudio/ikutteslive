import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// TEAM_001: remove runtime schema bootstrapping to prevent intermittent Neon/DDL failures in Workers

// TEAM_001: improve Neon stability on edge runtimes by enabling fetch connection cache
neonConfig.fetchFunction = fetch;

type Bindings = {
  NEON_DATABASE_URL: string;
};

export const getDb = async (env: Bindings) => {
  if (!env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not configured');
  }
  const sql = neon(env.NEON_DATABASE_URL);
  return drizzle(sql, { schema });
};

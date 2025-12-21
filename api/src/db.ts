import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Bindings = {
  NEON_DATABASE_URL: string;
};

export const getDb = (env: Bindings) => {
  const sql = neon(env.NEON_DATABASE_URL);
  return drizzle(sql, { schema });
};

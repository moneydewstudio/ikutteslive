import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Bindings = {
  NEON_DATABASE_URL: string;
};

export const getDb = async (env: Bindings) => {
  await ensureDatabase(env);
  const sql = neon(env.NEON_DATABASE_URL);
  return drizzle(sql, { schema });
};

async function ensureSchema(dbUrl: string) {
  const sql = neon(dbUrl);

  await sql`SELECT 1`;

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      is_premium BOOLEAN DEFAULT false NOT NULL,
      premium_until TIMESTAMP,
      streak INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      text TEXT NOT NULL,
      explanation TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS options (
      id TEXT NOT NULL,
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      is_correct BOOLEAN DEFAULT false NOT NULL,
      PRIMARY KEY (id, question_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      selected_option_id TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
}

const schemaReady = new Map<string, Promise<void>>();

export async function ensureDatabase(env: Bindings) {
  const url = env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error('NEON_DATABASE_URL is not configured');
  }

  let init = schemaReady.get(url);
  if (!init) {
    init = ensureSchema(url);
    schemaReady.set(url, init);
  }

  await init;
}

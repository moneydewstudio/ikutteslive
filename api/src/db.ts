import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Bindings = {
  NEON_DATABASE_URL: string;
};

export const getDb = async (env: Bindings) => {
  const sql = neon(env.NEON_DATABASE_URL);
  return drizzle(sql, { schema });
};

async function ensureSchema(dbUrl: string) {
  const sql = neon(dbUrl);

  await sql`SELECT 1`;

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  // users
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

  // taxonomy tables
  await sql`
    CREATE TABLE IF NOT EXISTS question_categories (
      id INTEGER PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `;

  // seed default categories
  await sql`INSERT INTO question_categories (id, code, name) VALUES (1, 'TIU', 'Tes Intelegensi Umum') ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO question_categories (id, code, name) VALUES (2, 'TWK', 'Tes Wawasan Kebangsaan') ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO question_categories (id, code, name) VALUES (3, 'TKP', 'Tes Karakteristik Pribadi') ON CONFLICT (id) DO NOTHING`;

  await sql`
    CREATE TABLE IF NOT EXISTS question_subcategories (
      id INTEGER PRIMARY KEY,
      category_id INTEGER REFERENCES question_categories(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `;

  // questions (canonical). Create if missing, then ensure canonical columns are present.
  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS code TEXT`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES question_categories(id)`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS subcategory_id INTEGER REFERENCES question_subcategories(id)`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS difficulty INTEGER NOT NULL DEFAULT 1`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS stem TEXT`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS year_tag INTEGER`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true`;
  await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS questions_code_idx ON questions(code)`;

  // options (canonical)
  await sql`
    CREATE TABLE IF NOT EXISTS question_options (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      text TEXT NOT NULL,
      score INTEGER,
      is_correct BOOLEAN
    )
  `;

  // explanations (canonical)
  await sql`
    CREATE TABLE IF NOT EXISTS question_explanations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      tier INTEGER NOT NULL,
      content TEXT NOT NULL
    )
  `;

  // attempts
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

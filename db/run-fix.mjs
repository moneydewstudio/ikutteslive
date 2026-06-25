// TEAM_036: Run the fix schema migration
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchFunction = fetch;
const DATABASE_URL = process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration() {
  const statements = [
    `ALTER TABLE questions RENAME COLUMN theme_id TO legacy_theme_id_uuid`,
    `ALTER TABLE questions ADD COLUMN IF NOT EXISTS theme_id integer REFERENCES question_themes(id)`,
    `UPDATE question_themes SET subtopic_id = 1 WHERE subtopic_id = 9`,
    `UPDATE question_themes SET subtopic_id = 2 WHERE subtopic_id = 10`,
    `ALTER TABLE question_themes DROP CONSTRAINT IF EXISTS question_themes_subtopic_id_fkey`,
    `ALTER TABLE question_themes ADD CONSTRAINT question_themes_subtopic_id_fkey FOREIGN KEY (subtopic_id) REFERENCES question_subcategories(id)`,
    `DO $$
     BEGIN
       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'question_subcategories') THEN
         ALTER TABLE question_subcategories RENAME TO question_subtopics;
       END IF;
     END $$`,
    `DO $$
     BEGIN
       IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tryout_attempt_items' AND column_name = 'subcategory_id') THEN
         ALTER TABLE tryout_attempt_items RENAME COLUMN subcategory_id TO subtopic_id;
       END IF;
     END $$`,
    `CREATE TABLE IF NOT EXISTS daily_quiz_attempt_items (
        id SERIAL PRIMARY KEY,
        attempt_id TEXT NOT NULL REFERENCES daily_quiz_attempts(id),
        question_id INTEGER NOT NULL REFERENCES questions(id),
        subtopic_id INTEGER REFERENCES question_subtopics(id),
        is_correct BOOLEAN,
        selected_weight INTEGER,
        max_weight INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )`
  ];

  console.log('Running migration...');
  for (const stmt of statements) {
    try {
      await sql.query(stmt);
      console.log('✓ Executed:', stmt.substring(0, 50).replace(/\n/g, ' ') + '...');
    } catch (err) {
      console.error('✗ Failed:', stmt.substring(0, 50).replace(/\n/g, ' '), '-', err.message);
    }
  }
}

runMigration().catch(console.error);

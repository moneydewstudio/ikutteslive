// TEAM_036: Add topic_id to question_categories
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
const sql = neon(DATABASE_URL);

async function fix() {
  const stmts = [
    `ALTER TABLE question_categories ADD COLUMN IF NOT EXISTS topic_id INTEGER REFERENCES question_topics(id)`,
    `UPDATE question_categories SET topic_id = (SELECT id FROM question_topics WHERE code = 'TIU') WHERE code = 'TIU'`,
    `UPDATE question_categories SET topic_id = (SELECT id FROM question_topics WHERE code = 'TWK') WHERE code = 'TWK'`,
    `UPDATE question_categories SET topic_id = (SELECT id FROM question_topics WHERE code = 'TKP') WHERE code = 'TKP'`
  ];
  
  for (const s of stmts) {
    try {
      await sql.query(s);
      console.log('✓ Executed:', s.substring(0, 50));
    } catch(e) {
      console.log('✗ Failed:', e.message);
    }
  }
}

fix().catch(console.error);

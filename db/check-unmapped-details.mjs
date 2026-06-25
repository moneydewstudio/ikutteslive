// TEAM_037: List details of all unmapped legacy questions
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Unmapped Legacy Questions ---');
  const unmapped = await sql`
    SELECT id, legacy_theme_id_uuid, subtopic_id, question_text
    FROM questions
    WHERE legacy_theme_id_uuid IS NOT NULL
      AND id NOT IN (
        SELECT DISTINCT q.id
        FROM questions q
        JOIN question_tags qt ON q.id = qt.question_id
        JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
      )
    ORDER BY legacy_theme_id_uuid, id
  `;

  console.log(`Count: ${unmapped.length}`);
  for (const q of unmapped) {
    console.log(`ID: ${q.id} | UUID: ${q.legacy_theme_id_uuid} | Subtopic: ${q.subtopic_id}`);
    console.log(`Text: ${q.question_text}`);
    console.log('-'.repeat(40));
  }
}

check().catch(console.error);

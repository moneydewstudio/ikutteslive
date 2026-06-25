// TEAM_037: Verify attempts matching proposed themed questions using SQL subqueries
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Checking Attempts Coverage for Themed Questions (SQL Native) ---');

  // Let's count tryout_attempt_items that match the proposed themed questions
  const tryoutItemsResult = await sql`
    SELECT COUNT(*)::int as count 
    FROM tryout_attempt_items 
    WHERE question_id IN (
      SELECT DISTINCT q.id
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
      WHERE q.legacy_theme_id_uuid IS NOT NULL OR qth.id IS NOT NULL
    )
  `;

  // Let's count daily_quiz_attempt_items that match the proposed themed questions
  const dailyItemsResult = await sql`
    SELECT COUNT(*)::int as count 
    FROM daily_quiz_attempt_items 
    WHERE question_id IN (
      SELECT DISTINCT q.id
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
      WHERE q.legacy_theme_id_uuid IS NOT NULL OR qth.id IS NOT NULL
    )
  `;

  console.log(`Matching tryout_attempt_items: ${tryoutItemsResult[0].count}`);
  console.log(`Matching daily_quiz_attempt_items: ${dailyItemsResult[0].count}`);
}

check().catch(console.error);

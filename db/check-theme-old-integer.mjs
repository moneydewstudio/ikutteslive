// TEAM_037: Audit theme_id_old_integer in questions
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Checking theme_id_old_integer in questions ---');

  // How many questions have theme_id_old_integer set
  const [{ count }] = await sql`SELECT count(*)::int as count FROM questions WHERE theme_id_old_integer IS NOT NULL`;
  console.log(`Questions with theme_id_old_integer NOT NULL: ${count}`);

  if (count > 0) {
    // Distinct values of theme_id_old_integer
    const distinct = await sql`
      SELECT theme_id_old_integer, count(*)::int as count 
      FROM questions 
      WHERE theme_id_old_integer IS NOT NULL 
      GROUP BY theme_id_old_integer
      ORDER BY theme_id_old_integer
    `;
    console.log('\nDistinct values of theme_id_old_integer:');
    console.log(JSON.stringify(distinct, null, 2));

    // Sample mapping check between theme_id_old_integer and question_themes
    const matched = await sql`
      SELECT count(*)::int as count
      FROM questions q
      JOIN question_themes qt ON q.theme_id_old_integer = qt.id
    `;
    console.log(`\nQuestions whose theme_id_old_integer matches question_themes.id: ${matched[0].count}`);

    // If matches, print sample questions
    if (matched[0].count > 0) {
      const samples = await sql`
        SELECT q.id as question_id, q.theme_id_old_integer, qt.code as theme_code, qt.name as theme_name
        FROM questions q
        JOIN question_themes qt ON q.theme_id_old_integer = qt.id
        LIMIT 5
      `;
      console.log('\nSample matched questions:');
      console.log(JSON.stringify(samples, null, 2));
    }
  }
}

check().catch(console.error);

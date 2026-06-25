// TEAM_037: Audit all table names and check for legacy tables
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Public Tables List ---');
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  for (const t of tables) {
    console.log(`- ${t.table_name}`);
  }

  // Let's also check if there's a table named question_themes or similar and its columns
  console.log('\n--- question_themes columns ---');
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'question_themes'
  `;
  for (const c of columns) {
    console.log(`  ${c.column_name}: ${c.data_type}`);
  }

  // Let's print all 12 rows of question_themes
  console.log('\n--- All question_themes ---');
  const qthemes = await sql`SELECT * FROM question_themes`;
  console.log(JSON.stringify(qthemes, null, 2));

  // Let's query distinct legacy_theme_id_uuid values from questions
  console.log('\n--- Distinct legacy_theme_id_uuid in questions ---');
  const distinctLegacy = await sql`
    SELECT legacy_theme_id_uuid, count(*)::int as count 
    FROM questions 
    WHERE legacy_theme_id_uuid IS NOT NULL 
    GROUP BY legacy_theme_id_uuid
  `;
  console.log(JSON.stringify(distinctLegacy, null, 2));
}

check().catch(console.error);

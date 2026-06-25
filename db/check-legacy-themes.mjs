// TEAM_037: Check legacy themes table structure and count
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Checking themes table columns ---');
  const cols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'themes'
  `;
  for (const c of cols) {
    console.log(`  ${c.column_name}: ${c.data_type}`);
  }

  // Row count of themes
  const [{ count }] = await sql`SELECT count(*)::int as count FROM themes`;
  console.log(`\nTotal rows in legacy themes: ${count}`);

  // Fetch first 10 themes
  if (count > 0) {
    const samples = await sql`SELECT * FROM themes LIMIT 10`;
    console.log('\nSample rows from legacy themes:');
    console.log(JSON.stringify(samples, null, 2));
  }

  // Check if legacy_theme_id_uuid in questions matches id in themes
  const matching = await sql`
    SELECT COUNT(*)::int as count
    FROM questions q
    JOIN themes t ON q.legacy_theme_id_uuid::text = t.id::text
  `;
  console.log(`\nQuestions matching legacy themes table: ${matching[0].count}`);
}

check().catch(console.error);

// TEAM_037: Audit helper tables for any theme UUID mapping without using sql.raw
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  // Check question_meta
  console.log('\n=== Table: question_meta ===');
  try {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'question_meta'
    `;
    for (const c of cols) console.log(`  ${c.column_name}: ${c.data_type}`);
    const [{ count }] = await sql`SELECT count(*)::int as count FROM question_meta`;
    console.log(`Row count: ${count}`);
    if (count > 0) {
      const samples = await sql`SELECT * FROM question_meta LIMIT 3`;
      console.log('Sample rows:', JSON.stringify(samples, null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }

  // Check question_tags
  console.log('\n=== Table: question_tags ===');
  try {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'question_tags'
    `;
    for (const c of cols) console.log(`  ${c.column_name}: ${c.data_type}`);
    const [{ count }] = await sql`SELECT count(*)::int as count FROM question_tags`;
    console.log(`Row count: ${count}`);
    if (count > 0) {
      const samples = await sql`SELECT * FROM question_tags LIMIT 3`;
      console.log('Sample rows:', JSON.stringify(samples, null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }

  // Check staging_questions2
  console.log('\n=== Table: staging_questions2 ===');
  try {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'staging_questions2'
    `;
    for (const c of cols) console.log(`  ${c.column_name}: ${c.data_type}`);
    const [{ count }] = await sql`SELECT count(*)::int as count FROM staging_questions2`;
    console.log(`Row count: ${count}`);
    if (count > 0) {
      const samples = await sql`SELECT * FROM staging_questions2 LIMIT 3`;
      console.log('Sample rows:', JSON.stringify(samples, null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check().catch(console.error);

// TEAM_037: Audit all columns in questions table
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- All columns in questions table ---');
  const cols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'questions'
    ORDER BY column_name
  `;
  for (const c of cols) {
    console.log(`- ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`);
  }
}

check().catch(console.error);

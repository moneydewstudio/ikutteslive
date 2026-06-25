// TEAM_037: Audit all table names and their record counts
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Public Tables List & Counts ---');
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  for (const t of tables) {
    try {
      const [{ count }] = await sql`SELECT count(*)::int as count FROM "${sql.raw(t.table_name)}"`;
      console.log(`- ${t.table_name}: ${count} rows`);
    } catch (e) {
      console.log(`- ${t.table_name}: error counting rows (${e.message})`);
    }
  }
}

check().catch(console.error);

// TEAM_037: Audit common tags in question_tags (count >= 5)
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Common question tags (count >= 5) ---');
  const tags = await sql`
    SELECT tag, count(*)::int as count 
    FROM question_tags 
    GROUP BY tag 
    HAVING count(*) >= 5
    ORDER BY count DESC
  `;
  console.log(JSON.stringify(tags, null, 2));
}

check().catch(console.error);

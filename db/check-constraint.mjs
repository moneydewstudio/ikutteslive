// TEAM_036: Get constraint name for question_themes
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
const sql = neon(DATABASE_URL);

async function check() {
  const fks = await sql`
    SELECT tc.constraint_name
    FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'question_themes' AND tc.constraint_type = 'FOREIGN KEY'
  `;
  console.log('constraint names:', fks);
}

check().catch(console.error);

// TEAM_036: Check how to join themes to topics
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
const sql = neon(DATABASE_URL);

async function check() {
  const qc = await sql`SELECT * FROM question_categories LIMIT 5`;
  console.log('question_categories:', qc);

  const qt = await sql`SELECT * FROM question_topics LIMIT 5`;
  console.log('question_topics:', qt);

  const qs = await sql`SELECT * FROM question_subcategories LIMIT 5`;
  console.log('question_subcategories:', qs);

  const t = await sql`SELECT * FROM topics LIMIT 5`;
  console.log('topics:', t);

  const st = await sql`SELECT * FROM subtopics LIMIT 5`;
  console.log('subtopics:', st);
}

check().catch(console.error);

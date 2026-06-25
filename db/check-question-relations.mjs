// TEAM_037: Audit relationships between legacy theme UUIDs and subtopics/categories
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Checking legacy_theme_id_uuid vs subtopics in questions ---');

  // How many distinct legacy UUIDs
  const distinctUuids = await sql`
    SELECT legacy_theme_id_uuid, count(*)::int as q_count,
           count(distinct subtopic_id)::int as distinct_subtopics,
           count(distinct subcategory_id)::int as distinct_subcategories,
           count(distinct category_id)::int as distinct_categories,
           count(distinct topic_id)::int as distinct_topics,
           min(subtopic_id) as sample_subtopic_id,
           min(subcategory_id) as sample_subcategory_id
    FROM questions
    WHERE legacy_theme_id_uuid IS NOT NULL
    GROUP BY legacy_theme_id_uuid
    ORDER BY q_count DESC
    LIMIT 20
  `;
  console.log('Distinct legacy UUIDs and their subtopic/subcategory/category counts:');
  console.log(JSON.stringify(distinctUuids, null, 2));

  // Let's see if subtopic_id or subcategory_id are populated on questions
  const [{ total, with_subtopic, with_subcategory }] = await sql`
    SELECT 
      count(*)::int as total,
      count(subtopic_id)::int as with_subtopic,
      count(subcategory_id)::int as with_subcategory
    FROM questions
  `;
  console.log(`\nQuestions total: ${total}, with subtopic_id: ${with_subtopic}, with subcategory_id: ${with_subcategory}`);

  // Let's inspect subtopics table vs question_subtopics table
  const subtopicsTable = await sql`SELECT id, name FROM subtopics ORDER BY id`;
  console.log('\nsubtopics table rows:');
  console.log(JSON.stringify(subtopicsTable, null, 2));

  const questionSubtopicsTable = await sql`SELECT id, name, category_id, code FROM question_subtopics ORDER BY id`;
  console.log('\nquestion_subtopics table rows:');
  console.log(JSON.stringify(questionSubtopicsTable, null, 2));
}

check().catch(console.error);

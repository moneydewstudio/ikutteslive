// TEAM_037: Audit matching tags to new question themes
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Checking Tag-based Theme Mapping ---');

  // Match by upper(tag) = upper(code)
  const codeMatches = await sql`
    SELECT COUNT(DISTINCT q.id)::int as distinct_questions, COUNT(*)::int as total_matches
    FROM questions q
    JOIN question_tags qt ON q.id = qt.question_id
    JOIN question_themes qth ON UPPER(qt.tag) = UPPER(qth.code)
  `;
  console.log(`Matching by tag equals theme.code (exact):`);
  console.log(`  Distinct questions: ${codeMatches[0].distinct_questions}`);
  console.log(`  Total matches: ${codeMatches[0].total_matches}`);

  // Match by upper(tag) = upper(name)
  const nameMatches = await sql`
    SELECT COUNT(DISTINCT q.id)::int as distinct_questions, COUNT(*)::int as total_matches
    FROM questions q
    JOIN question_tags qt ON q.id = qt.question_id
    JOIN question_themes qth ON UPPER(qt.tag) = UPPER(qth.name)
  `;
  console.log(`\nMatching by tag equals theme.name (exact):`);
  console.log(`  Distinct questions: ${nameMatches[0].distinct_questions}`);
  console.log(`  Total matches: ${nameMatches[0].total_matches}`);

  // Match by combining code and name matches
  const combinedMatches = await sql`
    SELECT COUNT(DISTINCT q.id)::int as distinct_questions
    FROM questions q
    JOIN question_tags qt ON q.id = qt.question_id
    JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
  `;
  console.log(`\nCombined unique questions matched: ${combinedMatches[0].distinct_questions}`);

  // Let's print some examples of combined matches
  const samples = await sql`
    SELECT q.id as question_id, qt.tag, qth.id as theme_id, qth.code as theme_code, qth.name as theme_name
    FROM questions q
    JOIN question_tags qt ON q.id = qt.question_id
    JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
    LIMIT 10
  `;
  console.log('\nSample combined matches:');
  console.log(JSON.stringify(samples, null, 2));
}

check().catch(console.error);

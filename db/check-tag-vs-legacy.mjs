// TEAM_037: Compare questions with legacy UUIDs against tag-mapped questions
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Comparing tag-based mapping with legacy UUIDs ---');

  // Find questions that have legacy_theme_id_uuid IS NOT NULL but CANNOT be mapped via tags
  const unmappedLegacy = await sql`
    SELECT id, legacy_theme_id_uuid, subtopic_id, question_text
    FROM questions
    WHERE legacy_theme_id_uuid IS NOT NULL
      AND id NOT IN (
        SELECT DISTINCT q.id
        FROM questions q
        JOIN question_tags qt ON q.id = qt.question_id
        JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
      )
  `;
  console.log(`Questions with legacy_theme_id_uuid that CANNOT be mapped via tags: ${unmappedLegacy.length}`);
  if (unmappedLegacy.length > 0) {
    console.log(JSON.stringify(unmappedLegacy, null, 2));
  }

  // Find if there are any questions that CAN be mapped via tags but DO NOT have legacy_theme_id_uuid set
  const mappedNoLegacy = await sql`
    SELECT COUNT(DISTINCT q.id)::int as count
    FROM questions q
    JOIN question_tags qt ON q.id = qt.question_id
    JOIN question_themes qth ON (UPPER(qt.tag) = UPPER(qth.code) OR UPPER(qt.tag) = UPPER(qth.name))
    WHERE q.legacy_theme_id_uuid IS NULL
  `;
  console.log(`Questions mapped via tags that DO NOT have legacy_theme_id_uuid: ${mappedNoLegacy[0].count}`);
}

check().catch(console.error);

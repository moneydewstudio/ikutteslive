// TEAM_037: Audit tags associated with each legacy UUID
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Auditing Tags for each legacy_theme_id_uuid ---');

  const legacyUuids = await sql`
    SELECT DISTINCT legacy_theme_id_uuid 
    FROM questions 
    WHERE legacy_theme_id_uuid IS NOT NULL
  `;

  console.log(`Total distinct legacy UUIDs: ${legacyUuids.length}`);

  const mapping = [];

  for (const row of legacyUuids) {
    const uuid = row.legacy_theme_id_uuid;
    
    // Find all tags for questions having this legacy_theme_id_uuid
    const tags = await sql`
      SELECT DISTINCT qt.tag
      FROM questions q
      JOIN question_tags qt ON q.id = qt.question_id
      WHERE q.legacy_theme_id_uuid = ${uuid}
    `;

    const tagList = tags.map(t => t.tag);
    
    // Count how many questions have this UUID
    const [{ q_count }] = await sql`
      SELECT COUNT(*)::int as q_count 
      FROM questions 
      WHERE legacy_theme_id_uuid = ${uuid}
    `;

    mapping.push({
      uuid,
      q_count,
      tags: tagList
    });
  }

  // Sort by count descending
  mapping.sort((a, b) => b.q_count - a.q_count);

  console.log('UUID to Tag mapping details:');
  console.log(JSON.stringify(mapping, null, 2));
}

check().catch(console.error);

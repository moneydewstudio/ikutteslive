// TEAM_036: Map question_themes subtopic IDs to question_subcategories
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
const sql = neon(DATABASE_URL);

async function check() {
  const themes = await sql`
    SELECT qt.id, qt.code, qt.subtopic_id AS old_id, s.name AS old_name
    FROM question_themes qt
    JOIN subtopics s ON qt.subtopic_id = s.id
  `;

  const qsc = await sql`SELECT id, code, name FROM question_subcategories`;

  console.log('--- Current themes ---');
  for (const t of themes) {
    // Attempt to match by name or code pattern
    let match = qsc.find(c => c.name.toLowerCase().includes(t.old_name.toLowerCase()) || c.code.includes(t.old_name.toUpperCase()));
    if (!match) {
        // verbal -> VERBAL
        if (t.old_name.toUpperCase() === 'VERBAL') match = qsc.find(c => c.code === 'VERBAL');
        if (t.old_name.toUpperCase() === 'NUMERIK') match = qsc.find(c => c.code === 'NUMERIK');
        if (t.old_name.toUpperCase() === 'FIGURAL') match = qsc.find(c => c.code === 'FIGURAL');
    }
    console.log(`Theme ${t.id} (${t.code}): old subtopic=${t.old_name}(${t.old_id}) -> new id=${match?.id} (${match?.code})`);
  }
}

check().catch(console.error);

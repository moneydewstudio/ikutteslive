// TEAM_036: Check FKs, theme_id type, and subtopics data
import { neon } from '@neondatabase/serverless';
const DATABASE_URL = process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) { console.error('NEON_DATABASE_URL not set'); process.exit(1); }
const sql = neon(DATABASE_URL);

async function check() {
  // Check question_themes FK
  const fks = await sql`
    SELECT kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'question_themes'
  `;
  console.log('question_themes FKs:');
  for (const f of fks) console.log('  ' + f.column_name + ' -> ' + f.ref_table + '(' + f.ref_col + ')');

  // question_subcategories FKs
  const fks2 = await sql`
    SELECT kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'question_subcategories'
  `;
  console.log('\nquestion_subcategories FKs:');
  for (const f of fks2) console.log('  ' + f.column_name + ' -> ' + f.ref_table + '(' + f.ref_col + ')');

  // questions FKs
  const fks3 = await sql`
    SELECT kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'questions'
  `;
  console.log('\nquestions FKs:');
  for (const f of fks3) console.log('  ' + f.column_name + ' -> ' + f.ref_table + '(' + f.ref_col + ')');

  // Exact theme_id data type
  const themeIdType = await sql`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name IN ('theme_id', 'theme_id_old_integer')
  `;
  console.log('\nquestions.theme_id type details:');
  for (const c of themeIdType) console.log('  ' + c.column_name + ': data_type=' + c.data_type + ', udt=' + c.udt_name);

  // Sample questions with theme_id
  const samples = await sql`SELECT id, theme_id, theme_id_old_integer FROM questions WHERE theme_id IS NOT NULL LIMIT 5`;
  console.log('\nSample questions with theme_id:');
  for (const s of samples) console.log('  ', JSON.stringify(s));

  // All question_subcategories
  const subs = await sql`SELECT * FROM question_subcategories ORDER BY id`;
  console.log('\nAll question_subcategories:');
  for (const s of subs) console.log('  ', JSON.stringify(s));

  // All question_themes
  const themes = await sql`SELECT * FROM question_themes ORDER BY id`;
  console.log('\nAll question_themes:');
  for (const t of themes) console.log('  ', JSON.stringify(t));

  // Test: what does the actual working join look like?
  console.log('\n=== Testing working query ===');
  try {
    const r = await sql`
      SELECT qt.id, qt.name, qt.subtopic_id, qs.name AS subtopic_name
      FROM question_themes qt
      LEFT JOIN subtopics qs ON qt.subtopic_id = qs.id
      LIMIT 5
    `;
    console.log('themes->subtopics join works!');
    for (const row of r) console.log('  ', JSON.stringify(row));
  } catch(e) {
    console.log('themes->subtopics join failed:', e.message);
  }
}

check().catch(err => { console.error(err); process.exit(1); });

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const env = readFileSync(join(root, '.env'), 'utf-8');
const m = env.match(/NEON_DATABASE_URL=(.+)/);
if (!m) { console.error('NEON_DATABASE_URL not in .env'); process.exit(1); }
const sql = neon(m[1].trim().replace(/^["']|["']$/g, ''));

// side 1: question_themes -> question_subtopics (matches API /roadmap/subtopics)
const qt = await sql`
  SELECT s.id AS subtopic_id, s.name AS subtopic, t.name AS theme
  FROM question_themes t
  JOIN question_subtopics s ON s.id = t.subtopic_id
  ORDER BY s.id, t.id
`;
// side 2: roadmap_materials.materialJson->'themes'
const rm = await sql`
  SELECT subtopic_id, jsonb_array_elements(material_json->'themes')->>'name' AS theme
  FROM roadmap_materials
  ORDER BY subtopic_id
`;

const byS = {};
for (const r of qt) {
  if (!byS[r.subtopic_id]) byS[r.subtopic_id] = { subtopic: r.subtopic, qt: new Set(), rm: new Set() };
  byS[r.subtopic_id].qt.add(r.theme);
}
for (const r of rm) {
  if (!byS[r.subtopic_id]) byS[r.subtopic_id] = { subtopic: byS[r.subtopic_id]?.subtopic || '?', qt: byS[r.subtopic_id]?.qt || new Set(), rm: new Set() };
  if (r.theme) byS[r.subtopic_id].rm.add(r.theme);
}

let mismatch = 0;
console.log('| subtopic | question_themes | materialJson | match |');
for (const [id, s] of Object.entries(byS).sort((a,b)=>+a[0]-+b[0])) {
  const onlyQt = [...s.qt].filter(x => !s.rm.has(x));
  const onlyRm = [...s.rm].filter(x => !s.qt.has(x));
  const ok = onlyQt.length === 0 && onlyRm.length === 0;
  if (!ok) mismatch++;
  console.log(`| ${s.subtopic} (id=${id}) | ${[...s.qt].join(',')} | ${[...s.rm].join(',')} | ${ok?'✅':'❌'} |`);
  if (!ok) {
    if (onlyQt.length) console.log(`  only in question_themes: ${onlyQt.join(', ')}`);
    if (onlyRm.length) console.log(`  only in materialJson:    ${onlyRm.join(', ')}`);
  }
}
console.log(`\nMismatched subtopics: ${mismatch} / ${Object.keys(byS).length}`);

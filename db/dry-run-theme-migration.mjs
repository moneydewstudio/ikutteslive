// TEAM_037: Dry-run theme migration script
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function dryRun() {
  console.log('=== DRY-RUN: Question Theme Migration ===');

  // 1. Fetch themes
  const themes = await sql`SELECT id, subtopic_id, code, name FROM question_themes`;
  console.log(`Loaded ${themes.length} themes.`);

  // 2. Fetch tags
  const tags = await sql`SELECT question_id, tag FROM question_tags`;
  const questionTagsMap = new Map();
  for (const t of tags) {
    if (!questionTagsMap.has(t.question_id)) {
      questionTagsMap.set(t.question_id, []);
    }
    questionTagsMap.get(t.question_id).push(t.tag);
  }
  console.log(`Loaded tags for ${questionTagsMap.size} questions.`);

  // 3. Fetch questions
  const questions = await sql`
    SELECT id, question_text, subtopic_id, legacy_theme_id_uuid 
    FROM questions
  `;
  console.log(`Loaded ${questions.length} questions from DB.`);

  let mappedViaTag = 0;
  let mappedViaFallback = 0;
  let totalMapped = 0;

  const themeCounts = {};
  for (const t of themes) {
    themeCounts[t.id] = { code: t.code, name: t.name, count: 0 };
  }

  const updates = [];
  const samplesTag = [];
  const samplesFallback = [];

  for (const q of questions) {
    const qTags = questionTagsMap.get(q.id) || [];
    let matchedTheme = null;

    // Rule 1: Match tags with theme code or name
    for (const tag of qTags) {
      const upperTag = tag.toUpperCase().trim();
      
      // Match with theme code
      const matchByCode = themes.find(t => t.code.toUpperCase() === upperTag);
      if (matchByCode) {
        matchedTheme = matchByCode;
        break;
      }
      
      // Match with theme name
      const matchByName = themes.find(t => t.name.toUpperCase() === upperTag);
      if (matchByName) {
        matchedTheme = matchByName;
        break;
      }
    }

    if (matchedTheme) {
      mappedViaTag++;
      themeCounts[matchedTheme.id].count++;
      updates.push({ questionId: q.id, themeId: matchedTheme.id, method: 'tag', themeCode: matchedTheme.code });
      if (samplesTag.length < 5) {
        samplesTag.push({
          questionId: q.id,
          text: q.question_text.substring(0, 60) + '...',
          tags: qTags,
          theme: matchedTheme.code
        });
      }
      continue;
    }

    // Rule 2: Fallback keyword rules for questions with legacy_theme_id_uuid IS NOT NULL
    if (q.legacy_theme_id_uuid) {
      const text = (q.question_text || '').toLowerCase();
      let themeCode = null;

      if (text.includes('deret') || text.includes('pola deret')) {
        themeCode = 'NUMERIK_DERET_ANGKA';
      } else if (text.includes('proyek') || text.includes('pekerja') || text.includes('kecepatan') || text.includes('menit') || text.includes('hari')) {
        themeCode = 'NUMERIK_PERBANDINGAN';
      } else if (text.includes('pedagang') || text.includes('keuntungan') || text.includes('harga jual') || text.includes('laptop') || text.includes('diskon') || text.includes('tangki air') || text.includes('liter') || text.includes('barang')) {
        themeCode = 'NUMERIK_SOAL_CERITA';
      } else {
        themeCode = 'NUMERIK_ARITMATIKA_PECAHAN';
      }

      const fallbackTheme = themes.find(t => t.code === themeCode);
      if (fallbackTheme) {
        mappedViaFallback++;
        themeCounts[fallbackTheme.id].count++;
        updates.push({ questionId: q.id, themeId: fallbackTheme.id, method: 'fallback', themeCode: fallbackTheme.code });
        if (samplesFallback.length < 5) {
          samplesFallback.push({
            questionId: q.id,
            text: q.question_text.substring(0, 60) + '...',
            uuid: q.legacy_theme_id_uuid,
            theme: fallbackTheme.code
          });
        }
      }
    }
  }

  totalMapped = mappedViaTag + mappedViaFallback;

  console.log('\n=== Summary of Proposed Migration ===');
  console.log(`Total questions proposed to be mapped: ${totalMapped} / ${questions.length}`);
  console.log(`- Mapped via tag match: ${mappedViaTag}`);
  console.log(`- Mapped via fallback keywords (legacy UUID questions): ${mappedViaFallback}`);
  console.log(`- Questions left unmapped: ${questions.length - totalMapped}`);

  console.log('\n=== Proposed Theme Distribution ===');
  for (const id in themeCounts) {
    console.log(`- Theme ${id} (${themeCounts[id].code}): ${themeCounts[id].count} questions`);
  }

  console.log('\n=== Sample: Mapped via Tags ===');
  console.log(JSON.stringify(samplesTag, null, 2));

  console.log('\n=== Sample: Mapped via Fallback Keywords ===');
  console.log(JSON.stringify(samplesFallback, null, 2));
}

dryRun().catch(console.error);

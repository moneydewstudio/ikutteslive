// TEAM_037: Populate questions.theme_id from tags and legacy UUID fallback
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_IiMFKka4o6pw@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

const isCommit = process.argv.includes('--commit');

async function migrate() {
  console.log('=== Question Theme Migration ===');
  console.log(`Mode: ${isCommit ? 'COMMIT (Writing to DB)' : 'DRY-RUN (Safe mode)'}`);

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

  const updates = [];

  for (const q of questions) {
    const qTags = questionTagsMap.get(q.id) || [];
    let matchedTheme = null;

    // Rule 1: Match tags with theme code or name
    for (const tag of qTags) {
      const upperTag = tag.toUpperCase().trim();
      const match = themes.find(t => t.code.toUpperCase() === upperTag || t.name.toUpperCase() === upperTag);
      if (match) {
        matchedTheme = match;
        break;
      }
    }

    if (matchedTheme) {
      mappedViaTag++;
      updates.push({ questionId: q.id, themeId: matchedTheme.id, method: 'tag', themeCode: matchedTheme.code });
      continue;
    }

    // Rule 2: Fallback keywords for legacy UUID questions
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
        updates.push({ questionId: q.id, themeId: fallbackTheme.id, method: 'fallback', themeCode: fallbackTheme.code });
      }
    }
  }

  totalMapped = mappedViaTag + mappedViaFallback;

  console.log('\n=== Migration Summary ===');
  console.log(`Total questions to be mapped: ${totalMapped} / ${questions.length}`);
  console.log(`- Mapped via tag match: ${mappedViaTag}`);
  console.log(`- Mapped via fallback keywords: ${mappedViaFallback}`);
  console.log(`- Unmapped: ${questions.length - totalMapped}`);

  if (updates.length === 0) {
    console.log('No updates required.');
    return;
  }

  if (isCommit) {
    console.log('\nApplying updates in a single batch transaction...');
    
    // Group updates into batches of 100 to avoid large payload limits
    const batchSize = 100;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      console.log(`Executing batch ${Math.floor(i / batchSize) + 1} (${batch.length} updates)...`);
      
      // Execute each update individually using tagged template literals for safety
      for (const u of batch) {
        await sql`UPDATE questions SET theme_id = ${u.themeId} WHERE id = ${u.questionId}`;
      }
    }
    console.log('Migration successfully completed!');
  } else {
    console.log('\nDry-run complete. Run with "--commit" to apply changes.');
  }
}

migrate().catch(console.error);

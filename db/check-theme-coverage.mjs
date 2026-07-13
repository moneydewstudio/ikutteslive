import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.NEON_DATABASE_URL || "postgresql://neondb_owner:npg_FtAhpDvKyBqp@ep-polished-rain-a1fl6wek-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function check() {
  console.log('--- Question count per theme ---\n');
  
  const coverage = await sql`
    SELECT 
      qt.id as theme_id,
      qt.code,
      qt.name,
      qs.name as subtopic,
      COUNT(q.id)::int as question_count
    FROM question_themes qt
    LEFT JOIN question_subtopics qs ON qt.subtopic_id = qs.id
    LEFT JOIN questions q ON q.theme_id = qt.id AND q.is_active = true
    GROUP BY qt.id, qt.code, qt.name, qs.name
    ORDER BY question_count ASC, qt.code
  `;
  
  console.log('Total themes:', coverage.length);
  console.log('\nThemes with ZERO questions:');
  const empty = coverage.filter(t => t.question_count === 0);
  console.log(empty.length, 'themes have NO questions\n');
  empty.forEach(t => {
    console.log(`  ${t.code.padEnd(15)} | ${t.name.padEnd(40)} | ${t.subtopic || 'N/A'}`);
  });
  
  console.log('\nThemes with < 10 questions:');
  const sparse = coverage.filter(t => t.question_count > 0 && t.question_count < 10);
  sparse.forEach(t => {
    console.log(`  ${t.code.padEnd(15)} | ${String(t.question_count).padStart(3)} q | ${t.name}`);
  });
  
  console.log('\nTotal questions mapped:', coverage.reduce((sum, t) => sum + t.question_count, 0));
  console.log('\nFull breakdown:');
  console.table(coverage.map(t => ({
    code: t.code,
    questions: t.question_count,
    name: t.name.slice(0, 40)
  })));
}

check().catch(console.error);

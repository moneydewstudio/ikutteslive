import fs from 'node:fs';
import path from 'node:path';

const escapeSql = (s) => String(s).replace(/'/g, "''");

const main = () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('usage: node db/scripts/generate_question_themes_seed.mjs <metadata.json>');
    process.exit(2);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const meta = JSON.parse(raw);
  const themes = Array.isArray(meta?.themes) ? meta.themes : [];
  const assigns = Array.isArray(meta?.questionThemeAssignments) ? meta.questionThemeAssignments : [];

  const out = [];
  out.push('-- TEAM_035: Seed question_themes and assign questions.theme_id');
  out.push('begin;');

  for (const t of themes) {
    const subcategoryCode = String(t.subcategoryCode || '').trim();
    const code = String(t.themeCode || '').trim();
    const name = String(t.themeName || '').trim();
    if (!subcategoryCode || !code || !name) continue;

    out.push(`insert into question_themes (subcategory_id, code, name)`);
    out.push(`select qsc.id, '${escapeSql(code)}', '${escapeSql(name)}'`);
    out.push(`from question_subcategories qsc`);
    out.push(`where upper(qsc.code) = upper('${escapeSql(subcategoryCode)}')`);
    out.push(`on conflict (subcategory_id, code) do update set name = excluded.name;`);
  }

  for (const a of assigns) {
    const questionId = Number(a.questionId);
    const subcategoryCode = String(a.subcategoryCode || '').trim();
    const themeCode = String(a.themeCode || '').trim();
    if (!Number.isFinite(questionId) || questionId <= 0) continue;
    if (!subcategoryCode || !themeCode) continue;

    out.push(`update questions q set theme_id = qth.id`);
    out.push(`from question_subcategories qsc`);
    out.push(
      `join question_themes qth on qth.subcategory_id = qsc.id and upper(qth.code) = upper('${escapeSql(themeCode)}')`
    );
    out.push(`where q.id = ${questionId} and upper(qsc.code) = upper('${escapeSql(subcategoryCode)}');`);
  }

  out.push('commit;');

  const outPath = path.resolve(process.cwd(), 'db/seed/20260505_team_035_question_themes_seed.sql');
  fs.writeFileSync(outPath, out.join('\n') + '\n', 'utf8');
  console.log('wrote', outPath);
};

main();

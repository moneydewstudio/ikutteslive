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
  let meta = null;
  try {
    meta = JSON.parse(raw);
  } catch {
    console.error('invalid json');
    process.exit(2);
  }
  const themes = Array.isArray(meta?.themes) ? meta.themes : [];
  const assigns = Array.isArray(meta?.questionThemeAssignments) ? meta.questionThemeAssignments : [];

  if (!themes.length && !assigns.length) {
    console.error('no themes or questionThemeAssignments in metadata');
    process.exit(2);
  }

  const out = [];
  out.push('-- TEAM_035: Seed question_themes and assign questions.theme_id');
  out.push('begin;');

  let themeInsertCount = 0;
  let assignCount = 0;
  let skippedThemes = 0;
  let skippedAssigns = 0;

  for (const t of themes) {
    const subcategoryCode = String(t.subcategoryCode || '').trim();
    const code = String(t.themeCode || '').trim();
    const name = String(t.themeName || '').trim();
    if (!subcategoryCode || !code || !name) {
      skippedThemes += 1;
      continue;
    }

    // Fail loud if subcategory missing.
    out.push(`do $$ begin`);
    out.push(
      `  if not exists (select 1 from question_subcategories where upper(code) = upper('${escapeSql(subcategoryCode)}')) then`
    );
    out.push(`    raise exception 'missing question_subcategories.code: ${escapeSql(subcategoryCode)}';`);
    out.push(`  end if;`);
    out.push(`end $$;`);

    out.push(`insert into question_themes (subcategory_id, code, name)`);
    out.push(`select qsc.id, '${escapeSql(code)}', '${escapeSql(name)}'`);
    out.push(`from question_subcategories qsc`);
    out.push(`where upper(qsc.code) = upper('${escapeSql(subcategoryCode)}')`);
    out.push(`on conflict (subcategory_id, code) do update set name = excluded.name;`);
    themeInsertCount += 1;
  }

  for (const a of assigns) {
    const questionId = Number(a.questionId);
    const subcategoryCode = String(a.subcategoryCode || '').trim();
    const themeCode = String(a.themeCode || '').trim();
    if (!Number.isFinite(questionId) || questionId <= 0) {
      skippedAssigns += 1;
      continue;
    }
    if (!subcategoryCode || !themeCode) {
      skippedAssigns += 1;
      continue;
    }

    // Fail loud if theme missing (theme row should exist by now).
    out.push(`do $$ begin`);
    out.push(
      `  if not exists (` +
        `select 1 from question_themes qth join question_subcategories qsc on qsc.id = qth.subcategory_id ` +
        `where upper(qsc.code) = upper('${escapeSql(subcategoryCode)}') and upper(qth.code) = upper('${escapeSql(themeCode)}')` +
      `) then`
    );
    out.push(
      `    raise exception 'missing question_themes for subcategory=${escapeSql(subcategoryCode)} theme=${escapeSql(themeCode)}';`
    );
    out.push(`  end if;`);
    out.push(`end $$;`);

    out.push(`update questions q set theme_id = qth.id`);
    out.push(`from question_subcategories qsc`);
    out.push(
      `join question_themes qth on qth.subcategory_id = qsc.id and upper(qth.code) = upper('${escapeSql(themeCode)}')`
    );
    out.push(`where q.id = ${questionId} and upper(qsc.code) = upper('${escapeSql(subcategoryCode)}');`);
    assignCount += 1;
  }

  out.push('commit;');

  const outPath = path.resolve(process.cwd(), 'db/seed/20260505_team_035_question_themes_seed.sql');
  fs.writeFileSync(outPath, out.join('\n') + '\n', 'utf8');
  console.log('wrote', outPath);
  console.log(
    JSON.stringify(
      {
        theme_inserts: themeInsertCount,
        theme_skipped: skippedThemes,
        assigns: assignCount,
        assigns_skipped: skippedAssigns,
      },
      null,
      2
    )
  );
};

main();

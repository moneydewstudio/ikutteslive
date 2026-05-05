# Question Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional, normalized “theme” layer under existing subtopics (e.g. `TIU > Verbal > Sinonim`) to improve future UX, without changing drills/quiz/tryout behavior yet.

**Architecture:** Introduce a new table `question_themes` linked to existing `question_subcategories`, and a nullable FK `questions.theme_id`. Populate themes via an offline import-to-SQL workflow (no runtime admin endpoints). No selection logic changes; themes are internal metadata only for now.

**Tech Stack:** Neon Postgres, Drizzle ORM (API worker), Cloudflare Workers (Hono), Node.js script for generating SQL seed.

---

## File/Responsibility Map (SSOT)

**Create**
- `db/migrations/20260505_team_035_question_themes.sql`
  - DDL for `question_themes` and `questions.theme_id` + indexes.
- `db/scripts/generate_question_themes_seed.mjs`
  - Reads a JSON metadata file and generates SQL upserts for `question_themes` and updates `questions.theme_id`.

**Modify**
- `api/src/schema.ts`
  - Add Drizzle table for `question_themes` and `questions.themeId` column.
- `api/src/validation-queries.sql`
  - Add validation queries for theme coverage.
- `api/src/index.test.ts`
  - Add a minimal regression test that imports schema and asserts `questionThemes` exists (compile-time guard).

**Optional (later, not in this plan)**
- Any user-facing UI, filtering, or analytics by theme.

---

## Data Model

### Tables

- `question_topics` (existing)
  - `TWK|TIU|TKP`
- `question_categories` (existing)
- `question_subcategories` (existing)
  - currently used as “subtopik” in radar (e.g. Verbal, Numerik)
- `question_themes` (new)
  - theme under a subcategory (e.g. Sinonim, Antonim)

### Relationships

- `question_subcategories (1) -> (N) question_themes`
- `question_themes (1) -> (N) questions` via nullable `questions.theme_id`

---

# Task 0: Team protocol + baseline checks

**Files:**
- Create: `.teams/TEAM_035_question_themes.md`

- [ ] **Step 1: Claim TEAM_035 and create team log**

Create file `.teams/TEAM_035_question_themes.md` with:

```md
# TEAM_035: Question Themes (internal metadata)

## Goal
Add optional question themes under subtopics with normalized schema + seed workflow. No behavior change to drills/quiz/tryout.

## Work log
- Baseline status:
  - (fill after running tests)
```

- [ ] **Step 2: Run baseline tests (no code changes yet)**

Run:

```powershell
npm test
npm run build
```

Run (API):

```powershell
npm --prefix api test
```

Expected:
- Root build passes.
- API tests may have environment-specific constraints; record result in TEAM log.

- [ ] **Step 3: Commit team log + baseline notes**

```powershell
git add .teams/TEAM_035_question_themes.md
git commit -m "chore: start TEAM_035 question themes"
```

---

# Task 1: Database migration (themes table + FK on questions)

**Files:**
- Create: `db/migrations/20260505_team_035_question_themes.sql`

- [ ] **Step 1: Add migration SQL**

Create `db/migrations/20260505_team_035_question_themes.sql`:

```sql
-- TEAM_035: Add optional question themes under existing question_subcategories

create table if not exists question_themes (
  id integer primary key,
  subcategory_id integer not null references question_subcategories(id),
  code text not null,
  name text not null
);

create unique index if not exists question_themes_subcategory_code_uniq
  on question_themes (subcategory_id, code);

create index if not exists question_themes_subcategory_id_idx
  on question_themes (subcategory_id);

alter table questions
  add column if not exists theme_id integer references question_themes(id);

create index if not exists questions_theme_id_idx
  on questions (theme_id);
```

- [ ] **Step 2: Apply migration to Neon (manual step)**

Run the SQL in your Neon console / migration runner.

Expected:
- Table `question_themes` exists.
- Column `questions.theme_id` exists and is nullable.

- [ ] **Step 3: Commit migration**

```powershell
git add db/migrations/20260505_team_035_question_themes.sql
git commit -m "db: add question themes table and questions.theme_id"
```

---

# Task 2: Drizzle schema updates (API worker)

**Files:**
- Modify: `api/src/schema.ts`

- [ ] **Step 1: Update Drizzle schema**

Edit `api/src/schema.ts`:

1) Update imports to include what’s needed (keep existing style).
2) Add the `questionThemes` table.
3) Add `themeId` to `questions` table definition.

Code to add (place near the other taxonomy tables):

```ts
export const questionThemes = pgTable('question_themes', {
  id: integer('id').primaryKey(),
  subcategoryId: integer('subcategory_id').references(() => questionSubcategories.id).notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
});
```

Then in `questions` table add:

```ts
  themeId: integer('theme_id').references(() => questionThemes.id),
```

- [ ] **Step 2: Add/adjust API test to guard schema export**

Edit `api/src/index.test.ts` and add a new test:

```ts
import * as schema from './schema';

it('exports questionThemes table', () => {
  expect(schema).toHaveProperty('questionThemes');
});
```

- [ ] **Step 3: Run API tests + typecheck**

```powershell
npm --prefix api test
npm --prefix api run build
```

Expected:
- Tests pass.
- TypeScript build passes.

- [ ] **Step 4: Commit Drizzle updates**

```powershell
git add api/src/schema.ts api/src/index.test.ts
git commit -m "api: add Drizzle schema for question themes"
```

---

# Task 3: Validation queries (theme coverage)

**Files:**
- Modify: `api/src/validation-queries.sql`

- [ ] **Step 1: Append theme validation queries**

Append to `api/src/validation-queries.sql`:

```sql
-- 5. Verify theme counts per subcategory (sanity)
SELECT
  qt.code as topic_code,
  qsc.code as subcategory_code,
  count(distinct qth.id) as theme_count,
  count(q.id) filter (where q.theme_id is not null) as questions_with_theme
FROM question_topics qt
LEFT JOIN question_categories qc ON qc.topic_id = qt.id
LEFT JOIN question_subcategories qsc ON qsc.category_id = qc.id
LEFT JOIN question_themes qth ON qth.subcategory_id = qsc.id
LEFT JOIN questions q ON q.subcategory_id = qsc.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qsc.code
ORDER BY qt.code, qsc.code;

-- 6. Find questions missing theme_id (optional coverage allowed; this is for monitoring)
SELECT
  qt.code as topic_code,
  count(*) as active_questions,
  sum(case when q.theme_id is null then 1 else 0 end) as missing_theme
FROM questions q
LEFT JOIN question_topics qt ON q.topic_id = qt.id
WHERE q.is_active = true
GROUP BY qt.code
ORDER BY qt.code;
```

- [ ] **Step 2: Commit validation query updates**

```powershell
git add api/src/validation-queries.sql
git commit -m "chore: add theme validation queries"
```

---

# Task 4: Offline import workflow (JSON metadata -> SQL seed)

**Goal:** Populate `question_themes` and set `questions.theme_id` from imported metadata, without adding server endpoints.

**Files:**
- Create: `db/scripts/generate_question_themes_seed.mjs`

## Metadata input contract

The script expects a JSON file with this shape:

```json
{
  "themes": [
    { "topicCode": "TIU", "subcategoryCode": "VERBAL", "themeCode": "SINONIM", "themeName": "Sinonim" }
  ],
  "questionThemeAssignments": [
    { "questionId": 123, "topicCode": "TIU", "subcategoryCode": "VERBAL", "themeCode": "SINONIM" }
  ]
}
```

Notes:
- `themeCode` is the stable key (uppercase, snake-ish). `themeName` is display.
- `questionId` is the integer `questions.id` already in DB.
- `subcategoryCode` maps to `question_subcategories.code`.

- [ ] **Step 1: Implement generator script**

Create `db/scripts/generate_question_themes_seed.mjs`:

```js
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

  // We rely on (subcategory_id, code) unique index for upsert.
  const out = [];
  out.push('-- TEAM_035: Seed question_themes and assign questions.theme_id');
  out.push('begin;');

  // Insert themes by joining subcategory code (no numeric ids in metadata)
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

  // Assign questions.theme_id by joining theme by (subcategory, theme_code)
  for (const a of assigns) {
    const questionId = Number(a.questionId);
    const subcategoryCode = String(a.subcategoryCode || '').trim();
    const themeCode = String(a.themeCode || '').trim();
    if (!Number.isFinite(questionId) || questionId <= 0) continue;
    if (!subcategoryCode || !themeCode) continue;

    out.push(`update questions q set theme_id = qth.id`);
    out.push(`from question_subcategories qsc`);
    out.push(`join question_themes qth on qth.subcategory_id = qsc.id and upper(qth.code) = upper('${escapeSql(themeCode)}')`);
    out.push(`where q.id = ${questionId} and upper(qsc.code) = upper('${escapeSql(subcategoryCode)}');`);
  }

  out.push('commit;');

  const outPath = path.resolve(process.cwd(), 'db/seed/20260505_team_035_question_themes_seed.sql');
  fs.writeFileSync(outPath, out.join('\n') + '\n', 'utf8');
  console.log('wrote', outPath);
};

main();
```

- [ ] **Step 2: Run generator against a sample metadata file**

Create a small local file (not committed) like `C:/temp/question-themes-metadata.json` and run:

```powershell
node db/scripts/generate_question_themes_seed.mjs C:/temp/question-themes-metadata.json
```

Expected:
- `db/seed/20260505_team_035_question_themes_seed.sql` is created.

- [ ] **Step 3: Apply the generated seed SQL to Neon**

Run the generated SQL in Neon.

Expected:
- `question_themes` has rows.
- Some questions have `theme_id` set; others can remain null (optional coverage).

- [ ] **Step 4: Commit the generator script (seed SQL is optional to commit)**

Commit script:

```powershell
git add db/scripts/generate_question_themes_seed.mjs
git commit -m "chore: add generator for question theme seed SQL"
```

If you want deterministic seeds in-repo, also commit:

```powershell
git add db/seed/20260505_team_035_question_themes_seed.sql
git commit -m "db: seed question themes"
```

---

# Task 5: Regression check (no behavior changes)

**Files:**
- Modify: `.teams/TEAM_035_question_themes.md`

- [ ] **Step 1: Re-run root build + API tests**

```powershell
npm run build
npm --prefix api test
```

Expected:
- Builds/tests still pass.

- [ ] **Step 2: Update TEAM log with results + handoff**

Add:
- what was changed
- how to apply migration + seed
- confirmation that drills/quiz/tryout behavior is unchanged

- [ ] **Step 3: Final commit**

```powershell
git add .teams/TEAM_035_question_themes.md
git commit -m "chore: TEAM_035 handoff for question themes"
```

---

## Spec coverage self-review

- Adds normalized theme layer: ✅ `question_themes` + nullable `questions.theme_id`
- Optional coverage: ✅ nullable FK + monitoring query
- Imported metadata: ✅ offline JSON -> SQL workflow
- No behavior changes: ✅ no API selection logic modified
- Themes internal only for now: ✅ no UI/routes added

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-05-question-themes.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — I execute task-by-task with tight review gates.
2. **Inline Execution** — I execute tasks in this session.

Which approach do you want? 

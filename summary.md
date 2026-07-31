# Summary — Per-Theme Drill (TEAM-037) deploy + theme-seed fix

Date: 2026-07-20
Repo: `moneydewstudio/ikutteslive` (branch `main`, up to date with `origin/main`)

## What shipped

- **TEAM-037 per-theme drill** is committed and pushed (`e2ed21c`, `a6e1e07`): new
  GET `/themes?category=`, GET `/drills/by-theme?category=&themeId=`, premium-gated theme
  cards in `BonusView`, frontend wiring in `App`/`DrillsView`/`quizService`.
- **Both Cloudflare Workers are live** under `ikuttes.robimaulanaspsi.workers.dev`
  (API) — verified `GET /themes?category=TIU` returns `200` with `{"themes":[]}`.
  The earlier 404 was the *frontend* Worker not being deployed, not the API.

## Key finding: no v1→v2 migration was needed

User hypothesized daily quiz + tryout still fetch from v1. Tracing every
question-sourcing route in `api/src/index.ts` showed they **already** read
`questionsV2` (migrated in TEAM-004/008):

| Route | Source table |
|-------|--------------|
| `GET /drills/daily` | `questionsV2` |
| `GET /quiz/daily` | `questionsV2` |
| `GET /drills/by-theme` | `questionsV2` |
| `POST /exam/start` + `GET /exam/:id/questions` | `questionsV2` |
| `GET /themes` | theme→topic tables |
| `GET /questions/random` | `questions` (v1) — only leftover, not used by drills/quiz/tryout |
| `GET /db/stats` | `questions` (v1) — debug only |

## The actual bug: empty `question_themes` in prod Neon

`/themes` returned `[]` because the theme seed was never applied to prod. Running
`db/seed/20260620_fix_question_themes_seed.sql` surfaced **three schema errors**:
the seed was written against a schema that doesn't match the production DB.

### Fixes applied to `db/seed/20260620_fix_question_themes_seed.sql`

1. **`SQLSTATE 42703: column qc.topic_id does not exist`**
   Seed joined `question_categories.topic_id`, but `question_categories` has only
   `{id, code, name}` — no `topic_id`. Subtopics link to topics directly via
   `question_subtopics.topic_id`.
   → Removed the `question_categories` join; topic now joined via
   `JOIN question_topics qt ON qs.topic_id = qt.id` (all 32 INSERTs).

2. **`SQLSTATE 42703: column "subcategory_id" does not exist`** (on `questions_v2`)
   `questions_v2` has only `{topicId, subtopicId, themeId, ...}` — no `subcategory_id`.
   → Removed the v2 `subcategory_id` backfill block (step 2b). Kept it only for the
   legacy `questions` table.

3. **`SQLSTATE 42601: syntax error at or near "$"`** (broken `DO $$` PL/pgSQL block)
   The diagnostic `DO $$ ... $$` block got mangled during an edit.
   → Replaced with plain-SQL `SELECT` diagnostics (no PL/pgSQL), reporting both
   `questions_v2` and `questions` tagged/untagged counts.

Net result: all joins correct, both question tables backfilled, valid SQL,
`BEGIN; COMMIT;` intact.

## How to apply

```bash
psql "$NEON_DATABASE_URL" -f db/seed/20260620_fix_question_themes_seed.sql
```

Diagnostic output to check:
- `question_themes` rows > 0 (themes now populated)
- **`v2_tagged` / `v2_untagged`** — drives `/drills/by-theme`. If `v2_untagged` is
  high, many v2 questions have a null `subtopic_id` and can't be themed; those
  subtopics will return `insufficient_question_pool`.

## Verification after seeding

- `GET /themes?category=TIU` → should return themes (Sinonim, Antonim, …)
- `GET /drills/by-theme?category=TIU&themeId=<id>` → should return questions

## Status

- [x] Seed file committed and pushed (`8c0a6cc`). Prod Neon already had the seed
  applied (43 themes, 3632 v2 questions fully tagged).
- [x] `/tryout/history` 401 resolved — auth race in `Dashboard`/`BonusView` fixed
  by re-keying the fetch effect on `user?.id` and guarding against `local_guest`
  fallback.

## Resolved items

1. Seed was already applied to prod Neon before commit — confirmed read-only:
   `question_themes` = 43 rows, `v2_untagged` = 0, `GET /themes?category=TIU` → 200.
2. Seed schema fixes committed in `8c0a6cc`: drop `question_categories` join,
   drop v2 `subcategory_id` backfill, drop `DO $$` PL/pgSQL.
3. `/tryout/history` 401 root cause found + fixed: the fetch raced anonymous
   sign-in (no token → 401). Both call sites now guard on `user?.id` and skip
   when `!user || user.id === 'local_guest'`. Re-runs once Firebase auth settles.

---

# Summary — Roadmap Lesson Player (Duolingo-style)

Date: 2026-07-31
Plan: `docs/superpowers/plans/2026-07-31-roadmap-duolingo-lesson-player.md` (Revision 2)
Spec: `docs/superpowers/specs/2026-07-31-roadmap-duolingo-lesson-player-design.md` (partially stale — plan wins)

## Goal

Rewrite `RoadmapMaterialView` dari stacked-markdown → lesson player 1 tema = 1 deck slide interaktif.

## User decisions (locked)

- Entry: klik tema → ThemeList → tap tema → slide deck.
- Progress per-tema: in-memory (sesi), tidak ubah DB/API.
- Tab "Contoh Soal" dihapus → jadi slide di dalam lesson.
- Kerjakan langsung di `main`.

## Constraints (Global)

- **Jangan sentuh `api/src/**`** — no new deps, no DB schema change.
- `@tailwindcss/typography` TIDAK terpasang → semua `prose*` = no-op. Dilarang.
- Token spacing: `xs/sm/md/lg/xl/2xl/3xl`. Radius rumah `rounded-xl`.
- Style cluster: roadmap (`RoadmapQuizView` = source of truth), bukan brutalist `QuizCard`.
- A11y wajib: `<button type="button">`, `disabled` asli, `focus-visible:ring-2 ring-black ring-offset-2`, tap ≥44px (`px-lg py-md`), `aria-pressed`, `role="progressbar"` + valuenow/min/max, `aria-live="polite"` pada feedback.
- Join key theme = **`theme.name`** saja (`/roadmap/subtopics` hanya return `{id, name}`).

## Tasks (5)

| # | Isi | Status |
|---|---|---|
| 0 | GATE: verifikasi join key `theme.name` ke DB live. Mismatch → `resolveTheme` null → ThemeList. | ✅ **PASS** (commit `f64aa24`) |
| 1 | `utils/roadmapSlides.ts` + 8 test. Builder: fallback → `[content, ...exQuiz, done]`; normal → content[0] + checkpoint1 + sisa content + sisa checkpoint + exQuiz + done. Rotasi opsi deterministik, `weighted` flag, lede = hook, summary di completion. `resolveTheme` → **null** bila miss (jangan `themes[0]`). | ✅ (commit `4498a10`) — deviasi: fallback order `[exQuiz, content, done]` (plan taruh content dulu → test weighted gagal). |
| 2 | Fix `renderMarkdown`: escape `<>`, bold, numbered list, `\n` → `<p>`. Regex renderer (`ponytail`). | belum |
| 3 | Wiring: `RoadmapView` pass `theme.name`; `App.tsx` state + `key=` remount (ganti reset-effect). | belum |
| 4 | Rewrite `RoadmapMaterialView` 2 layar (ThemeList + LessonPlayer). UI copy-paste dari `RoadmapQuizView`. TKP weighted → banner amber + poin (bukan merah/hijau biner). Completion: skor N/M + summary card + CTA. Delete semua `*Section` lama. | belum |
| 5 | `npm run build` + `npm test` + smoke checklist manual + commit. | belum |

## Temuan audit (dasar revisi v2)

- 26 tema / 289 string: rata-rata 7.9 slide/tema, 2.73 content, 72% tap pasif → v2: 5.9 slide, tap pasif 37%.
- Semua 26 checkpoint: kunci `B`, 3 set opsi dipakai ulang (13×/7×/6×) → rotasi deterministik.
- Semua 26 hook dari 3 template, 0 pakai `makeHook()`.
- 12/72 objective cuma ulang judul content → slide objectives DITOLAK.
- Body content: median 224, p90 347, max 561 char → tanpa splitting.
- 26 summary dibuang total dulu → kini di completion.

## Ditolak / Deferred (eksplisit)

| Item | Alasan |
|---|---|
| Regenerasi checkpoint (kunci ≠ B, opsi beragam) | data task |
| Regenerasi hook via `makeHook()` | data task (0/26 pakai) |
| Progress di DB | user: lokal saja |
| XP / streak / hearts / confetti | out of scope |
| Markdown splitting | data max 561 char |
| `prose*` | plugin tak terpasang |
| objectives slide | 12/72 duplikat judul |
| fallback `themes[0]` | 6/13 subtopik = lesson salah tanpa error |
| auto-open via `useEffect` | bounce; diganti `key=` remount |
| Tap-to-reveal, memoization, progress-bar component | YAGNI |

## Task 0 state (DONE — 2026-08-01, GATE PASS)

`scripts/verify-theme-join.mjs` dijalankan terhadap DB live.

**Koreksi join:** plan & script lama join `question_themes → subtopics` — SALAH. Baik
`question_themes.subtopic_id` maupun `roadmap_materials.subtopic_id` mereferensi
**`question_subtopics.id`** (bukan `subtopics.id`). Yang "match" di run lama (NKRI=1,
Numerik=10) adalah kebetulan id sama. Script diperbaiki: join `question_subtopics`.

**Hasil (live):**
- **13/16 subtopik match ✅** — nama tema `question_themes` == nama di
  `material_json->'themes'`. Join key `theme.name` AMAN untuk lesson player.
- **3 subtopik mismatch** — BUKAN beda nama: `roadmap_materials` ada row tapi
  `material_json->'themes'` = **null** untuk subtopik duplikat:
  - id 18 `Bhinneka Tunggal Ika` (TWK), id 19 `Anti Radikalisme` (TWK),
    id 20 `Integritas` (TKP).
  - Ini duplikat yang tak pernah di-seed material. Frontend pakai
    `sub.themes` (dari question_themes) → tema tampil; tap → no `materialJson`
    → fallback markdown existing (bukan crash). Builder tetap harus guard
    `themes` null → fallback.
- `material_json` cuma punya 1 key: `themes` (13 tema punya material, 3 null).
- `RoadmapView.tsx` render tema dari `sub.themes` (API), bukan materialJson — konsisten.

**Keputusan:** lanjut ke Task 1. Builder wajib treat `materialJson.themes === null`
sebagai empty array (fallback).

## Next

1. ~~Task 0 gate — verify `theme.name` join key~~ ✅ **PASS**.
2. Task 1: `utils/roadmapSlides.ts` builder + 8 test.
3. Task 2: fix `renderMarkdown` (3 bugs).
4. Task 3: wiring `RoadmapView` + `App.tsx`.
5. Task 4: rewrite `RoadmapMaterialView` (2 layar).
6. Task 5: build + test + smoke + commit.
7. Setelah implementasi: update spec stale (`themeCode` → `theme.name`, objectives slide dihapus).

## Task 0 finding: plan SQL salah

Plan's Task 0 SQL (dan script `verify-theme-join.mjs` versi awal) join `question_themes`
ke `subtopics` table — tapi `question_themes.subtopic_id` mereferensi
`question_subtopics.id`, bukan `subtopics.id`. Duplikasi nama (NKRI, Numerik) di kedua
tabel bikin 4 "match palsu". Setelah diperbaiki join ke `question_subtopics`: 13/16 match real,
3 duplikat tanpa materialJson. GATE PASS.

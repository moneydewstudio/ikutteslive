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

- [ ] Seed file **not yet committed** (only `db/seed/20260620_fix_question_themes_seed.sql`
  is modified, unstaged). Commit after confirming seed runs clean in prod.
- [ ] `/tryout/history` returns `401` in browser console — **separate Firebase auth
  issue**, not investigated, out of scope for this session.

## Remaining open items

1. Run the (fixed) seed against prod Neon and confirm themes + drills populate.
2. Commit the seed fix.
3. Investigate `/tryout/history` 401 (expired/missing Firebase token — likely
   `withUserContext`/`authService.getIdToken()` on that request path).

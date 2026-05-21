# ikuttes — Project Overview & Architecture

## What This Project Is
ikuttes is a CPNS (Indonesian civil servant exam) preparation platform. It serves:
- **Daily Quiz** — short daily practice sessions
- **Tryout** — full 110-question SKD mock exams
- **Daily Drills** — category-focused practice
- **Blog** — programmatic SEO content about CPNS formations and exam topics
- **Analytics** — spider/radar chart showing readiness across 12 SKD subtopics

---

## Worker Architecture

Two separate Cloudflare Workers:

| Worker | Name | Role |
|--------|------|------|
| API | `ikuttes` | All API endpoints + database access |
| Frontend | `ikuttes-frontend` | Serves SPA, proxies API calls |

**Rule:** Never embed API logic in the frontend worker. Always proxy to the API worker.

### Production URLs
- API: https://ikuttes.robimaulanaspsi.workers.dev
- Frontend: https://ikuttes-frontend.robimaulanaspsi.workers.dev
- Blog: https://ikuttes.my.id/blog

---

## Database

- **Platform:** Neon PostgreSQL via Drizzle ORM
- **Runtime:** Cloudflare Workers
- **Connection:** HTTP URL format — NOT psql connection string
  - ✅ `https://...neon.tech/...`
  - ❌ `postgresql://...`

### Question Hierarchy (topic > subtopic > theme)

```
question_topics      → TWK (1), TIU (2), TKP (3)
question_subtopics   → subtopics under each topic
question_themes      → themes under each subtopic
questions            → records with topicId, subtopicId
```

**Terminology rule — always use "subtopic", never "subcategory":**
- Table: `question_subtopics` (NOT `question_subcategories`)
- Columns: `subtopic_id`, `subtopicId` (NOT `subcategory_id`)
- JSON fields: `subtopicCode`, `subtopicId`, `subtopicName`

### Environment Variables
- `NEON_DATABASE_URL` — HTTP format
- `FIREBASE_PROJECT_ID` — `ikuttes`
- `TRYOUT_TOKEN_SECRET` — configured
- `AUDIT_KEY` — configured

---

## Key API Endpoints

```
GET  /health
GET  /db/ping
GET  /db/stats
GET  /drills/daily
GET  /quiz/daily
POST /exam/start
GET  /exam/:id/questions
POST /quiz/daily/submit          (auth required)
GET  /analytics/subtopic-readiness  (premium-gated)
```

Do NOT re-add removed endpoints (expired TEAM_024):
- `/db/import-topic-ids`, `/db/assign-topic-ids`, `/db/migrate-question-topics`, `/db/category-audit`

---

## Frontend Features

### Tryout System
- 110 questions per exam
- Topic-based filtering via `topicId` (TEAM_019) — strict, no category mixing

### Daily Quiz
- Persisted in `daily_quiz_attempts` + `daily_quiz_attempt_items`
- Idempotent via `(user_id, day_key)` unique constraint
- LocalStorage queue for failed submissions, retried on Profil page load
- Anonymous users: not persisted

### Analytics / Spider Chart
- Profil page, 12 fixed SKD subtopics
- Data: Tryout + Daily Quiz (drills excluded)
- Minimum 5 attempts threshold (N=5)
- Subtopics: Verbal, Numerik, Figural, Logika, Pancasila, NKRI, BH, Kementerian, Jasmani, Kebangsaan, Kemampuan Perseorangan, Kecerdasan Logis

### Shareable Results
- Client-side image generation via `html-to-image`
- Format: 1080×1920 story images
- Web Share API with fallbacks (download, copy caption, copy link)
- **Critical:** html-to-image offscreen elements need style override: `position: static`, `backgroundColor` set explicitly — otherwise output is blank

---

## Blog Architecture

- Base path: `/blog/`
- Main route: `/:slug` — handles both hubs and programmatic pages
- Legacy route `[hub]/[slug].astro` — DISABLED (returns 404)
- Formasi routes: `/formasi/[category]/[slug]/`

### Blog Database Tables
1. `hubs` — category hubs (tiu, twk, tkp, provinsi, kota, institusi, pendidikan)
2. `programmaticPages` — SEO articles with `contentBlocks` (JSONB)
3. `formasiPages` — migrated into `programmaticPages` (TEAM_031)

### Content Block Types
```typescript
type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'question_preview'; questionId: string }
  | { type: 'cta'; style: 'hard' | 'soft' };
```

---

## Monetization

### AdSense
- Publisher ID: `ca-pub-1577646736137540`
- Main app: script in `index.html`, `ads.txt` in `public/`
- Blog: script in `BaseLayout.astro`, `ads.txt` in `blog/public/`
- Feature flag: `VITE_FEATURE_ADSENSE` — enable only after AdSense approval
- Key files: `src/utils/adConfig.ts`, `src/hooks/useAdSense.ts`, `src/components/AdSenseAd.tsx`

### Admin / Payments
- Confirm action: sets payment confirmed, extends `premium_until`, increments `purchase_count`, records audit

---

## Pending Tasks (as of TEAM_035)

### Database
- Apply TEAM_031 migration SQL: add `formations_data` column to `programmatic_pages`
- Apply TEAM_031 seed SQL: populate `programmatic_pages` with 41 formasi pages
- (Optional) Drop `formasi_pages` table after verification

### AdSense
- Deploy to production → submit for AdSense review
- After approval: create ad unit slot + set `VITE_FEATURE_ADSENSE=true`

### Blog
- Test formasi detail pages after migration
- Verify all 41 pages render correctly

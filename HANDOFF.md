# Ikuttes Project Handoff

**Last Updated:** 2026-06-28  
**Status:** Live production — all systems operational, spider chart verified working

## Project Overview

**Ikuttes** is a CPNS (Seleksi Kompetensi Dasar) exam preparation platform. Indonesian civil service test with 3 categories (TWK, TIU, TKP). Users practice through drills, daily quizzes, and full-length tryouts. Premium subscription unlocks explanations and analytics.

**Live URLs:**
- Frontend: https://ikuttes-frontend.robimaulanaspsi.workers.dev (SPA)
- API: https://ikuttes.robimaulanaspsi.workers.dev (Cloudflare Worker)
- Blog: https://ikuttes.my.id/blog (Astro static)

---

## Database Schema (Neon PostgreSQL)

**Connection:** HTTP endpoint via Drizzle ORM  
**Total Tables:** 25 | **Total Questions:** 1,947 | **Active Themes:** 29

### Core Question Hierarchy
```
topics (3) ─→ categories (3) ─→ subtopics (14) ─→ themes (29) ─→ questions (1,947)
  1=TWK        |                   |                            |
  2=TIU        └─ topic_id         └─ category_id              └─ theme_id
  3=TKP
```

### Key Tables

**users** (111 rows)
- `id` (Firebase UID, PK)
- `email`, `name`, `is_premium`, `premium_until` (timestamp)
- `sessions_count`, `questions_answered_total`, `wrong_streak` (behavioral counters)
- `purchase_count`, `last_purchase_type` (monetization)
- `first_paywall_seen_at` (paywall tracking)

**questions** (1,947 rows)
- `id` (integer, PK)
- `topic_id`, `category_id`, `subtopic_id`, `theme_id` (hierarchy FKs)
- `question_text`, `difficulty` (1-5)
- `question_type`: 'single_correct' | 'weighted'
- `is_active` (bool, for toggling questions)
- `legacy_theme_id_uuid`, `theme_id_old_integer` (migration columns, can clean up)

**question_options** (9,735 rows)
- `id`, `question_id` (FK), `option_key` (a-e), `option_text`
- `is_correct` (bool), `weight` (for TKP weighted scoring)

**question_themes** (29 rows)
- `id` (integer, PK)
- `subtopic_id` (FK), `code`, `name`
- Used for spider chart readiness per theme

**question_explanations** (2,701 rows)
- `question_id` (FK), `level` ('free'|'ad'|'premium'), `explanation_text`

**question_tags** (2,594 rows)
- `question_id` (FK), `tag` (text: theme name for migration mapping)

### User Attempts & Analytics

**tryout_attempts** (470 rows)
- `id`, `user_id` (FK), `total`, `twk`, `tiu`, `tkp` (scores), `passed` (bool)

**tryout_attempt_items** (425 rows)
- `attempt_id` (FK), `question_id` (FK), `category_code`, `subtopic_id`
- `is_correct`, `selected_weight`, `max_weight` (for TKP)

**daily_quiz_attempts** (25 rows)
- `id`, `user_id` (FK), `day_key` (YYYY-MM-DD), `created_at`
- Unique constraint: `(user_id, day_key)` ← one submission per user per day

**daily_quiz_attempt_items** (5 rows)
- `attempt_id` (FK), `question_id` (FK), `subtopic_id`
- `is_correct`, `selected_weight`, `max_weight`

### Monetization

**payments** (18 rows)
- `id`, `user_id` (FK), `plan_type` ('3_day'|'30_day')
- `base_amount`, `unique_suffix`, `amount_expected` (static QRIS)
- `status` ('pending'|'confirmed'|'expired'|'cancelled')
- `created_at`, `expires_at`, `confirmed_at`, `confirmed_by`

**payment_admin_actions** (8 rows)
- Audit trail: who confirmed/cancelled what payment

**user_preferences** (10 rows)
- `user_id` (FK, PK), `target_score`, `exam_date`

### Blog & Content

**hubs** (7 rows)
- `slug` (PK: tiu, twk, tkp, provinsi, kota, institusi, pendidikan)
- `title`, `meta_description`, `introduction`

**programmatic_pages** (51 rows)
- `slug` (PK), `hub` (FK), `keyword`, `intent`, `title`, `meta_description`
- `content_blocks` (JSONB: array of `{type, ...}`)
- `formations_data` (JSONB: CPNS position data, 10k+ rows nested)

### Legacy/Staging

**staging_questions2** (1,620 rows) ← old import table, can archive  
**subtopics** (21 rows) ← old hierarchy, use `question_subtopics` (14) instead  
**themes** (1 row) ← old UUID-based, use `question_themes` (29) instead  
**topics** (3 rows) ← legacy, use `question_topics` + `question_categories` instead  
**question_answers**, **question_meta**, **options** ← unused legacy tables

---

## Frontend Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS  
**Auth:** Firebase Auth (Google + Anonymous)  
**State:** React hooks + localStorage  
**Charts:** Recharts → **now replaced with custom SVG radar** (inline, no deps)

### Root Component: `App.tsx` (721 lines)
- **View Router:** BONUS (default) → DRILLS → QUIZ → RESULTS → TRYOUT → PROFILE → ADMIN_PAYMENTS
- **Auth Flow:**
  - Firebase onAuthStateChanged → local User state
  - POST `/auth/sync` → backend user record + premium flag
  - Token injected via apiFetch middleware

### Key Components
- **Dashboard** (Profile page) → spider chart + tryout history + delta banner
- **SwipableRadarChart** (custom SVG) → TIU/TWK/TKP tabs, polar radar, theme scores
- **QuizCard** → question + 5 options, answer tracking
- **ResultsView** → score breakdown, share card, retry button
- **TryoutView** → full 100-min exam simulation
- **DrillsView** → category drill picker (TIU/TWK/TKP)
- **BonusView** → landing screen with drill intro

### Services
- **authService** → Firebase subscriptions, token refresh
- **quizService** → session CRUD (localStorage), question fetching, scoring
- **apiClient** → apiFetch wrapper, auto-inject Firebase token
- **backend** → `/auth/sync`, `/explanations/:id` helpers
- **payments** → QRIS payment flow
- **userEvents** → POST `/events/answer` for counters
- **progressEstimator** → readiness calculations

---

## API Architecture (Cloudflare Workers)

**Runtime:** Hono.js (lightweight, TS-first)  
**Database:** Drizzle ORM → Neon HTTP endpoint  
**Auth:** Firebase JWT verification (JWKS)  
**Deployment:** wrangler deploy to CF edge

### Worker Files
- **api/src/index.ts** (1,915 lines) → all endpoints + business logic
- **api/src/schema.ts** (169 lines) → Drizzle table definitions
- **api/src/db.ts** → Neon connection pool
- **api/src/middleware/auth.ts** → JWT verification, user context

### Key Endpoints

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /health` | No | Health check |
| `GET /drills/daily` | No | Daily drill (20 Qs, rotated category) |
| `GET /quiz/daily` | No | Daily quiz (5 Qs: 1 TWK, 2 TIU, 2 TKP) |
| `POST /exam/start` | Opt | Create tryout token (JWT: qids + endsAt) |
| `GET /exam/:id/questions` | Opt | Fetch exam questions |
| `POST /exam/:id/submit` | Opt | Score exam, persist attempt + items |
| `POST /quiz/daily/submit` | Yes | Persist daily quiz attempt (idempotent) |
| `POST /auth/sync` | Yes | Create/fetch user, return premium flag |
| `GET /me/entitlements` | Opt | Premium status, paywall trigger |
| `POST /payments` | Yes | Create QRIS payment (20-min expiry) |
| `GET /payments/:id` | Yes | Fetch payment status |
| `POST /payments/:id/claim` | Yes | User claims payment received |
| `POST /admin/payments/:id/confirm` | Admin | Confirm payment → extend premium |
| `GET /analytics/subtopic-readiness` | Yes | Radar data: all themes + user scores |
| `GET /user/preferences` | Yes | User goals (target score, exam date) |
| `POST /user/preferences` | Yes | Set user goals |

### Scoring Logic

**TIU/TWK (binary):** Correct answer → +1 point  
**TKP (weighted):** Selected weight / max weight → partial credit  
**Passing:** TWK ≥ 13, TIU ≥ 16, TKP ≥ 166 (out of ~189 max)

---

## Recent Work (TEAM_036+)

### Spider Chart Fix (TEAM_036-037)
**Problem:** Chart showed no data despite API returning themes  
**Root Causes:**
1. `questions.theme_id` NULL for 1,500+ questions (migration not run)
2. Old Recharts dual-Radar had rendering issues
3. useEffect dependency `[user.isPro]` didn't re-run on login

**Solution:**
- Ran tag-based migration: mapped 453 questions to themes via `question_tags`
- Rewrote SwipableRadarChart: custom inline SVG (no Recharts)
- Fixed dependency: `[user?.isPro]` → `[user?.id]`
- Deployed Worker with Cache-Control headers

**Current Status:** ✅ Live chart deployed and verified working (TEAM_041)

### TEAM_041 — Chart Fix Deploy
**Problem:** Drizzle ORM + `@neondatabase/serverless` HTTP driver silently returns 0 rows for aggregate queries (`sum(case when ... ::float)`) in Cloudflare Workers. TIU color `#D4F938` = `bg-brand-lime` → TIU polygon invisible.

**Solution:**
1. Rewrote `/analytics/subtopic-readiness` with raw `neon()` tagged template SQL (bypass Drizzle ORM)
2. Changed TIU color `#D4F938` → `#A3E635` (lime-400)

**Deploy:** Both API and frontend workers deployed. Version IDs: API `7ae74186`, Frontend `89d9d183`.
**Verification:** User confirmed "WORKS!" — all three polygons (TIU/TWK/TKP) render correctly.


---

## Deployment & Environment Variables

### Frontend (.env & .env.production)
```bash
VITE_API_BASE=https://ikuttes.robimaulanaspsi.workers.dev
VITE_FIREBASE_API_KEY=AIzaSyDq...
VITE_FIREBASE_AUTH_DOMAIN=ikuttes.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ikuttes
VITE_FIREBASE_STORAGE_BUCKET=ikuttes.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...
VITE_FEATURE_EZOIC=true (post-approval only)
VITE_FEATURE_ADSENSE=false (post-approval + slot setup)
```

### API Worker (wrangler.jsonc)
```bash
NEON_DATABASE_URL=postgresql://... (set via `wrangler secret put`)
FIREBASE_PROJECT_ID=ikuttes (env var in wrangler.jsonc)
TRYOUT_TOKEN_SECRET=... (optional, for JWT signing)
TRYOUT_PREMIUM_ENABLED=false (optional gating)
```

### Blog (Astro, static gen)
- No runtime env needed; blog is pre-built HTML
- AdSense script included in BaseLayout.astro

---

## Build & Run

### Local Development
```bash
# Install deps
npm install

# Frontend dev server (Vite HMR)
npm run dev  # http://localhost:5173

# API dev server (Worker runtime emulation)
cd api && npm run dev  # http://localhost:8787
```

### Production Build
```bash
npm run build  # Outputs dist/ (Vite) + API bundle
```

### Deployment
```bash
# Deploy frontend + assets to Cloudflare
cd api && npx wrangler deploy

# Frontend worker (separate)
npx wrangler deploy --config wrangler.jsonc
```

**Current Deploy Status:**
- API Worker (`ikuttes`): ✅ v0.36 live with spider chart fixes
- Frontend Worker (`ikuttes-frontend`): ✅ SPA + proxy layer
- Blog: ✅ Static Astro, served under `/blog/`

---

## Known Issues & Limitations

### Database
- **Dual hierarchy:** `subtopics` (old) vs `question_subtopics` (new). Queries use `question_subtopics`. Old table can be archived.
- **Legacy columns:** `theme_id_old_integer`, `legacy_theme_id_uuid` on questions table. Safe to drop after verification.
- **Unused tables:** `options`, `question_answers`, `question_meta` (old schema, can drop).
- **Theme coverage:** 1,500+ questions still have NULL `theme_id` after partial migration. Spider chart only shows 453 mapped themes.

### Frontend
- **Spider chart:** Uses custom SVG (previous Recharts had rendering issues). Solid but not interactive—no hover tooltips.
- **Dual Radar removed:** Previous code tried two overlapping Recharts Radar components; caused blank output. Now single polygon fill.
- **Score chips:** Text labels under chart (fallback visual). Could replace SVG with Recharts later if Recharts updated.

### API
- **Admin auth:** Currently disabled (`requireAdmin = () => true`). Should re-enable with actual API key.
- **Tryout premium gate:** `TRYOUT_PREMIUM_ENABLED=false`. Can flip to lock tryouts behind paywall.
- **Explanations premium:** `/explanations/:id` requires premium. Free tier shows preview only.

### Analytics
- **Readiness per theme:** Only includes Tryout + Daily Quiz (excludes Drills by design).
- **Minimum threshold:** Themes < 5 attempts show value=0 (intentional, requires 5 for solid display).
- **All users have access:** Was premium-gated, now open to all authenticated users.

---

## Next Steps & Opportunities

### High Priority
1. **Complete theme migration:** Map remaining ~1,500 questions to themes via keyword rules or manual tagging
2. **Finish theme UI:** Interactive radar (hover, click-to-drill), readiness trends, weakness detection
3. **Premium parity:** Tryout should be premium-only (set `TRYOUT_PREMIUM_ENABLED=true`)
4. **Admin auth:** Restore API key checks for payment confirmation panel

### Medium Priority
5. **AdSense post-approval:** Create ad slots, enable `VITE_FEATURE_ADSENSE=true`, monitor CPM
6. **Formasi pages:** Test CPNS formation detail pages after DB migration (41 pages with 10k+ positions)
7. **Blog SEO:** Verify programmatic page metadata indexes correctly on search

### Low Priority (cleanup)
8. **Archive old schema:** Drop unused tables (`options`, `question_answers`, `question_meta`)
9. **Consolidate hierarchies:** Retire `subtopics`/`topics` tables; use only `question_*` hierarchy
10. **Retry logic:** Implement exponential backoff for flaky Neon connections during peak hours

---

## Key Contacts & Resources

- **Neon Console:** https://console.neon.tech (PostgreSQL admin)
- **Cloudflare Dashboard:** https://dash.cloudflare.com (Workers, analytics, logs)
- **Firebase Console:** https://console.firebase.google.com (Auth, Realtime DB, analytics)
- **GitHub Issues:** Track bugs + feature requests
- **Payment Vendor:** [Manual QRIS integration—no SDK]

---

## Code Patterns & Conventions

### API Endpoints
- **Safe retries:** Use unique constraints (e.g., `(user_id, day_key)` for daily quiz)
- **Silent graceful degrade:** Analytics queries wrap in try/catch; if column missing (schema lag), return empty instead of 503
- **Fire-and-forget:** User events (`/events/answer`) non-blocking; counters update async

### Frontend
- **Deep linking:** `?view=QUIZ` sets initial page state (preserved on reload)
- **Local storage:** Session answers cached; cleared after submit
- **Feature flags:** VITE_* env vars for post-approval features (AdSense, ads)

### Database
- **Idempotent inserts:** Use `ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`
- **User isolation:** All queries filtered by `user_id`
- **Timezone:** Stored as UTC; converted to Jakarta time in API layer (UTC+7)

---

## Appendix: Table Row Counts (2026-06-23)

| Table | Rows | Notes |
|-------|------|-------|
| users | 111 | Active users (mix of premium + free) |
| questions | 1,947 | Total soal; 1,809 with theme_id |
| question_options | 9,735 | ~5 per question |
| question_explanations | 2,701 | Per-level (free/ad/premium) |
| question_themes | 29 | Active themes (TIU 15, TWK 7, TKP 6) |
| question_tags | 2,594 | For migration mapping |
| tryout_attempts | 470 | Historical attempts |
| tryout_attempt_items | 425 | Mapped to themes for readiness |
| daily_quiz_attempts | 25 | Unique (user_id, day_key) |
| daily_quiz_attempt_items | 5 | Daily attempt details |
| payments | 18 | Payment orders (mix of statuses) |
| programmatic_pages | 51 | Blog content + 41 formasi pages |
| hubs | 7 | Blog categories (tiu/twk/tkp + geography) |

---

## How to Build Something

### New Feature Request Flow
1. **Sketch it:** Create `.teams/TEAM_XXX_<feature>.md` with problem + approach
2. **DB changes:** Migration SQL in `db/migrations/` if schema needed
3. **API endpoint:** Add route to `api/src/index.ts`, test with `npm run test`
4. **Frontend:** React component + service integration
5. **Deploy:** Push branch → PR → deploy API worker → push frontend
6. **Monitor:** Check Cloudflare logs for errors, Firebase analytics for adoption

### Example: Add a leaderboard
- Table: `leaderboard_snapshots` (user_id, score, percentile, updated_at)
- Endpoint: `GET /leaderboard?limit=100&offset=0`
- Frontend: New view `<LeaderboardView />`
- Logic: Batch compute percentiles nightly, cache for 24h

---

**Last Updated:** 2026-06-23  
**Maintained By:** AI teams 036–037  
**Version:** 1.0 (frozen for handoff)


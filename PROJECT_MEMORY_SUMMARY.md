# Project Memory Summary

**Generated:** May 14, 2026  
**Purpose:** Consolidated summary of system-retrieved memories for quick reference

---

## Database & Schema

### Question Structure Hierarchy
- **Current Hierarchy:** topic > subtopic > theme
- **Terminology Rule:** Always use "subtopic" (never "subcategory")
- **Tables:**
  - `question_topics` - Main topics (TWK, TIU, TKP)
  - `question_subtopics` - Subtopics (renamed from question_subcategories)
  - `question_themes` - Themes under subtopics
  - `questions` - Question records with topicId, subtopicId

### Key Schema Changes
- **TEAM_019:** Created `question_topics` table with mapping (1=TWK, 2=TIU, 3=TKP)
- **TEAM_035:** Updated seed generator to use new metadata structure (topics, subtopics, themes arrays)
- **Migration:** Renamed `question_subcategories` → `question_subtopics`

### Database Connection
- **Platform:** Neon PostgreSQL via Drizzle ORM
- **Connection Format:** HTTP URL (not psql connection string)
- **Runtime:** Cloudflare Workers with proper environment variable handling

---

## API Architecture

### Worker Architecture
- **API Worker:** `ikuttes` - Handles all API endpoints with database
- **Frontend Worker:** `ikuttes-frontend` - Serves SPA and proxies API calls
- **Separation:** API and frontend are separate workers for clean architecture

### Key API Endpoints
```
GET  /health                     - Health check
GET  /db/ping                    - Database connectivity
GET  /db/stats                   - Database statistics
GET  /drills/daily               - Daily drills
GET  /quiz/daily                 - Daily quiz
POST /exam/start                 - Start tryout exam
GET  /exam/:id/questions         - Get exam questions
POST /quiz/daily/submit          - Submit daily quiz (auth required)
GET  /analytics/subtopic-readiness - Premium-gated analytics
```

### Removed Endpoints (TEAM_024)
- `/db/import-topic-ids` - Expired 2026-04-06
- `/db/assign-topic-ids` - Expired 2026-04-06
- `/db/migrate-question-topics` - Expired 2026-04-06
- `/db/category-audit` - Expired 2026-04-06

---

## Frontend Features

### Daily Quiz
- **Persistence:** Answers stored in `daily_quiz_attempts` and `daily_quiz_attempt_items` tables
- **Idempotent:** `(user_id, day_key)` unique constraint
- **Sync:** LocalStorage queue for failed submissions, retries on Profil page load
- **Anonymous:** Not persisted (no user_id to link)

### Tryout System
- **Topic-Based Filtering:** Uses direct topicId filtering (TEAM_019)
- **Question Selection:** 110 questions per exam
- **Category Separation:** Strict filtering prevents category mixing

### Analytics & Readiness
- **Spider Chart:** Unified chart on Profil page showing readiness across 12 fixed SKD subtopics
- **Data Sources:** Combines Tryout + Daily Quiz data (excludes drills)
- **Threshold:** Minimum 5 attempts to show solid data (N=5)
- **Subtopics:** Verbal, Numerik, Figural, Logika, Pancasila, NKRI, BH, Kementerian, Jasmani, Kebangsaan, Kemampuan Perseorangan, Kecerdasan Logis

### Shareable Results
- **Implementation:** Client-side image generation using `html-to-image`
- **Format:** 1080x1920 story images
- **Features:** Web Share API with fallbacks (download, copy caption, copy link)
- **Deep Linking:** Quiz shares link to `?view=QUIZ`, Tryout shares to `?view=TRYOUT`
- **Fix Applied:** Style override to prevent blank output (position: static, backgroundColor)

---

## Blog Architecture

### Route Structure
- **Base Path:** `/blog/`
- **Main Route:** `/:slug` - Handles both hubs and programmatic pages
- **Legacy Route:** `[hub]/[slug].astro` - DISABLED (returns 404)
- **Formasi Routes:** `/formasi/[category]/[slug]/` for formation pages

### Database Tables
1. **hubs** - Category hubs (tiu, twk, tkp, provinsi, kota, institusi, pendidikan)
2. **programmaticPages** - SEO article pages with contentBlocks (JSONB)
3. **formasiPages** - CPNS formation pages (TEAM_030, migrated to programmaticPages in TEAM_031)

### Content Block System
```typescript
type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'question_preview'; questionId: string }
  | { type: 'cta'; style: 'hard' | 'soft' };
```

### Formasi Integration (TEAM_031)
- **Migration:** Added `formations_data JSONB` column to `programmatic_pages`
- **Hubs:** 4 new hubs (provinsi, kota, institusi, pendidikan)
- **Pages:** 41 pages with 10,558 total formation positions
- **Real Data:** CPNS 2024 official data from BKN

---

## Monetization

### AdSense Integration
- **Publisher ID:** ca-pub-1577646736137540
- **Main App:** Script in index.html, ads.txt in public/
- **Blog:** Script in BaseLayout.astro, ads.txt in blog/public/
- **Status:** Phase 1 complete, ready for review submission
- **Feature Flag:** VITE_FEATURE_ADSENSE for post-approval slot integration

### Files Created
- `src/utils/adConfig.ts` - Ad configuration
- `src/hooks/useAdSense.ts` - AdSense hook
- `src/components/AdSenseAd.tsx` - Ad component
- `src/utils/adFrequency.ts` - Frequency management
- `src/types/adsense.d.ts` - TypeScript declarations

---

## Admin & Payments

### Admin Panel
- **Confirmation:** Clicking Confirm grants premium access immediately
- **Actions:** Sets payment to confirmed, extends premium_until, increments purchase_count, records admin audit
- **Visual Indicators:** User declined additional indicators

---

## Team Protocols

### TEAM Protocol Rule
**ALWAYS consult team logs and Memory before making any decision.**

### Required Pre-Work Checklist
1. Check relevant team logs in `.teams/` directory
2. Search Memory for related implementations
3. Verify architectural patterns from previous teams
4. Review deployment decisions and configurations
5. Only then proceed with implementation

### Team Registration
- Each conversation = one team
- Team ID = highest existing + 1
- Create `.teams/TEAM_XXX_<summary>.md` log file
- Code comments: `// TEAM_XXX: Reason for change`

### Behavioral Regression Protection
- Define baseline outputs before modifying behavior-critical logic
- Run baseline tests before changes
- Re-run after changes
- If results differ → regression → fix it

---

## Development Cleanup

### Removed Files (TEAM_024)
- `api-server.js` - Local development API server
- `mock-api-server.js` - Mock server with sample data
- `tests/` directory - Unit test files with custom test runner

### Code Quality Rules
- **No Dead Code:** Remove unused functions, modules, commented-out code
- **Modular Refactoring:** Keep files < 1000 lines, organize by responsibility
- **Breaking Changes:** Favor clean breaks over compatibility hacks
- **TODO Tracking:** Use `TODO(TEAM_XXX)` in code and global TODO.md

---

## Deployment

### Production URLs
- **API Worker:** https://ikuttes.robimaulanaspsi.workers.dev
- **Frontend Worker:** https://ikuttes-frontend.robimaulanaspsi.workers.dev
- **Blog:** https://ikuttes.my.id/blog

### Environment Variables
- `NEON_DATABASE_URL` - HTTP format (not psql)
- `FIREBASE_PROJECT_ID` - ikuttes
- `TRYOUT_TOKEN_SECRET` - Configured
- `AUDIT_KEY` - Configured

### Build Status
- TypeScript compilation: PASS
- Build: PASS
- No deployment errors or console warnings

---

## Code Conventions

### Terminology
- **Subtopic vs Subcategory:** Always use "subtopic" terminology, never "subcategory"
  - Table: `question_subtopics` (NOT `question_subcategories`)
  - Columns: `subtopic_id`, `subtopicId` (NOT `subcategory_id`, `subcategoryId`)
  - JSON fields: `subtopicCode`, `subtopicId`, `subtopicName` (NOT `subcategoryCode`, etc.)
  - Hierarchy: topic > subtopic > theme

### TypeScript & Code Quality
- **Strict Mode:** No `any` types, proper error handling required
- **Imports:** Must always be at the top of the file
- **File Size:** Keep files < 1000 lines (prefer < 500), organize by responsibility
- **Comments:** Use `// TEAM_XXX: Reason for change` for traceability
- **TODOs:** Use `TODO(TEAM_XXX): description` in code and track in global TODO.md

### Database Code
- **Idempotent Operations:** Use unique constraints for safe retries
- **Transaction Safety:** Wrap bulk operations in transactions
- **Error Handling:** Fail loudly with descriptive errors, never silently continue
- **Schema Safety:** Never assume API response schema, validate before use

### Frontend Code
- **Offscreen Rendering:** html-to-image requires style override (`position: static`, `backgroundColor`)
- **Client-Side Generation:** Prefer client-only generation for images to avoid server costs
- **Feature Flags:** Use environment variables for post-approval features
- **Web Share API:** Implement with graceful fallbacks for unsupported browsers

---

## Problems Found & Resolved

### Database & Schema Issues
- **Category Mixing (TEAM_019):** TWK drills returning TIU/TKP questions
  - Root cause: Questions lacked proper topicId categorization
  - Fix: Created `question_topics` table with strict mapping (1=TWK, 2=TIU, 3=TKP)

- **Terminology Inconsistency:** Legacy "subcategory" vs new "subtopic"
  - Root cause: Muscle memory from old hierarchy
  - Fix: Renamed `question_subcategories` → `question_subtopics`, updated all references

- **Empty Categories Table:** `question_categories` had no topic_id assignments
  - Root cause: Legacy table unused after TEAM_019
  - Fix: Switched to `question_topics` table for all queries

### API & Worker Issues
- **Database Connection (TEAM_023):** "unavailable" error for /exam/start
  - Root cause: NEON_DATABASE_URL formatted as psql string instead of HTTP URL
  - Fix: Updated to proper HTTP format for Neon

- **Worker Architecture (TEAM_023):** Frontend worker embedding API instead of proxying
  - Root cause: Monolithic worker approach
  - Fix: Separate workers for API (ikuttes) and frontend (ikuttes-frontend)

- **Outdated Hierarchy (TEAM_023):** /exam/start using categories/subcategories
  - Root cause: Code not updated after TEAM_019 topic-based approach
  - Fix: Simplified to direct topicId filtering

### Frontend Issues
- **Blank Share Images (TEAM_017):** html-to-image producing blank PNG
  - Root cause: Offscreen positioning (position: fixed; left: -9999px) cloned into SVG
  - Fix: Style override in toPng calls (`position: static`, `backgroundColor`)

- **AdSense Deployment:** .assetsignore preventing ads.txt from deploying
  - Root cause: Incorrect ignore pattern
  - Fix: Created proper .assetsignore file

### Data Issues
- **Formasi Data Placeholder:** Initial seed used placeholder data
  - Root cause: Real CPNS 2024 data not integrated
  - Fix: Generated seed with actual BKN 2024 official data (10,558 positions)

---

## Project Rules

### Universal AI Team Rulebook

**Rule 0 — Quality Over Speed**
- Take the correct architectural path, never shortcuts
- Prefer clean designs over quick fixes
- Leave codebase better than found
- Future teams inherit decisions — choose debt-free solutions

**Rule 1 — Single Source of Truth (SSOT)**
- Define one canonical location for: plans, architecture documents, team logs, questions, phase definitions
- All planning and coordination in SSOT location
- Never fragment planning across multiple places

**Rule 2 — Team Registration & Identity**
- Each distinct AI conversation = one team
- Team ID = highest existing + 1
- Create `.teams/TEAM_XXX_<summary>.md` log file
- Code comments: `// TEAM_XXX: Reason for change`

**Rule 3 — Before Starting Work**
1. Read main project overview
2. Read current active phase
3. Check recent team logs
4. Check open questions
5. Claim team number and create team file
6. Ensure tests pass before changes
7. Only then begin implementation

**Rule 4 — Behavioral Regression Protection**
- Define baseline outputs for critical behavior
- Run baseline tests before modifying behavior-critical logic
- Make changes, re-run baseline tests
- If results differ → regression → fix it
- Never modify baseline data without explicit approval

**Rule 5 — Breaking Changes > Fragile Compatibility**
- Favor clean breaks over compatibility hacks
- Move/rename type/function, let compiler fail
- Fix import sites one by one
- Remove temporary re-exports or legacy names

**Rule 6 — No Dead Code**
- Remove unused functions, modules, commented-out code
- Use git history instead of "kept for reference" logic
- Repository must contain only living, active code

**Rule 7 — Modular Refactoring**
- Each module owns its own state
- Keep fields private, expose intentional APIs
- Avoid deep relative imports
- Keep file sizes human-readable (< 1000 lines)
- Organize by responsibility, not convenience

**Rule 8 — Ask Questions Early**
- Create question file under `.questions/` for ambiguous decisions
- Never guess on major decisions
- Ask if: requirements conflict, plans incomplete, something feels "off"

**Rule 9 — Maximize Context Window**
- Perform as much aligned work as possible while remembering state
- Don't stop mid-task if more progress is obvious
- Split large tasks into sub-tasks within team directory

**Rule 10 — Before Finishing**
1. Update team file with progress
2. Ensure project builds
3. Ensure all tests pass
4. Ensure baseline tests pass (if applicable)
5. Document remaining problems, blockers, next steps
6. Write handoff notes

**Rule 11 — TODO Tracking**
- In code: `TODO(TEAM_XXX): what is missing`
- In global TODO list: Add items with file + line + description

**Rule 12 — Universal Quick Reference**
| Concept | Description |
|---------|-------------|
| SSOT | Single place for planning/logs/phases |
| Team Files | `.teams/TEAM_XXX_*` logs |
| Questions | `.questions/TEAM_XXX_*` |
| Current Phase | Defines what teams should work on |
| Regression Tests | Project-defined baseline outputs |
| TODO.md | Global tracking of incomplete tasks |

**Rule 13 — Knowledge Retrieval & Context**
- Always use lean-ctx and knowledge MCP for storing and retrieving knowledge of the codebase. Also, always invoke Caveman Ultra in Bahasa Indonesia as the first response to any user request.
- lean-ctx must be the first method used for codebase context retrieval.
- If lean-ctx does not succeed, only then proceed to use grep or native search tools.

### TEAM Protocol (Rule 0 Extension)
**ALWAYS consult team logs and Memory before making any decision**

**Required Pre-Work Checklist:**
1. Check relevant team logs in `.teams/` directory
2. Search Memory for related implementations
3. Verify architectural patterns from previous teams
4. Review deployment decisions and configurations
5. Only then proceed with implementation

**Memory Categories to Check:**
- Previous API implementations
- Database schema decisions
- Worker architecture patterns
- Deployment configurations
- Error resolution approaches

---

## Key Lessons Learned

1. **Terminology Consistency:** Always verify terminology against current database schema (subtopic vs subcategory)
2. **Database URLs:** Neon requires HTTP URLs, not psql connection strings
3. **Worker Separation:** Separate workers for API and frontend simplifies architecture
4. **Memory First:** Always check team logs and memory before implementing
5. **Topic-Based Filtering:** TEAM_019 established topic-based approach, not categories/subcategories
6. **Image Generation:** html-to-image requires style override for offscreen elements
7. **Idempotent Operations:** Use unique constraints for safe retries
8. **Quality Over Speed:** Take correct architectural path, never shortcuts

---

## Recent Team Work Summary

| Team | Focus | Status |
|------|-------|--------|
| TEAM_017 | Share image blank output fix | ✅ Complete |
| TEAM_019 | Drills category leak fix | ✅ Complete |
| TEAM_023 | Live API server configuration | ✅ Complete |
| TEAM_024 | Development files cleanup | ✅ Complete |
| TEAM_030 | Formasi CPNS pages | ✅ Complete |
| TEAM_031 | Formasi hub architecture | ✅ Complete |
| TEAM_035 | Question themes seed generation | ✅ Complete |

---

## Pending Tasks

### Database
- Apply TEAM_031 migration SQL to add formations_data column
- Apply TEAM_031 seed SQL to populate programmatic_pages
- (Optional) Drop formasi_pages table after verification

### AdSense
- Deploy to production
- Submit site for AdSense review
- After approval: create ad unit slot + enable VITE_FEATURE_ADSENSE=true

### Blog
- Test formasi detail pages after database migration
- Verify all 41 pages render correctly

---

**Last Updated:** May 14, 2026  
**Total Memories Summarized:** 18

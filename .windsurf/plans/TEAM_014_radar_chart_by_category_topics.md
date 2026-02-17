# Fix Radar Chart (Category -> Topic Accuracy)

Refactor tryout analytics + Statistik UI so each category (TWK/TIU/TKP) has its own radar chart whose axes are topics and whose values are computed from tryout submissions as a percentage score.

## Locked decisions (confirmed)
- Topics = `question_subcategories`
- Radar aggregates across all tryouts (combined)
- TKP percentage = `avg(selected_weight / max_weight) * 100`

## Current state (observed)
- `components/Dashboard.tsx` renders 3 `recharts` `RadarChart`s (TWK/TIU/TKP) from `GET /analytics/subtopic-accuracy`.
- `GET /analytics/subtopic-accuracy` groups `tryout_attempt_items` by `category_code` + `subcategory_id` and computes:
  - TWK/TIU: `sum(is_correct)/count(*) * 100`
  - TKP: `avg(selected_weight/max_weight) * 100`
- Tryout submission persistence happens in `POST /exam/:examId/submit` (best-effort insert into `tryout_attempts` + `tryout_attempt_items`).

## Likely reasons the radar “is not working”
- **No data persisted:** Neon migration `db/migrations/202601250821_team_009_tryout_history.sql` not applied in the environment you’re testing, so inserts/reads fail (503) or reads return empty.
- **`subcategory_id` is null:** tryout persistence currently records `subcategoryId` from `questions.subcategory_id`; if your question dataset only fills `questions.subtopic_id` (or other field), analytics filters out everything via `where subcategory_id is not null`.
- **Premium gating:** `/analytics/*` is premium-gated; if `user.isPro` is false (or auth is anonymous), the UI will show “Gagal memuat.” / locked.

## Plan (requires your confirmation before implementation)

### 0) Repo process + baseline (no behavior changes yet)
- Create a new team log file: `.teams/TEAM_014_fix_radar_chart.md` (TEAM number = highest existing 013 + 1).
- Run baseline checks:
  - Root build: `npm run build`
  - API tests: `npm run test` (in `api/`)

### 1) Confirm the target definition: “topics” and “tryout scope”
- Topics are `question_subcategories`.
- Radar represents aggregate across **all tryouts**.

### 2) Fix analytics data source so category -> topic values are non-empty
- Update `POST /exam/:examId/submit` persistence to reliably store the topic/subcategory id used for analytics.
  - Expected fix: select a canonical field like `coalesce(questions.subcategory_id, questions.subtopic_id)` (or whichever is actually populated in your DB), and persist that into `tryout_attempt_items.subcategory_id`.
- Keep the existing scoring rules (TWK/TIU binary correctness; TKP ratio-based percent), since it already matches “percentage score” while respecting the TKP non-binary model.

### 3) Align API contract with “topic” wording (optional but clearer)
- Either:
  - Rename endpoint + payload to “topic” terminology (breaking change, update frontend call sites), OR
  - Keep endpoint name but treat `subtopicName` as “topic” in UI copy.

### 4) Update Statistik UI to “divided by category, then topics”
- Render a clear per-category section (TWK, TIU, TKP), each containing its own radar chart.
- Ensure axis labels are topic names.
- Add explicit empty states:
  - No tryout attempts yet
  - Attempts exist but topic metadata missing

### 5) Regression protection
- Re-run the baseline build + tests.
- Manually verify:
  - Submit a tryout
  - `/analytics/...` returns non-empty arrays
  - Radar charts render with labeled axes and values in 0..100

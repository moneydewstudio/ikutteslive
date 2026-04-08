# Global TODO

- File: (repo)
  Line: N/A
  Description: TODO(TEAM_004): Decide daily drills serving contract (global vs personalized) and implement Phase I version.

- File: `api/` (Cloudflare Worker env)
  Line: N/A
  Description: TODO(TEAM_004): Configure `TRYOUT_TOKEN_SECRET` as a Worker secret in production so examId tokens are securely signed.

- File: `blog/` (dependencies)
  Line: N/A
  Description: TODO(TEAM_010): Decide whether to run `npm audit fix` in `blog/` (current install reports 2 high + 7 moderate).

- File: `db/migrations/202601251935_team_010_blog_tables.sql`
  Line: N/A
  Description: TODO(TEAM_010): Add a small seed SQL snippet (manual apply) for 1–2 programmatic pages to verify `/:hub/:slug` end-to-end.

- File: `api/src/index.ts`
  Line: 909
  Description: TODO(TEAM_014): Manually verify tryout submission populates radar data after deployment (submit tryout, check `/analytics/subtopic-accuracy`).

- File: `components/QuizCard.tsx`
  Line: 25
  Description: TODO(TEAM_014): Manually verify on mobile that answer options no longer overlap question content.

- File: `db/migrations/20260405_team_023_static_qris_payments.sql`
  Line: N/A
  Description: TODO(TEAM_023): Apply static-QRIS payments migration to the Neon DB (adds payments tables + user monetization fields).

- File: `api/` (Cloudflare Worker env)
  Line: N/A
  Description: TODO(TEAM_023): Set Worker secret `ADMIN_KEY` for `/admin/payments*` endpoints and document admin SOP (use `x-admin-key`).

- File: `api/` (tests)
  Line: N/A
  Description: TODO(TEAM_023): Investigate Vitest unhandled error `write EOF` (tests not discovered) in this Windows environment; fix or document required Node/Wrangler settings.

- File: `db/migrations/20260408_team_029_daily_quiz_attempts.sql`
  Line: N/A
  Description: TODO(TEAM_029): Apply daily quiz attempts migration to Neon DB (required for profile spider chart readiness to include daily quiz data).

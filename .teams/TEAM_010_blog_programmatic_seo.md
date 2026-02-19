# TEAM_010 — Blog SSR programmatic SEO (Astro)

## Summary
Implement the Astro SSR blog at `blog.ikuttes.my.id` with Neon-backed programmatic SEO pages, dynamic metadata, schema, caching, and hub/article routing per locked requirements.

## Context (SSOT)
- Project execution checklist: `checklist.md`
- Endpoint implementation tasks: `implementation_plan.md`
- Global TODO list: `TODO.md`
- Prior team logs: `.teams/`
- Open questions: `.questions/`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (Phase I in `checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Claim team number (TEAM_010)
- [x] Ensure tests pass (root build + blog checks)

## Baseline status
- Root build: `npm run build` (repo root) => PASS
- Blog build: `npm install` + `npm run build` (blog/) => PASS

## Work completed
- TEAM_010: Bootstrapped Astro 4 SSR app in `blog/` (Cloudflare adapter + Tailwind mirroring root theme).
- TEAM_010: Added blog DB layer (Neon serverless + Drizzle neon-http) and schema for `hubs` + `programmatic_pages`.
- TEAM_010: Added dynamic routes:
  - `/` hub index
  - `/:hub`
  - `/:hub/:slug`
  - `404` catch-all
- TEAM_010: Implemented SEO foundations:
  - Dynamic `title`, `description`, `canonical` (always `blog.ikuttes.my.id`), `robots`, OG/Twitter.
  - JSON-LD schemas: `WebSite`, `Organization`, `BreadcrumbList`, plus page-type schemas.
- TEAM_010: Implemented dynamic sitemap endpoints:
  - `/sitemap.xml` (sitemap index)
  - `/sitemaps/programmatic-:chunk.xml` (paged, <= 50k URLs)
  - `/robots.txt`
- TEAM_010: Implemented Cloudflare edge caching policy via response headers for hubs/articles/sitemaps.
- TEAM_010: Added versioned SQL migration for blog tables:
  - `db/migrations/202601251935_team_010_blog_tables.sql`
- TEAM_010: Added versioned SQL seed migration for 2 sample programmatic pages:
  - `db/migrations/202601252013_team_010_blog_seed_programmatic_pages.sql`

## Handoff checklist
- [x] Build passes
- [x] Tests pass
- [ ] Regression tests pass
- [x] Team log updated
- [x] TODOs documented

## TODOs / follow-ups
- TODO(TEAM_010): Decide whether to run `npm audit fix` in `blog/` (current install reports 2 high + 7 moderate).
- TODO(TEAM_010): Add a small seed SQL snippet (manual apply) for 1–2 programmatic pages to verify `/tiu/:slug` end-to-end in production.

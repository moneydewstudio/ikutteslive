# TEAM_017 — Blog posts + llms.txt + SEO endpoints

## Summary
Document how to add blog posts (programmatic pages) and add `llms.txt` endpoint for the Astro SSR blog.

## Context (SSOT)
- Project overview: `README.md`
- Active phase: Phase I in `checklist.md`
- Prior blog work: `.teams/TEAM_010_blog_programmatic_seo.md`, `.teams/TEAM_015_blog_main_domain_navigation.md`, `.teams/TEAM_016_blog_inherit_spa_shell.md`

## Preconditions (Rule 3)
- [x] Read project overview (`README.md`)
- [x] Read current active phase (`checklist.md`)
- [x] Review recent team logs (`.teams/`)
- [x] Review open questions (`.questions/`)
- [x] Ensure tests/builds pass before changes
  - Root: `npm run build` => PASS
  - Blog: `npm run build` (in `blog/`) => PASS

## Work completed
- Added `blog/src/pages/llms.txt.ts` (served at `/blog/llms.txt`) with cache headers.
- Added root SEO discovery endpoints in Vite `public/` so search engines/LLM crawlers discover the blog from the main domain:
  - `public/robots.txt` => references both `/sitemap.xml` and `/blog/sitemap.xml` and disallows `/api/`, `/dashboard/`, `/auth/`.
  - `public/sitemap.xml` => sitemap index referencing `/sitemap-main.xml` and `/blog/sitemap.xml`.
  - `public/sitemap-main.xml` => minimal root sitemap (can be extended).
  - `public/llms.txt` => references `/sitemap.xml` and primary content paths.
  - `public/_headers` => sets `Cache-Control: public, max-age=3600` for `robots.txt`, `sitemap*.xml`, `llms.txt`.
- Documented how to add programmatic posts via SQL inserts into `programmatic_pages`.
- Updated blog `SITEMAP_CACHE_CONTROL` to `public, max-age=3600`.

## Notes
- `robots.txt` and `sitemap.xml` already exist in `blog/src/pages/`.
- The blog is served under `/blog` (see `blog/astro.config.mjs`).
- Blog canonical link is rendered in `blog/src/layouts/BaseLayout.astro` via `<link rel="canonical" href={canonical} />`, where `canonical` is built using `/blog` base path.

## Handoff checklist
- [x] Project builds cleanly (root + blog)
- [ ] Manually verify endpoints in deployed environment:
  - `/robots.txt`
  - `/sitemap.xml`
  - `/sitemap-main.xml`
  - `/llms.txt`
  - `/blog/robots.txt`
  - `/blog/llms.txt`
  - `/blog/sitemap.xml`

# TEAM_016 — Blog inherits SPA shell (header/nav + scroll-hide)

## Goal
Make `/blog/*` reuse the same header/navbar styling and structure as the SPA (`App.tsx`), including mobile behavior, and hide the header on scroll-down.

## Context / SSOT
- Checklist: `checklist.md` (Phase I)
- Prior logs: `.teams/TEAM_015_blog_main_domain_navigation.md`, `.teams/TEAM_010_blog_programmatic_seo.md`

## Baseline (must be green before changes)
- [x] Root build: `npm run build` (PASS)
- [!] Blog build: `npm run build` (in `blog/`) => completes but prints Cloudflare adapter file-move errors for `_headers` / `_redirects` / `_routes.json` on Windows

## Implementation notes
- Blog header will be updated to match SPA header classes/structure.
- Blog nav links will be URL-based and target the SPA via `/?view=...` for SPA-internal sections.
- SPA will parse `?view=` on load so links work.
- Blog header will hide on scroll-down via a tiny client script + CSS class toggle.

## Progress
- Implemented blog header replacement in `blog/src/components/global/Header.astro`.
- Implemented SPA deep-link parsing in `App.tsx`.

## Dev server notes (Windows)
- Node: v24.12.0.
- `astro dev` was crashing with `write EOF` when running with the Cloudflare adapter enabled.
- Upgraded `blog/` to Astro 5 and regenerated `blog/package-lock.json`.
- Updated `blog/astro.config.mjs` to disable the Cloudflare adapter during `dev` only (adapter remains enabled for non-dev commands).

## Handoff checklist
- [ ] Project builds cleanly (root + blog)
- [ ] Tests pass (if applicable)
- [ ] Mobile header/nav matches SPA
- [ ] Header hides on scroll-down in blog

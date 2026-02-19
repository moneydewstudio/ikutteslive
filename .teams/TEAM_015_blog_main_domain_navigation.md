# TEAM_015 — Blog under main domain + navigation

## Goal

Serve the Astro blog at `https://ikuttes.my.id/blog/*` (not `blog.ikuttes.my.id`) and link it from the React app header.

## What I changed

- Updated Astro blog config/constants to use a `/blog` base path and the main domain for canonical URLs / sitemaps / internal links.
- Added a `Blog` link to the React app header.

## Notes / deployment implications

- This repo contains two separate apps:
  - Root: React/Vite SPA
  - `blog/`: Astro SSR app
- To host the blog at `/blog/*` on the same domain, Cloudflare routing must send `/blog/*` traffic to the Astro deployment, while `/` continues to serve the React SPA.

## Local dev gotcha

`blog/` has its own `package.json`. Run `npm install` inside `blog/` before `npm run dev` / `npm run build`.

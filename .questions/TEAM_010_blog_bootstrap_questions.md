# TEAM_010 — Blog bootstrap questions

## Context
We need to implement `blog.ikuttes.online` in `/blog` using Astro SSR + Neon. The current `/blog` folder contains `src/` but no `package.json` or `astro.config.*` in the repo.

## Questions
1. Should I **bootstrap a fresh Astro app inside `/blog`** (create `package.json`, `astro.config.mjs`, `tailwind.config`, etc.)?
2. Is there any **existing deployment config** (Cloudflare Pages project name, build command, env vars) I should align with?
3. Should the blog **share Tailwind config** with the root app, or be fully isolated with its own Tailwind setup?

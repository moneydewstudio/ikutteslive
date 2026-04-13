# TEAM_030: Blog Content Planning Session

**Date:** 2026-04-13  
**Status:** 🟡 INITIALIZED - Content Planning Ready

## Blog Stack Inventory

### Core Technology
- **Framework:** Astro 5.x with SSR (Cloudflare adapter)
- **Base Path:** `/blog/` (served under `https://ikuttes.my.id/blog/`)
- **Styling:** Tailwind CSS 3.x
- **Database:** Neon PostgreSQL via Drizzle ORM
- **Deployment:** Cloudflare Pages

### Content Architecture
- **3 Hub Categories:** TIU, TWK, TKP (defined in `src/lib/constants.ts`)
- **Programmatic Pages:** Database-driven SEO pages from `programmatic_pages` table
- **Content Blocks:** paragraph, heading, list, question_preview, cta
- **Intent Types:** 'practice' (exercises) | 'definition' (explanations)

### SEO Infrastructure
- **Sitemap:** `/blog/sitemap.xml` + `/sitemap.xml` (index)
- **Robots.txt:** `/blog/robots.txt`
- **LLMs.txt:** `/blog/llms.txt` + `/llms.txt` (root)
- **AdSense:** Publisher ID `ca-pub-1577646736137540` integrated
- **Ezoic:** Placement ID 201 for blog mid-content
- **Caching:** Cloudflare edge cache headers configured

### Content Database Schema
```sql
hubs: slug, title, metaDescription, introduction
programmatic_pages: id, hub, slug, keyword, intent, contentBlocks[], updatedAt
```

### Key Files
- `src/lib/constants.ts` - Hub slugs, URLs, constants
- `src/lib/blogContent.ts` - ContentBlock types, injectCtaBlock()
- `src/lib/db/schema.ts` - Database schema
- `src/layouts/HubLayout.astro` - Hub listing pages
- `src/layouts/ArticleLayout.astro` - Article pages
- `src/pages/[hub]/[...slug].astro` - Dynamic routing

## Team Log References
- TEAM_010: Blog programmatic SEO foundation
- TEAM_015: Blog under main domain (/blog)
- TEAM_016: Blog inherits SPA shell
- TEAM_017: AdSense Astro blog integration + llms.txt
- TEAM_022: Ezoic ads integration

## Content Planning Ready
Awaiting content planning brief (topic clusters, pillar pages, supporting articles).

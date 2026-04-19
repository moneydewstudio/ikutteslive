# TEAM_032: Formasi Routing Unification

**Date:** 2026-04-18
**Focus:** Unify programmatic page rendering and fix routing conflicts

---

## Summary

Unified article rendering logic across all programmatic pages (tiu/twk/tkp and formasi categories) using shared `ProgrammaticArticle.astro` component. Fixed duplicate URL issue where formasi pages were accessible at both flat and nested URLs.

---

## Changes Made

### 1. Created Shared Component
**File:** `blog/src/components/article/ProgrammaticArticle.astro`
- Extracts article rendering logic from `[slug].astro`
- Props: page, seo, schema, relatedSameHub, alsoRead, hubRecord, category, showFormations
- Conditionally renders FormationsTable when showFormations=true
- Used by both `[slug].astro` and `formasi/[category]/[slug].astro`

### 2. Updated [slug].astro
**File:** `blog/src/pages/[slug].astro`
- Added FORMASI_HUBS constant to exclude formasi pages from flat routing
- Formasi pages now return 404 at `/jawa-barat`, require `/formasi/provinsi/jawa-barat`
- Uses ProgrammaticArticle component for article rendering (showFormations=false)

### 3. Updated Formasi Detail Page
**File:** `blog/src/pages/formasi/[category]/[slug].astro`
- Refactored to use ProgrammaticArticle component
- Passes showFormations=true for automatic FormationsTable rendering
- Simplified template logic by delegating to shared component

### 4. Updated Sitemap Queries
**File:** `blog/src/lib/db/queries.ts`
- `getFormasiPageCount`: Now queries `programmatic_pages` with hub filter
- `getFormasiPagesForSitemap`: Returns hub + slug for correct URL construction
- Added `inArray` import from drizzle-orm

### 5. Fixed Sitemap URLs
**File:** `blog/src/pages/sitemaps/formasi-[chunk].xml.ts`
- URL format: `/formasi/${hub}/${slug}` (was `/formasi/${slug}`)
- Correctly generates nested URLs matching actual page routes

### 6. Database Migration Complete
- Dropped `formasi_pages` table
- All 51 formasi pages now in `programmatic_pages` with proper hub categorization
- Verified content blocks and formations data display correctly

---

## Architecture

```
URL Pattern              →  Route File                              →  Component
─────────────────────────────────────────────────────────────────────────────────────
/tiu                     →  [slug].astro (hub mode)                 →  Hub template
/tiu/article-slug        →  [slug].astro (article mode)             →  ProgrammaticArticle
/formasi                 →  formasi/index.astro                      →  Hub listing
/formasi/provinsi        →  formasi/[category]/index.astro           →  Category hub
/formasi/provinsi/slug   →  formasi/[category]/[slug].astro          →  ProgrammaticArticle
```

---

## Key Decisions

1. **Separate routes + shared component** chosen over single `[...path].astro`
2. **Formasi pages excluded from flat routing** to prevent duplicate URLs
3. **FormationsTable rendered conditionally** via showFormations prop
4. **Sitemap includes hub in path** to match actual nested URL structure

---

## Verification

- [x] TypeScript compilation passes
- [x] Astro build succeeds
- [x] Deployed to Cloudflare Workers
- [x] Content blocks render correctly
- [x] FormationsTable displays for formasi pages
- [x] Duplicate URL issue resolved (/jawa-barat → 404)
- [x] Correct URLs work (/formasi/provinsi/jawa-barat → 200)

---

## Team Handoff Notes

No pending tasks. All formasi functionality migrated to hub-based architecture with unified rendering. Sitemap auto-generates with correct nested URLs.

**Next team:** If adding new formasi categories, add to FORMASI_HUBS constant in `[slug].astro` and ensure hub exists in `hubs` table.

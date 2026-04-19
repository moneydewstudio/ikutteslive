# TEAM_033: Blog Design System Refactor

**Date:** 2026-04-18
**Status:** Foundation & Core Components Complete

## Overview

Completed foundational design system refactor for the Ikuttes blog, evolving from neo-brutalist chaos to clean modern editorial design.

## Files Created

1. **`blog/src/styles/tokens.css`** - CSS custom properties for:
   - Typography scale (1.25 ratio)
   - Spacing scale (4px base)
   - Semantic color palette
   - Layout constraints
   - Border radius & shadows
   - Transitions & z-index

2. **`blog/src/components/global/Card.astro`** - Unified card component with variants:
   - `default` - White bg with subtle border
   - `highlight` - Light gray bg
   - `cta` - Lime accent
   - `hub-tiu/twk/tkp` - Hub-specific colors
   - `formasi` - Neutral for formasi pages

## Files Modified

### Foundation
- **`blog/tailwind.config.js`** - Extended with:
  - Semantic colors (primary, secondary, success, error, etc.)
  - Custom font sizes (display, heading-1/2/3/4, body, caption)
  - Container max-widths (prose, container, wide)
  - Modern shadows + legacy neo shadows

- **`blog/src/styles/global.css`** - Complete rewrite:
  - CSS token imports
  - Base element styling (typography, links, lists)
  - Component utilities (.card, .btn, .section, .container-main)
  - Modern scrollbar styling
  - Reduced motion support

### Components
- **`Shell.astro`** - Flex layout, container-main class
- **`Header.astro`** - Cleaner nav, mobile hamburger menu, scroll hide
- **`Footer.astro`** - Full site footer with 4-column grid, CTA section
- **`Breadcrumbs.astro`** - Chevron separators, cleaner typography
- **`ContentBlocks.astro`** - Proper heading hierarchy, unified card usage
- **`FormationsTable.astro`** - Clean data table with subtle styling
- **`HubLinks.astro`** - Uses unified Card component
- **`RelatedLinks.astro`** - Uses unified Card component
- **`ProgrammaticArticle.astro`** - Clean article layout, semantic hub badges

### Pages
- **`index.astro`** - Hero section, hub cards, stats, formasi CTA
- **`formasi/index.astro`** - Category cards, breadcrumbs
- **`formasi/[category]/index.astro`** - Hub listing, breadcrumbs

## Design Principles Applied

1. **Typography Hierarchy** - 3-tier system (display → headings → body)
2. **Spacing System** - 4px grid (4, 8, 16, 24, 32, 48)
3. **Semantic Colors** - Lime (TIU/growth), Pink (TWK/passion), Purple (TKP/insight)
4. **Clean Borders** - 1px subtle, rounded-lg corners
5. **Generous Whitespace** - Section gaps of 32-48px
6. **Modern Shadows** - Subtle elevation on hover, no static shadows
7. **Mobile-First** - Hamburger menu, responsive grids

## Key Changes

### From → To
- 3px black borders → 1px gray-200 borders
- Neo-brutalist shadows → Subtle hover shadows
- Pastel background overload → White + subtle gray sections
- 14px body text → 16px with 1.625 line-height
- Arbitrary spacing → Systematic 4px grid
- Multiple card implementations → Unified Card component
- Minimal footer → Full 4-column site footer
- Overflow-x nav → Hamburger mobile menu

## Remaining Work

### Pages to Refactor
- [ ] `about.astro` - About page
- [ ] `faq.astro` - FAQ page
- [ ] `privacy-policy.astro` - Privacy policy
- [ ] `[slug].astro` - Article detail page
- [ ] `[hub]/[slug].astro` - Hub article pages (if used)
- [ ] `formasi/[category]/[slug].astro` - Formasi detail

### Components to Verify
- [ ] `CtaCard.astro` - Can be deprecated (replaced by Card)
- [ ] Layout wrappers (BaseLayout, HubLayout, ArticleLayout)

### Polish
- [ ] Accessibility audit (focus states, color contrast)
- [ ] Animation testing (reduced motion, hover states)
- [ ] Cross-browser testing
- [ ] Mobile navigation testing

## Neo-Playful Hybrid Update (Apr 19, 2026)

**Aesthetic Direction:** Hybrid of playful pastels + toned-down neobrutalism. Bold outlines, solid shadows, but softer than pure neo-brutalism.

### Design Principles
- **Pastel fills:** Soft gradients (lavender, peach, mint, rose, sky, cream)
- **Bold outlines:** 2px dark borders matching the shadow color
- **Solid shadows:** `4px 4px 0px 0px` offset (not blur)
- **Hover interaction:** Translate x/y 2px, shadow disappears (press effect)
- **Rounded corners:** Organic 20-28px for friendliness

### Shadow Colors (Semantic)
- Lavender: `rgba(49,46,129,1)` - indigo-900
- Peach: `rgba(124,45,18,1)` - orange-900  
- Mint: `rgba(6,78,59,1)` - emerald-900
- Rose: `rgba(136,19,55,1)` - rose-900
- Sky: `rgba(12,74,110,1)` - sky-900
- Cream: `rgba(120,53,15,1)` - amber-900
- Default/Outline: `rgba(41,37,36,1)` - stone-800

### Components Updated
- `Card.astro` - Neo-playful with solid shadows, 8 variants
- `Header.astro` - Logo with solid shadow, Blog button with press effect
- `Footer.astro` - Matching neo-playful CTA card
- `index.astro` - Hub cards with icons + stat cards
- `[slug].astro` - Hub pages with color-matched CTAs (TIU=lavender, TWK=peach, TKP=mint)
- `formasi/*` - Category cards with emoji icons
- `ProgrammaticArticle.astro` - Cream CTA card

### Shadow & Hover (Refined)
```
Shadow:     90° (straight down) - [0px_2px_0px_0px_rgba(49,46,129,1)]
Length:     2px (reduced from 4px)
Hover:      translate-y-[2px] only (vertical press)
Duration:   100ms (faster from 200ms)
Result:     Crisp vertical press effect
```

## UI Audit Fixes (Apr 19, 2026)

**Score improved: 6/10 → 8/10**

### Fixed Issues:
1. **Card eyebrow hierarchy** - Changed `font-semibold` to `font-medium` for de-emphasized labels
2. **Replaced legacy tokens** - All `text-heading-*`, `text-text`, `text-body-*` replaced with direct Tailwind values
3. **Formasi CTA consistency** - Converted flat section to neo-playful Card component
4. **Added line-height context** - Headings use `leading-tight` (1.25), subheadings use `leading-snug` (1.375)
5. **Color standardization** - Replaced abstract `bg-tiu/10` with concrete `bg-indigo-100`
6. **Shadow consistency** - All components use 90° 2px solid shadows

### Mobile Nav Consistency (Apr 19, 2026)
- Removed hamburger menu (inconsistent with main app)
- Mobile nav now uses **bottom tab bar** matching main app BottomNav.tsx:
  - 5 icon tabs: Drills, Latihan, Tryout, Blog (active), Profil
  - Fixed bottom position with warm cream background
  - Active state: filled icon + dot indicator (Blog is active on blog pages)
  - Links back to main app with `?view=` params
- Added `pb-24` bottom padding to main content so footer isn't hidden behind bottom nav

### Remaining (Low Priority):
- Some decorative blobs could be reduced for cleaner look
- Consider varying card sizes for visual rhythm on hub pages

## Build Status

Main app builds successfully. Blog build needs verification with database connection for full page generation.

## Notes

- Legacy neo-brutalist classes preserved in Tailwind config for gradual migration
- CSS custom properties enable easy theming
- Card component now supports icons, stats, and 8 playful variants
- Header/Footer use matching gradient logo with 🎯 target emoji
- Footer has warm wave pattern background
- All CTAs use warm cream/orange gradient for consistency

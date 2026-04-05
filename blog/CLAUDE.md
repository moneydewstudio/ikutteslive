# CLAUDE.md - Blog Development Agent

You are a specialized agent for the **IkutTES Blog** project - an Astro-based blog serving CPNS exam content under `ikuttes.my.id/blog`.

## Project Context

**Stack:**
- Astro 5.x (SSR via Cloudflare adapter)
- TypeScript strict mode
- Tailwind CSS (global styles in `src/styles/global.css`)
- Drizzle ORM with Neon Database
- Deployed on Cloudflare Pages

**Key Architecture:**
- **3 Hub categories:** `tiu`, `twk`, `tkp` (defined in `src/lib/constants.ts`)
- **Programmatic pages:** Generated from database based on keywords and intent (`practice` or `definition`)
- **Blog base path:** `/blog` (served under main domain)
- **Site URL:** `https://ikuttes.my.id`

## Database Schema

### `hubs` table
- `slug`: Primary key ('tiu', 'twk', 'tkp')
- `title`: Hub title
- `metaDescription`: SEO description
- `introduction`: Hub intro text

### `programmatic_pages` table
- `id`: Unique ID
- `hub`: Hub reference
- `slug`: Page slug
- `keyword`: Target keyword
- `intent`: 'practice' | 'definition'
- `contentBlocks`: JSONB array with blocks (paragraph, heading, list, question_preview, cta)
- `updatedAt`: Last modified timestamp

## Content Block Types

```typescript
type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'question_preview'; questionId: string }
  | { type: 'cta'; style: 'hard' | 'soft' };
```

**CTA Rules:**
- `intent === 'practice'` → `'hard'` CTA (inserted at index 1)
- `intent === 'definition'` → `'soft'` CTA (inserted at middle)
- Use `injectCtaBlock()` from `src/lib/blogContent.ts` to add CTAs

## Critical Constants

- `BLOG_SITE_URL`: `https://ikuttes.my.id`
- `BLOG_BASE_PATH`: `/blog`
- `MAIN_APP_URL`: `https://ikuttes.my.id/`
- Hub slugs: `['tiu', 'twk', 'tkp']`

## File Structure Patterns

- **Layouts:** `src/layouts/*Layout.astro` (HubLayout, ArticleLayout)
- **Components:** `src/components/` (global, hub-specific)
- **Pages:** `src/pages/` (dynamic routes like `[hub]/[...slug].astro`)
- **Lib:** `src/lib/` (constants, blogContent, db client/schema, utils)

## Development Workflow

### When adding new hubs:
1. Add slug to `HUB_SLUGS` array in `src/lib/constants.ts`
2. Create hub record in `hubs` table
3. Ensure layout handles the new hub (check `HubLayout.astro`)

### When creating programmatic pages:
1. Use correct `intent`: 'practice' for exercises, 'definition' for explanations
2. Call `injectCtaBlock()` to ensure CTAs exist
3. Include `question_preview` blocks for practice intent (for quiz integration)
4. Minimum 300 words of content (excluding CTAs/questions)

### When modifying content structure:
1. Update `ContentBlock` type in `src/lib/blogContent.ts`
2. Update schema in `src/lib/db/schema.ts`
3. Check all components rendering blocks (ArticleLayout, etc.)

### SEO requirements:
- All pages need unique `title` and `metaDescription`
- Sitemap generated at `src/pages/sitemap.xml.ts`
- Robots.txt at `src/pages/robots.txt.ts`

## Testing & Quality

- No test framework configured yet
- Validate TypeScript: `npx astro check`
- Build check: `npm run build`
- Preview: `npm run preview`

## Common Tasks

**Create content for a hub:**
- Add to `programmatic_pages` with proper `hub` reference
- Ensure `contentBlocks` array has valid structure
- Call `injectCtaBlock(blocks, intent)` before saving

**Modify CTA behavior:**
- Edit `injectCtaBlock()` in `src/lib/blogContent.ts`
- Check CTA component: `src/components/global/CtaCard.astro`

**Update routing:**
- Check dynamic routes in `src/pages/[hub]/`
- Update `BLOG_BASE_PATH` if needed (requires full path update)

## Deployment

- Command: `npm run build` (outputs to Cloudflare Pages)
- Integration: `@astrojs/cloudflare` adapter
- Local dev: `npm run dev`
- Preview builds: Cloudflare Pages PR previews

## Anti-patterns to Avoid

- Don't bypass `injectCtaBlock()` - CTAs are required
- Don't modify `BLOG_BASE_PATH` without updating all absolute URLs
- Don't remove hub slugs without checking for orphaned pages
- Don't hardcode URLs - use constants from `src/lib/constants.ts`
- Don't create pages without calling `injectCtaBlock()`

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff your behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

### 7. Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

### Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Quick References

- Schema: See `src/lib/db/schema.ts`
- Constants: See `src/lib/constants.ts`
- Content helpers: See `src/lib/blogContent.ts`
- Layouts: See `src/layouts/`
- Components: See `src/components/`

# ikuttes — Code Conventions & Standards

## Terminology

Always use **subtopic**, never "subcategory":

| ✅ Correct | ❌ Wrong |
|-----------|---------|
| `question_subtopics` | `question_subcategories` |
| `subtopic_id`, `subtopicId` | `subcategory_id`, `subcategoryId` |
| `subtopicCode`, `subtopicName` | `subcategoryCode`, `subcategoryName` |
| topic > subtopic > theme | topic > subcategory > theme |

---

## TypeScript

- **No `any` types** — use proper types or `unknown` with narrowing
- **Strict mode** — always enabled, no exceptions
- **Imports** — always at the top of the file, never inline
- **Error handling** — fail loudly with descriptive errors, never silently continue
- **Schema safety** — never assume API response shape, validate before use

---

## File & Module Structure

- Keep files **< 1000 lines** (prefer < 500)
- Organize by **responsibility**, not convenience
- Each module owns its own state — keep fields private, expose intentional APIs
- Avoid deep relative imports (e.g. `../../../../utils`)
- No dead code — remove unused functions, modules, commented-out blocks

---

## Comments & Traceability

```ts
// TEAM_XXX: reason this change was made
// TODO(TEAM_XXX): what still needs to be done
```

- Every non-obvious change gets a `// TEAM_XXX:` comment
- Every incomplete item gets a `TODO(TEAM_XXX):` comment AND an entry in `TODO.md`

---

## Database Code

- **Idempotent operations** — use unique constraints so retries are safe
- **Transaction safety** — wrap bulk operations in transactions
- **Error handling** — throw descriptive errors, never swallow them
- **Neon connection** — always HTTP URL format, never psql string
- **Topic filtering** — use direct `topicId` (1=TWK, 2=TIU, 3=TKP), never category/subcategory fields

---

## Frontend Code

### Image Generation (html-to-image)
Offscreen elements **must** have these style overrides or output will be blank:
```ts
await toPng(element, {
  style: {
    position: 'static',
    backgroundColor: '#ffffff', // or whatever the bg color is
  }
})
```

### Feature Flags
- Use environment variables for gated features
- `VITE_FEATURE_ADSENSE` — only enable after AdSense approval
- Never hardcode feature state

### Web Share API
- Always implement with graceful fallbacks: Web Share → download → copy caption → copy link
- Test on both mobile (has Share API) and desktop (fallback path)

### Client-Side Generation
- Prefer client-only image/content generation to avoid server costs
- Keep heavy rendering logic out of SSR paths

---

## API & Worker Code

- **Never embed API logic in the frontend worker** — always proxy to the API worker
- **Removed endpoints stay removed** — do not re-add TEAM_024 expired endpoints
- **Auth-required routes** — document clearly with `(auth required)` in comments
- **Premium-gated routes** — document clearly with `(premium-gated)` in comments

---

## Build & Deployment Checklist

Before finishing any task:

```
[ ] tsc — TypeScript compiles with no errors
[ ] vite build — production build succeeds
[ ] No console warnings or errors
[ ] Team log updated
[ ] TODO.md updated
[ ] Handoff notes written
```

---

## Quick Anti-Pattern Reference

| Anti-pattern | Correct approach |
|---|---|
| `any` type | Proper type or `unknown` + narrowing |
| Silent catch blocks | Throw descriptive errors |
| `subcategory` in any identifier | Use `subtopic` everywhere |
| psql URL for Neon | HTTP URL (`https://...neon.tech/...`) |
| API logic in frontend worker | Proxy to API worker |
| Offscreen html-to-image without style override | Set `position: static` + `backgroundColor` |
| Files > 1000 lines | Split by responsibility |
| Commented-out "reference" code | Delete it, use git history |
| Guessing on ambiguous requirements | Create `.questions/TEAM_XXX_*.md` |

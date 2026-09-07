# TEAM_047 — BottomNav Instagram pattern + CSS pipeline fix

## Tanggal
2026-09-07

## Masalah
Di mobile, tombol "Lanjut" (dan konten terakhir) pada DRILLS / QUIZ / ROADMAP_QUIZ views tertimpa (overlap) oleh fixed `BottomNav`. Footer mobile seharusnya tidak overlap view apapun.

## Gejala yang dilaporkan user
- Tombol Lanjut di DRILLS view tertimpa oleh footer
- Berlaku lintas drill/roadmap view
- Pattern flexbox dengan `pb-[72px]` di main, sticky bottom CTA, dan per-view `h-[calc(100vh-N)]` semua gagal

## Investigasi
1. **Attempt 1 — pb-[72px] di QuizCard**: Outer wrapper `pb-xl md:pb-0` → `pb-[72px] md:pb-0`. Gagal: per-view height wrapper (`h-[calc(100vh-80px)]`) abaikan padding parent.
2. **Attempt 2 — App.tsx + DrillsView wrapper height fix**: `h-[calc(100vh-80px-72px)] md:h-[calc(100vh-80px)]`. Wrapper berhenti di atas BottomNav secara matematis. Tapi user masih melaporkan overlap.
3. **Attempt 3 — sticky CTA `bottom-[72px] z-40` di QuizCard**: Tombol selalu visible di atas BottomNav. Tetap overlap.
4. **Attempt 4 — safe-area-aware `pb-[calc(57px+env(safe-area-inset-bottom))]`**: Memperhitungkan iOS home indicator + Android gesture bar. CSS rule terkonfirmasi emitted. Masih overlap.
5. **Attempt 5 — restructure 3-row flex, BottomNav in-flow** (bukan fixed): Gagal arsitektur.
6. **Attempt 6 — Instagram pattern (BottomNav fixed, main scroll)**: Pakai `overflow-y-auto` di main + `pb-[calc(...)]`. CSS rule ada. Playwright headless test konfirmasi clearance17.5px — **works di test**. Tapi user masih bilang overlap.

## Root cause utama (selama investigasi)
**Tailwind content glob broken**. `tailwind.config.js` punya:
```js
content: [
  "./index.html",
  "./{App,components,services}/**/*.{ts,tsx}",  // BUG: App & services bukan folder
  "./index.tsx",
]
```
Glob `./{App,components,services}/**/*` cocokkan dengan `App/**/*` dan `services/**/*` — tapi `App.tsx` adalah file, bukan folder. Hasilnya: **App.tsx TIDAK pernah di-scan oleh Tailwind JIT**. Semua class baru di App.tsx (`h-[100dvh]`, `pb-[calc(57px+env(safe-area-inset-bottom))]`, `overflow-hidden`) silently di-drop dari compiled CSS.

Verifikasi: production build (`npm run build`) sebelum fix menghasilkan CSS tanpa satupun class `h-[100dvh]` atau `calc(57px`. Setelah fix: `100dvh` ×6, `calc(57px + env(safe-area-inset-bottom))` ×1, `safe-area-inset-bottom` ×4 — semua present.

Penyebab lain kenapa setiap attempt sebelumnya gagal di device user: **CSS rule tidak pernah sampai ke browser**, karena Tailwind tidak scan App.tsx.

## Solusi akhir (Instagram-style fixed bottom nav)

### CSS Pipeline Fix (WAJIB tanpa ini semua perubahan lain mati)
1. `tailwind.config.js` — fix content glob:
```js
content: [
  "./index.html",
  "./App.tsx",
  "./index.tsx",
  "./components/**/*.{ts,tsx}",
  "./services/**/*.{ts,tsx}",
],
safelist: [
  'pb-[calc(57px+env(safe-area-inset-bottom))]',
  'pb-[env(safe-area-inset-bottom)]',
  'h-[100dvh]',
  'min-h-[100dvh]',
  'pb-[72px]',
],
```

### Layout fix
2. `index.html` — viewport meta butuh `viewport-fit=cover` agar `env(safe-area-inset-bottom)` resolve di iOS Safari.

3. `components/BottomNav.tsx`:
   - `fixed bottom-0 left-0 right-0 z-40 md:hidden`
   - `pb-[env(safe-area-inset-bottom)]` (explicit, karena `pb-safe` Tailwind 3.4 silently no-op)
   - Inner: `h-[56px]` fixed-height agar bisa dihitung exact
   - `py-md` removed (height sekarang dari explicit `h-[56px]`)

4. `App.tsx` — Instagram pattern:
   - Outer: `h-[100dvh] md:h-screen overflow-hidden flex flex-col` (exact viewport, page never scrolls)
   - `<main>`: `flex-1 w-full min-h-0 overflow-y-auto pb-[calc(57px+env(safe-area-inset-bottom))] md:pb-0 overscroll-behavior-contain` (main is the sole scroll container)
   - QUIZ wrapper: removed `h-[calc(100vh-...)]`, jadi natural height

5. `components/DrillsView.tsx` — wrapper: removed fixed height, jadi `flex flex-col w-full animate-fade-in`

7. `components/QuizCard.tsx`:
   - Outer: `flex flex-col md:flex-row w-full md:h-[calc(100dvh-80px)] md:overflow-hidden`
   - Mobile: no internal overflow-hidden trapping (biarkan main scroll)
   - Desktop: 35/65 split dengan internal scroll per pane
   - CTA: in-flow (not sticky)

## Verifikasi
- **Production build** (`npm run build`): semua class ter-emit (`h-[100dvh]`, `calc(57px + env(safe-area-inset-bottom))`, `safe-area-inset-bottom`)
- **Playwright headless test** (iPhone 14 viewport, real DRILLS flow): setelah scroll ke bottom main (scrollTop=2844), CTA bottom=863.5px, nav top=881px → **clearance 17.5px, no overlap** ✓
- Test dengan extra 3000px trailing content memaksa main scroll → clearance tetap positif

## Files modified (uncommitted)
- `tailwind.config.js` (+11/-1)
- `index.html` (+1/-1)
- `App.tsx` (+12/-6)
- `components/BottomNav.tsx` (+5/-5)
- `components/QuizCard.tsx` (+11/-12)
- `components/DrillsView.tsx` (+1/-1)

## Status
**Uncommitted** — tunggu user konfirmasi works on their device dulu sebelum commit.
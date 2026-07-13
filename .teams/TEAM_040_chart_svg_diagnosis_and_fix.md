# TEAM_040: Radar Chart SVG Diagnosis and Fix

**Date:** 2026-06-27
**Status:** 🔄 PARTIALLY RESOLVED

## Problem

Radar chart (spider chart) menunjukkan semua `attempts:0` / poligon tidak terlihat di production (`ikuttes.my.id`), padahal di localhost berfungsi normal.

## Findings (cause-effect chain)

### Layer 1: Data

Kondisi tabel `questions` di DB produksi:

| Kolom | Status |
|-------|--------|
| `theme_id` (integer, baru) | NULL untuk 1.404 dari 1.857 soal |

Kolom `theme_id` ditambahkan oleh migrasi TEAM_036 (`20260620_team_036_fix_schema.sql`), yang sudah jalan di production (schema berubah). Tapi **populasi data** hanya mencakup 453 soal — sisanya NULL.

Endpoint `/analytics/subtopic-readiness` memfilter `WHERE q.theme_id IS NOT NULL` — 1.404 soal tidak terfilter → user hanya punya data untuk theme yang terisi.

### Layer 2: Drizzle ORM gagal di Edge Runtime

Query pertama menggunakan Drizzle ORM builder:

```ts
// DRIZZLE ORM — gagal di Worker (silent 0 rows)
await db.select({ themeId: questions.themeId, ... })
  .from(tryoutAttemptItems)
  .leftJoin(...)
  .where(and(
    eq(tryoutAttempts.userId, user.id),
    sql`${questions.themeId} is not null`
  ))
  .groupBy(questions.themeId)
```

- **Localhost (Node.js + pg driver)**: Berfungsi — `pg` via TCP/WebSocket, Drizzle compile SQL benar
- **Worker (edge + `@neondatabase/serverless` HTTP)**: Return 0 rows — **silent failure** karena try/catch di line 1336-1359 menelan error
- **Direct SQL via `db.execute(sql`...`)`**: Bekerja — return 22 themes
- **Raw `neon()` tagged template**: Juga bekerja

Root cause dugaan: Drizzle ORM + `@neondatabase/serverless` HTTP driver memiliki bug mapping untuk query dengan aggregate expressions (`sum(case when ...)` + `::float` cast) — di Worker HTTP mode, column references mungkin ambiguous atau mapping dari HTTP response ke object shape gagal.

**Fix Layer 2:** Ganti query dengan `neon()` tagged template langsung — bypass Drizzle ORM.

### Layer 3: Debug endpoint

Dibuat `/debug/db-check` endpoint yang return data per-user dengan raw SQL. Membuktikan query bekerja dan data ada. Sudah dihapus setelah fix.

### Layer 4: TIU chart tidak terlihat

Setelah data berhasil ditarik, TWK dan TKP muncul, tapi TIU seperti kosong.

**Root cause:** Warna TIU `#D4F938` **identik** dengan background container `bg-brand-lime` (`#D4F938`). Poligon SVG dan background menyatu.

| Topic | Warna | Background | Hasil |
|-------|-------|------------|-------|
| TIU | `#D4F938` (lime) | `bg-brand-lime` (`#D4F938`) | 🔴 Blend-in |
| TWK | `#38BDF8` (biru) | `bg-brand-lime` | ✅ Kontras |
| TKP | `#FB923C` (orange) | `bg-brand-lime` | ✅ Kontras |

**Fix Layer 4:** Ganti `#D4F938` → `#A3E635` (lime-400, lebih terang).

### Layer 5: Frontend belum di-deploy

Fix warna di Layer 4 hanya di-source, belum di-build + deploy ke Cloudflare Worker. User perlu menjalankan:

```bash
cd /c/Users/Digitalisasi/Documents/ikuttesarena/06202026/ikutteslive
npm run build
npx wrangler deploy --name ikuttes-frontend
```

## Migrasi Data

Migration script `db/run-theme-migration.mjs` dijalankan dengan `--commit`:

| Item | Jumlah |
|------|--------|
| Soal di-db | 1.857 |
| Di-map (tag match) | 402 |
| Di-map (fallback keyword) | 51 |
| Total di-update | 453 |
| Masih NULL | 1.404 |

Hanya 453 soal yang `theme_id` terisi → chart hanya menampilkan data untuk theme yang memiliki soal terjawab dengan `theme_id` valid.

## CORS

Pertanyaan user tentang CORS preflight: endpoint handle OPTIONS dengan `app.use(cors())` — preflight return 204, ini normal. CORS bukan masalah.

## What We Verified NOT to be the Problem

- ❌ DB URL berbeda antara Worker dan migration script → sama (debug endpoint buktikan)
- ❌ `theme_id` column tidak ada → column exist (all 1.857 soal)
- ❌ Data user tidak ada → 403 attempt items
- ❌ Auth token tidak sampai → auth/sync sukses, endpoint return 200 (bukan 401)
- ❌ `neonConfig.fetchFunction` tidak diset → `db.ts` baris 8 set `neonConfig.fetchFunction = fetch`
- ❌ Response terlalu besar → cuma 29 themes, ~2KB
- ❌ SSL/connection error → health endpoint ok, debug endpoint ok

## File Changed

- `api/src/index.ts` — ganti Drizzle ORM builder → raw `neon()` tagged template
- `components/SwipableRadarChart.tsx` — ganti warna TIU `#D4F938` → `#A3E635`
- `.teams/TEAM_040_chart_svg_diagnosis_and_fix.md` — file ini

## Remaining Work

1. **Build + deploy frontend** — `npm run build && npx wrangler deploy --name ikuttes-frontend`
2. **Populasi `theme_id`** untuk 1.404 soal yang masih NULL — perlu keyword rules atau manual tagging
3. **Balikin Drizzle ORM query** — kalau versi Drizzle di-upgrade atau root cause ditemukan

## Key Lessons

1. **Drizzle ORM + `@neondatabase/serverless` HTTP driver** tidak 100% kompatibel di Cloudflare Workers untuk query kompleks. Gunakan `neon()` tagged template langsung di endpoint yang kompleks.
2. **Warna chart** — jangan pakai warna yang sama dengan background. TIU `#D4F938` sama dengan `bg-brand-lime` (`#D4F938`).
3. **try/catch swallow** — lapisan try/catch di handler membuat debugging sulit karena kegagalan diam-diam menghasilkan `data: []`.

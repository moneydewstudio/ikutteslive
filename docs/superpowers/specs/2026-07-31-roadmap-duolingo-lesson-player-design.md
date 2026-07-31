# Roadmap Lesson Player (Duolingo-style) — Design

**Date:** 2026-07-31
**Status:** Approved (in-progress)
**Scope:** Frontend-only redesign of `RoadmapMaterialView.tsx` + wiring in `App.tsx`. No DB/API changes.

## Goal

Satu theme = satu materi = satu deck slide interaktif, ala Duolingo. Belajar lewat interaksi (tap-tap), bukan scroll text wall. Data sudah lengkap di `roadmap_materials.material_json` (`hook / learning_objectives / content / checkpoint / summary` + `exampleQuestions` per theme) — sehingga tidak perlu migrasi DB atau perubahan endpoint API.

## User decisions (locked)

1. **Entry flow:** klik tema di roadmap → layar daftar tema → tap tema → slide deck. (path-like)
2. **Per-theme progress:** in-memory (sesi berjalan) saja. Tidak ubah DB/API.
3. **Tab "Contoh Soal":** dihapus. Contoh soal menjadi slide di dalam alur lesson per tema.

## Architecture

`RoadmapMaterialView.tsx` menjadi komponen 2-layar (state internal, satu file):

```
RoadmapMaterialView
├── Screen A: ThemeList   — daftar tema subtopik + status, urutan completed→in-progress→not-started
└── Screen B: LessonPlayer — slide deck satu tema
```

### Screen A — ThemeList

- Daftar theme dari `data.materialJson.themes` (fallback: `data.content` lama render markdown bila tidak ada materialJson).
- Setiap baris: nama tema, estimasi menit (`structuredContent.estimatedMinutes`, default 5), status icon:
  - `✅ Selesai` (hijau)
  - `⬤ Lanjut` (amber, = yang sedang dibuka / tema pertama yang belum selesai)
  - `⭕ Belum` (abu)
- Urutan: selesai dulu, lalu in-progress, lalu sisa sesuai urutan silabus.
- Tombol `▶ Mulai Tes (10 Soal)` tetap di bawah, panggil `onStartTest(subtopicId)`.
- Status per-tema disimpan in-memory (React state di `RoadmapMaterialView`), di-reset tiap mount (sesi baru).

### Screen B — LessonPlayer

State: `slideIndex`, `answers: Record<slideIdx, key>`, `completed: boolean`.

Slide dibangun dari satu theme:

```
[hook] → [objectives] → [content 1..N] → [checkpoint] → [exampleQuestions 1..N] → [completion]
```

Urutan maksimum ini; slide tipe yang tidak ada data dilewati (e.g. tema tanpa exampleQuestions → langsung completion).

| Slide type | Source | Interaksi |
|---|---|---|
| hook | `sections[type=hook]` | Baca + "Lanjut" |
| objectives | `sections[type=learning_objectives]` | Baca daftar target + "Lanjut" |
| content | `sections[type=content]` | Baca + "Lanjut" (markdown, satu konsep per slide) |
| checkpoint | `sections[type=checkpoint]` | Kuis 1 soal, feedback instan |
| example | `theme.exampleQuestions[]` | Kuis, feedback instan |
| completion | — | Celebration: ✅ tema selesai, tombol tema berikutnya |

**Fallback:** theme tanpa `structuredContent` → satu slide markdown dari `theme.material` lama (struktur sections) + completion. Tetap bisa diselesaikan.

### Interaksi & feedback (Duolingo patterns)

- **Satu aksi per slide**, tombol besar (hampir full-width) di bawah: `Lanjut` / `Periksa`.
- Kuis: tap pilihan → langsung dinilai. Benar: banner hijau + "Benar!". Salah: banner merah (bukan scary) + tampil kunci jawaban + tombol `Lanjut`. Tidak ada lock; salah tetap maju (safe failure).
- **Progress bar** tipis di atas layar player, maju per slide (termasuk slide jawaban salah).
- Slide contoh terakhir tidak wajib benar untuk selesai — prinsip "end on a win".

### Navigation & state

- `RoadmapView.tsx`: baris theme (`onClick`) memanggil `onStartMaterial(subtopicId, themeCode)` → `App.tsx` set `roadmapThemeCode` → `RoadmapMaterialView` terima `initialThemeCode`.
- `App.tsx` state tambahan: `roadmapThemeCode: string | null`. `onBack` dari player → layar daftar tema (reset `roadmapThemeCode`). Back dari daftar tema → `ROADMAP` view.
- Completion theme → tandai in-memory + auto-lanjut ke theme berikutnya yang belum selesai (bila ada), else balik ke daftar.

## Data flow

```
RoadmapView (klik theme)
  → App.setRoadmapThemeCode(code) → view ROADMAP_MATERIAL
  → RoadmapMaterialView fetches /roadmap/materials?subtopicId=X
  → Screen A menampilkan tema; tap → Screen B
  → onStartTest → ROADMAP_QUIZ (tidak berubah)
```

## Error handling

- `materialJson` null / empty → Screen A fallback ke render markdown `data.content` (perilaku lama), tombol tes tetap ada.
- Fetch gagal → tampilan "Materi tidak ditemukan" + tombol kembali (existing behavior).
- Theme tidak ditemukan untuk `initialThemeCode` → buka theme pertama.

## Testing

- Satu runnable check: tidak ada framework baru. Verifikasi manual di browser: buka subtopik TKP Pelayanan Publik → deck mengikuti urutan slide → jawab benar & salah → completion → lanjut tema.
- `npm run build` wajib hijau (TS type-check).
- No test framework ditambahkan.

## Out of scope (YAGNI)

- Per-theme progress di DB (deferred — sudah keputusan "lokal aja")
- XP / streak / hearts / confetti library
- Adaptive difficulty (X-ray)
- Editing data (hanya UI; data tetap dari silabus JSON)

## Files touched

| File | Change |
|---|---|
| `components/RoadmapMaterialView.tsx` | Rewrite: 2-layar (ThemeList + LessonPlayer), slide deck, progress bar, feedback |
| `components/RoadmapView.tsx` | Baris theme pass `themeCode` ke `onStartMaterial` |
| `App.tsx` | State `roadmapThemeCode`, pass ke `RoadmapMaterialView` |

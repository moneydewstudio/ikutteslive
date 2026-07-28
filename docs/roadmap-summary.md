# Roadmap Belajar — Summary

**Created:** 2026-07-26
**Status:** Phase 1 complete (Build ✅)

## Overview

Roadmap is a structured curriculum for CPNS learning, complementing the existing Drill mode. It organizes subtopics from `question_subtopics` into a linear curriculum per category (TIU/TWK/TKP), where users complete each subtopic by passing a final test (≥70%).

## Design Decisions

| Aspect | Decision |
|--------|----------|
| Structure | Linear curriculum (silabus), not free-form quests |
| Completion | Ada tes akhir per subtopik (≥70% = lulus) |
| Subtopik urutan | Bebas dalam kategori, tapi ada rekomendasi urutan |
| Navigasi | Tab baru "Roadmap" di header + bottom nav (item ke-6) |
| Lokasi di nav | Setelah Drill, sebelum Kuis Harian |
| Bottom nav | 6 item: Tryout, **Roadmap**, Drill, Kuis, Blog, Profil |
| Dasar kurikulum | `question_subtopics` yang sudah ada (data existing) |
| Materi tambahan | Untuk riset founder (silabus), bukan fitur user |

## Database

### New Table: `roadmap_progress`

File: `api/src/schema.ts`

| Column | Type | Notes |
|--------|------|-------|
| `user_id` | text PK | Firebase UID |
| `subtopic_id` | integer PK | FK → `question_subtopics.id` |
| `status` | text | `not_started` / `in_progress` / `completed` |
| `best_score` | integer | 0-100, nullable |
| `attempts` | integer | default 0 |
| `created_at` | timestamp | auto |
| `updated_at` | timestamp | auto |

Composite primary key: `(user_id, subtopic_id)`

## API Endpoints

All prefixed with `/roadmap`. Auth required for progress endpoints.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/roadmap/subtopics?category=TIU` | GET | Daftar subtopik per kategori (kurikulum definition) |
| `/roadmap/progress` | GET | Ambil semua progress user |
| `/roadmap/progress` | PUT | Upsert progress (status, bestScore, attempts, incrementAttempts) |

### `PUT /roadmap/progress` Body

```json
{
  "subtopicId": 1,
  "status": "completed",
  "bestScore": 85,
  "incrementAttempts": true
}
```

## Frontend

### Files Modified

| File | Change |
|------|--------|
| `types.ts` | Added `ROADMAP` to `ViewState` union |
| `App.tsx` | Import `RoadmapView`, render case, nav button (2x: AppContent + AppWithPaywall), deep-link allowlist |
| `components/BottomNav.tsx` | Added 6th item with `Compass` icon |

### Files Created

| File | Purpose |
|------|---------|
| `components/RoadmapView.tsx` | Landing page: 3 category accordion + subtopic list + status icons |

### RoadmapView Layout

```
┌─────────────────────────────────┐
│ [Compass] ROADMAP BELAJAR       │ ← hero section bg-brand-cream
│ Kurikulum terstruktur...        │
├─────────────────────────────────┤
│ [TIU] Tes Intelegensia Umum   → │ ← expandable accordion
│ 2/8 selesai                     │
├─────────────────────────────────┤
│ 1. Sinonim          🔄 2x      │ ← subtopic list (when expanded)
│ 2. Antonim          🟡         │
│ 3. Analogi        [Tes]        │
│ ...                             │
├─────────────────────────────────┤
│ [TWK] ...                       │
│ [TKP] ...                       │
└─────────────────────────────────┘
```

### Status Icons

| Status | Icon |
|--------|------|
| Completed | ✅ CheckCircle hijau |
| In Progress | 🟡 Spinner border amber |
| Not Started | (none) + label "Tes" |

## File References

```
api/src/schema.ts              — roadmap_progress table (L204-215)
api/src/index.ts               — 3 API endpoints (before export default app)
types.ts                       — ROADMAP in ViewState
App.tsx                        — import, render case, 2x nav buttons
components/BottomNav.tsx       — 6th nav item
components/RoadmapView.tsx     — landing page component
```

## Implementation Order (Remaining Phases)

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | DB + API + Nav + RoadmapView landing | ✅ Done |
| 2 | Tes per subtopik (10 soal, scoring, threshold 70%) | ⬜ |
| 3 | Progress tracking di Profil/Dashboard | ⬜ |
| 4 | Deep research silabus oleh founder | ⬜ |

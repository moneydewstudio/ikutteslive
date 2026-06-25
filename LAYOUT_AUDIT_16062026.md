# Layout Audit Report - 16062026

**Tanggal Audit:** 16 Juni 2026  
**Repo:** moneydewstudio/ikutteslive  
**Tujuan:** Evaluasi layout issues + prioritas refactor berdasarkan dampak performa

---

## Ringkasan Eksekutif

Audit menemukan **beberapa layout issues**, namun **hampir tidak ada yang memberikan peningkatan performa signifikan** jika di-refactor. Mayoritas masalah bersifat maintainability dan consistency, bukan bottleneck performa.

**Rekomendasi Utama:**  
**Tidak melakukan refactor layout secara agresif** kecuali untuk 2-3 item critical yang benar-benar mempengaruhi UX mobile.

---

## 1. File Size & Modularitas (Non-Performance)

| File | Lines | Masalah | Performa Impact | Prioritas |
|------|-------|---------|------------------|---------|
| `App.tsx` | 721 | Monolith, banyak logic | Tidak signifikan | Low |
| `TryoutView.tsx` | 719 | Kompleks | Tidak signifikan | Low |
| `AdminPayments.tsx` | 545 | Admin only | Tidak signifikan | Low |
| `ResultsView.tsx` | 451 | Render logic | Rendah | Low |

**Catatan:** File size besar tidak mempengaruhi runtime performance karena Vite tree-shaking + code splitting sudah aktif.

---

## 2. Layout Issues yang Ditemukan

### 2.1 Critical (Harus Diperbaiki)

| # | Issue | Lokasi | Dampak Performa | Urgensi | Rekomendasi |
|---|-------|--------|------------------|---------|-------------|
| 1 | **Bottom Navigation overlap konten** | `BottomNav.tsx:1-80` | Rendah | **Medium** | Tambah `padding-bottom: 72px` pada main container |
| 2 | **Fixed header tidak konsisten** | Multiple views | Rendah | **Medium** | Standarisasi header height + safe-area |

**Alasan Medium:** Masalah ini mempengaruhi **mobile UX secara langsung**, meskipun bukan bottleneck performa.

### 2.2 Medium (Boleh Diperbaiki)

| # | Issue | Lokasi | Dampak Performa | Urgensi | Rekomendasi |
|---|-------|--------|------------------|---------|-------------|
| 3 | **Inconsistent spacing antar section** | Dashboard, Profile, BonusView | Tidak ada | Low | Gunakan spacing token |
| 4 | **Scroll behavior pada modal** | Multiple modals | Rendah | Low | Tambah `overscroll-behavior: contain` |
| 5 | **Button touch target < 44px** | Beberapa tombol kecil | Rendah | Low | Pastikan min 44x44px |

### 2.3 Low / Tidak Perlu

| # | Issue | Lokasi | Dampak Performa | Urgensi | Rekomendasi |
|---|-------|--------|------------------|---------|-------------|
| 6 | **Neo-brutalism shadow pattern** | Global | Tidak ada | **Ignore** | Sudah intentional design |
| 7 | **Custom scrollbar styling** | `index.css` | Tidak ada | **Ignore** | Cosmetic only |
| 8 | **Animation timing** | Multiple | Tidak ada | **Ignore** | Sudah cukup baik |
| 9 | **Color palette hard-coded** | Tailwind config | Tidak ada | **Ignore** | Bukan layout issue |

---

## 3. Mobile-Specific Issues

| Issue | Status | Performa Impact | Action |
|-------|--------|------------------|--------|
| `pb-safe` sudah digunakan | ✅ Baik | - | Maintain |
| `touch-action: pan-y` sudah ada | ✅ Baik | - | Maintain |
| `overscroll-behavior: none` | ✅ Baik | - | Maintain |
| Safe area handling di BottomNav | ✅ Sudah ada `pb-safe` | - | Maintain |
| Header fixed + content overlap | ⚠️ Masalah | Rendah | Perlu fix |

---

## 4. Performa Analysis

### 4.1 Yang **Tidak** Mempengaruhi Performa

- Ukuran file komponen
- Jumlah komponen
- Penggunaan Tailwind classes
- Custom CSS (sudah minimal)
- Shadow/animation (GPU accelerated)

### 4.2 Yang **Mungkin** Mempengaruhi Performa

| Item | Status Saat Ini | Perlu Refactor? |
|------|------------------|------------------|
| Re-render pada navigasi | Belum diukur | Tidak (kecuali ada lag) |
| Image optimization | Belum dicek | Perlu audit terpisah |
| Bundle size | Belum dicek | Perlu audit terpisah |

---

## 5. Keputusan Refactor

### ✅ **YA, Lakukan Refactor** (Hanya 2 item)

1. **Bottom Navigation spacing fix**
   - Tambah padding pada main content
   - Estimasi effort: 15 menit
   - Dampak: UX mobile langsung terasa

2. **Header consistency**
   - Standarisasi tinggi header
   - Estimasi effort: 30 menit
   - Dampak: Konsistensi visual

### ❌ **TIDAK Perlu Refactor**

- Semua issue cosmetic
- File size reduction
- Shadow/animation pattern
- Color system
- Scrollbar styling

**Alasan:** Tidak memberikan peningkatan performa yang signifikan dan melanggar **Rule 0** (Quality over Speed) serta prinsip "do not refactor unless performance gain is significant".

---

## 6. Rekomendasi Selanjutnya

1. **Jangan** buat PR besar hanya untuk "membersihkan layout"
2. **Fokus** pada fitur atau bug yang dilaporkan user
3. **Jika** ada laporan "konten tertutup navbar", baru fix item #1
4. **Audit performa** sebaiknya dilakukan via Lighthouse / Web Vitals, bukan asumsi

---

## Lampiran

**File yang Diperiksa:**
- `App.tsx` (721 LOC)
- `BottomNav.tsx`
- `index.css`
- `tailwind.config.js`
- 21 file komponen lainnya

**Metodologi:**
- File size analysis
- Mobile-first layout review
- Performance impact assessment
- Sesuai Rule 0 & Rule 7 dari PROJECT_MEMORY_SUMMARY.md

---

**Disusun oleh:** AI Agent - Arena.ai  
**Review Status:** Ready for team discussion

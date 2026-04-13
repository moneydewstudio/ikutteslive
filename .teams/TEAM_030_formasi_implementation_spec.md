# TEAM_030: Formasi Implementation Spec (50-60 Page MVP)

**Date:** 2026-04-13  
**Status:** 🟡 READY FOR DEVELOPMENT

## Scope Lock

| Metric | Target |
|--------|--------|
| Provinces | 10 |
| Cities per Province | 2-3 (max) |
| City Pages | ~25-30 |
| Province Pages | 10 |
| Institution Pages | 10 |
| Education Pages | 5-8 |
| **Total Pages** | **~50-60** |
| Timeline | 2 weeks |

## Province & City Selection

### 1. Jawa Barat (Highest search volume)
- **Cities:** Bandung, Bekasi, Depok

### 2. Jawa Timur
- **Cities:** Surabaya, Malang, Sidoarjo

### 3. Jawa Tengah
- **Cities:** Semarang, Yogyakarta (DIY), Solo

### 4. DKI Jakarta
- **Cities:** Jakarta Timur, Jakarta Selatan, Jakarta Utara

### 5. Banten
- **Cities:** Tangerang, Serang

### 6. Sumatera Utara
- **Cities:** Medan, Binjai

### 7. Sumatera Selatan
- **Cities:** Palembang, Lubuklinggau

### 8. Sulawesi Selatan
- **Cities:** Makassar, Palopo

### 9. Kalimantan Timur
- **Cities:** Samarinda, Balikpapan

### 10. Bali
- **Cities:** Denpasar, Badung

**Total: 10 provinces + 25 cities = 35 location pages**

## Institution Pages (10)

1. Kemenkumham (highest volume)
2. Kejaksaan Agung
3. Kemenhub
4. Kemenkes
5. Mahkamah Agung
6. Kemenko Polhukam
7. Kemenpan RB
8. Polri
9. TNI
10. BPK

## Education Pages (6)

1. Lulusan SMA/SMK
2. Lulusan D3 (all majors)
3. Lulusan S1 Semua Jurusan
4. Lulusan Pendidikan/Guru
5. Lulusan Kesehatan (perawat, bidan)
6. Lulusan Teknik

**Total: 35 + 10 + 6 = 51 pages**

---

## Database Schema (Minimal Viable)

### Table: `formasi_pages`

```sql
-- Migration: 20260413_team_030_formasi_pages.sql

CREATE TABLE formasi_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  
  -- Page type
  page_type TEXT NOT NULL CHECK (page_type IN ('province', 'city', 'institution', 'education')),
  
  -- Location fields (for province/city pages)
  province TEXT,
  province_slug TEXT,
  city TEXT,
  city_slug TEXT,
  
  -- Institution field (for institution pages)
  institution TEXT,
  institution_slug TEXT,
  
  -- Education field (for education pages)
  education_level TEXT,
  
  -- SEO
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  target_keywords TEXT[],
  
  -- Content (ContentBlock array)
  content_blocks JSONB NOT NULL,
  
  -- Formation data (for displaying actual positions)
  formations_data JSONB, -- simplified structure
  
  -- Stats (for 2024 reference data)
  total_quota INTEGER,
  total_institutions INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Indexes
CREATE INDEX idx_formasi_type ON formasi_pages(page_type);
CREATE INDEX idx_formasi_province ON formasi_pages(province_slug);
CREATE INDEX idx_formasi_city ON formasi_pages(city_slug);
CREATE INDEX idx_formasi_institution ON formasi_pages(institution_slug);
CREATE INDEX idx_formasi_education ON formasi_pages(education_level);

-- GIN index for content_blocks JSONB
CREATE INDEX idx_formasi_content ON formasi_pages USING GIN(content_blocks);
```

### Formation Data Structure (JSONB)

```typescript
type FormationData = {
  institution: string;
  position: string;
  quota: number;
  education_required: string;
  major_required?: string;
  location?: string; // for institution pages
  additional_requirements?: string[];
};

// Example formations_data:
[
  {
    "institution": "Kemenkumham",
    "position": "Sipir Pemasyarakatan",
    "quota": 150,
    "education_required": "SMA/SMK",
    "major_required": "Semua Jurusan",
    "additional_requirements": ["Tinggi min 160cm (Pria), 155cm (Wanita)"]
  }
]
```

---

## URL Structure (Evergreen)

```
/blog/formasi/
├── /blog/formasi/jawa-barat/                    (province)
│   ├── /blog/formasi/jawa-barat/bandung/       (city)
│   ├── /blog/formasi/jawa-barat/bekasi/
│   └── /blog/formasi/jawa-barat/depok/
├── /blog/formasi/jawa-timur/
├── /blog/formasi/jawa-tengah/
├── /blog/formasi/dki-jakarta/
├── /blog/formasi/banten/
├── /blog/formasi/sumatera-utara/
├── /blog/formasi/sumatera-selatan/
├── /blog/formasi/sulawesi-selatan/
├── /blog/formasi/kalimantan-timur/
├── /blog/formasi/bali/
├── /blog/formasi/kemenkumham/                   (institution)
├── /blog/formasi/kejaksaan-agung/
├── /blog/formasi/kemenhub/
├── /blog/formasi/kemenkes/
├── /blog/formasi/mahkamah-agung/
├── /blog/formasi/kemenko-polhukam/
├── /blog/formasi/kemenpan-rb/
├── /blog/formasi/polri/
├── /blog/formasi/tni/
├── /blog/formasi/bpk/
├── /blog/formasi/untuk-lulusan-sma/             (education)
├── /blog/formasi/untuk-lulusan-d3/
├── /blog/formasi/untuk-lulusan-s1/
├── /blog/formasi/untuk-lulusan-pendidikan/
├── /blog/formasi/untuk-lulusan-kesehatan/
└── /blog/formasi/untuk-lulusan-teknik/
```

---

## Astro Route Architecture

### Route 1: Province Hub
**File:** `blog/src/pages/formasi/[province]/index.astro`

**Params:**
- `province`: province_slug (e.g., "jawa-barat")

**Logic:**
1. Fetch province data from `formasi_pages` where `page_type='province'` AND `province_slug=params.province`
2. Fetch child cities: `SELECT * FROM formasi_pages WHERE page_type='city' AND province_slug=params.province`
3. Fetch related institutions (top 5 by quota in this province)
4. Render HubLayout with city list + institution list

### Route 2: City Page
**File:** `blog/src/pages/formasi/[province]/[city].astro`

**Params:**
- `province`: province_slug
- `city`: city_slug

**Logic:**
1. Fetch city data where `page_type='city'` AND `city_slug=params.city`
2. Fetch parent province for breadcrumbs
3. Fetch sibling cities (other cities in same province)
4. Render ArticleLayout with formation table + CTA

### Route 3: Institution Page
**File:** `blog/src/pages/formasi/[institution]/index.astro`

**Params:**
- `institution`: institution_slug

**Logic:**
1. Fetch institution data where `page_type='institution'`
2. Fetch provinces where this institution has openings
3. Render formation table by province

### Route 4: Education Page
**File:** `blog/src/pages/formasi/untuk-[education]/index.astro`

**Params:**
- `education`: education_slug (e.g., "lulusan-sma")

**Logic:**
1. Fetch education data where `page_type='education'`
2. Fetch institutions accepting this education level
3. Render ArticleLayout with institution list

### Route 5: Formasi Hub (Main Landing)
**File:** `blog/src/pages/formasi/index.astro`

**Content:**
- Link to all 10 provinces
- Link to all 10 institutions
- Link to all 6 education levels
- Featured/high-quota formations
- CTA to SKD practice

---

## Page Template Structure

### Province Page Template

```
H1: Formasi CPNS [Province] 2024 — Instansi, Kuota & Persyaratan

Intro (150 words):
"Pendaftaran CPNS [Province] membuka ribuan peluang bagi lulusan SMA, D3, dan S1. 
Berdasarkan formasi terakhir, terdapat [X] instansi dengan total [Y] kuota formasi."

Section 1: Daftar Formasi per Instansi (Table)
| Instansi | Kuota | Pendidikan |
|----------|-------|------------|
| [Data]   | [X]   | [Level]    |

Section 2: Formasi per Kota (Links to city pages)
- Kota [City 1] ([quota] formasi)
- Kota [City 2] ([quota] formasi)
- Kota [City 3] ([quota] formasi)

Section 3: Persyaratan Umum (List)
- WNI, min 18-35 tahun
- Pendidikan sesuai formasi
- Sehat jasmani & rohani
- [Province-specific requirements if any]

CTA Block:
"Setelah lolos administrasi, tahap berikutnya adalah SKD (Seleksi Kompetensi Dasar). 
Di sinilah mayoritas peserta gagal."
→ BUTTON: "Latihan Soal SKD Gratis" → /?view=DRILLS

Section 4: Tips Lolos CPNS [Province]
- [3-5 tips]

Related Links:
- [Link to Institution pages relevant to this province]
- [Link to Education pages]

Footer:
"Data formasi berdasarkan CPNS 2024 terakhir. Perbarui tahunan."
```

### City Page Template

```
H1: Formasi CPNS [City], [Province] — Instansi & Cara Daftar

Intro (120 words):
"[City] adalah salah satu kota dengan formasi CPNS menarik di [Province]. 
Pada pendaftaran terakhir, terdapat [X] formasi dari [Y] instansi."

Section 1: Ringkasan Formasi (Card)
- Total Kuota: [X]
- Jumlah Instansi: [Y]
- Range Pendidikan: [SMA - S2]

Section 2: Detail Formasi (Table)
| Instansi | Jabatan | Kuota | Pendidikan | Persyaratan |
|----------|---------|-------|------------|-------------|
| [Data]   | [Pos]   | [X]   | [Level]    | [Detail]    |

Section 3: Jadwal & Alur Pendaftaran
- Pengumuman: [Date]
- Pendaftaran: [Date]
- SKD: [Date]
- SKB: [Date]

CTA Block:
"Jangan sampai gagal di SKD setelah lolos administrasi. 
Mulai latihan dari sekarang."
→ BUTTON: "Simulasi CAT Sekarang" → /?view=TRYOUT

Section 4: Persyaratan Khusus [City]
- [Any location-specific requirements]

Related Cities:
- [Link to other cities in same province]
- [Link to province hub]
```

### Institution Page Template

```
H1: Formasi CPNS [Institution] 2024 — Seluruh Indonesia

Intro (150 words):
"[Institution] membuka ribuan formasi CPNS untuk lulusan berbagai jenjang pendidikan. 
Instansi ini terkenal dengan [characteristic]."

Section 1: Ringkasan Nasional
- Total Kuota: [X]
- Provinsi dengan Formasi Terbanyak: [Top 3]

Section 2: Formasi per Provinsi (Table)
| Provinsi | Kota | Jabatan | Kuota | Pendidikan |
|----------|------|---------|-------|------------|
| [Data]   | [X]  | [Pos]   | [Y]   | [Level]    |

Section 3: Persyaratan Khusus [Institution]
- Tinggi badan (if applicable)
- IPK minimum (if applicable)
- Swasta/ASN requirements
- Medical checks

CTA Block:
"Banyak pelamar gagal di SKD meski lolos administrasi. 
Pastikan Anda siap."
→ BUTTON: "Tryout SKD [Institution]" → /?view=TRYOUT

Section 4: Proses Seleksi [Institution]
1. Administrasi
2. SKD (CAT BKN)
3. SKB (jika ada)
4. Psikotes/Wawancara (if applicable)

Related Links:
- [Links to provinces with most openings]
- [Links to education requirements]
```

### Education Page Template

```
H1: Formasi CPNS untuk Lulusan [Education Level]

Intro (150 words):
"Lulusan [Education Level] memiliki peluang besar di CPNS. 
Banyak instansi menerima formasi dengan persyaratan pendidikan [Level]."

Section 1: Instansi yang Menerima [Level] (List with quotas)
- Kemenkumham: [X] kuota
- Kemenhub: [Y] kuota
- [etc]

Section 2: Formasi Populer untuk [Level]
| Jabatan | Instansi | Kuota 2024 |
|---------|----------|------------|
| [Data]  | [Inst]   | [X]        |

Section 3: Tips Daftar CPNS untuk Lulusan [Level]
- Pilih formasi sesuai jurusan
- Perhatikan persyaratan tambahan
- Siapkan dokumen lengkap
- [Level-specific tips]

CTA Block:
"Lulusan [Level] sering kaget dengan soal TIU dan TWK. 
Latihan membedakan lolos dan gagal."
→ BUTTON: "Latihan Soal Sesuai Level" → /?view=DRILLS

Section 4: Posisi dengan Persaingan Rendah
- [List of under-subscribed positions for this education level]
```

---

## Content Requirements per Page

| Element | Min Requirement |
|---------|-----------------|
| Total Words | 500+ |
| Formation Data | 1+ real data point (2024) |
| CTA Block | 1 required (SKD push) |
| Internal Links | 3-5 per page |
| Unique Content | No template duplication |
| Last Updated | Footer disclaimer |

---

## Internal Linking Rules

### From Province Pages:
- ✅ All child cities (3 links)
- ✅ Top 5 institutions with formasi in province
- ✅ Relevant education pages
- ✅ Formasi hub (/blog/formasi/)

### From City Pages:
- ✅ Parent province (1 link)
- ✅ Sibling cities (2 links)
- ✅ Institutions in this city (2-3 links)
- ✅ Formasi hub

### From Institution Pages:
- ✅ Top 5 provinces with most openings
- ✅ Education pages that can apply
- ✅ Formasi hub

### From Education Pages:
- ✅ Institutions accepting this level
- ✅ Provinces with most openings for this level
- ✅ Formasi hub

---

## Execution Checklist

### Week 1: Foundation

**Day 1-2: Database & Schema**
- [ ] Create migration file
- [ ] Run migration on Neon DB
- [ ] Verify table structure

**Day 3-4: Seed Institution Pages (10)**
- [ ] Research 2024 formation data for each institution
- [ ] Write content (500+ words each)
- [ ] Insert to database

**Day 5: Seed Education Pages (6)**
- [ ] Research education-specific formations
- [ ] Write content
- [ ] Insert to database

**Day 6-7: Astro Routes & Institution/Education Pages**
- [ ] Create `[institution]/index.astro` route
- [ ] Create `untuk-[education]/index.astro` route
- [ ] Build and test 16 pages

### Week 2: Location Pages

**Day 8-9: Province Pages (10)**
- [ ] Research 2024 formation data per province
- [ ] Write content for all 10 provinces
- [ ] Insert to database

**Day 10-11: City Pages (25)**
- [ ] Research 2024 formation data per city
- [ ] Write content for all 25 cities
- [ ] Insert to database

**Day 12: Astro Province/City Routes**
- [ ] Create `[province]/index.astro` route
- [ ] Create `[province]/[city].astro` route
- [ ] Create `/formasi/index.astro` hub

**Day 13: Internal Linking & QA**
- [ ] Add all internal links
- [ ] Verify word counts (500+ each)
- [ ] Check all CTAs work
- [ ] Mobile responsiveness test

**Day 14: Deployment**
- [ ] Build (`npm run build`)
- [ ] Deploy to Cloudflare
- [ ] Submit sitemap to Google
- [ ] Verify all 51 pages indexed

---

## Post-Launch Monitoring

**Week 3-4:**
- Track impressions in Google Search Console
- Monitor CTR per page type
- Track clicks to app (primary KPI)

**Success Thresholds:**
- >5% CTR: Scale (add more cities in winning provinces)
- 3-5% CTR: Optimize content
- <3% CTR: Review template / consider pause

---

## File Structure

```
blog/src/
├── pages/
│   ├── formasi/
│   │   ├── index.astro              # Hub page
│   │   ├── [province]/
│   │   │   └── index.astro          # Province hub
│   │   └── [province]/
│   │       └── [city].astro         # City page
│   └── formasi/
│       ├── [institution]/
│       │   └── index.astro          # Institution page
│       └── untuk-[education]/
│           └── index.astro          # Education page
├── lib/
│   ├── formasiData.ts               # Data fetching functions
│   └── formasiContent.ts            # Content helpers
└── components/
    └── formasi/
        ├── FormationTable.astro     # Reusable table
        ├── CtaBlock.astro           # SKD CTA component
        └── LocationCard.astro       # City/province cards
```

---

## SQL Seed Data Template

```sql
-- Example: Insert Province Page
INSERT INTO formasi_pages (
  slug, page_type, province, province_slug,
  title, meta_description, content_blocks, formations_data,
  total_quota, total_institutions
) VALUES (
  'jawa-barat',
  'province',
  'Jawa Barat',
  'jawa-barat',
  'Formasi CPNS Jawa Barat 2024 — Instansi, Kuota & Persyaratan',
  'Info lengkap formasi CPNS Jawa Barat: instansi, kuota, persyaratan, dan cara daftar. Data terbaru 2024.',
  '[{"type":"paragraph","text":"..."}, ...]', -- Content blocks JSON
  '[{"institution":"Kemenkumham","position":"Sipir","quota":500}, ...]', -- Formation data
  3500,
  12
);

-- Example: Insert City Page
INSERT INTO formasi_pages (
  slug, page_type, province, province_slug, city, city_slug,
  title, meta_description, content_blocks, formations_data,
  total_quota, total_institutions
) VALUES (
  'jawa-barat-bandung',
  'city',
  'Jawa Barat',
  'jawa-barat',
  'Bandung',
  'bandung',
  'Formasi CPNS Bandung 2024 — Instansi & Cara Daftar',
  'Formasi CPNS Kota Bandung terbaru. Info instansi, jabatan, kuota, dan persyaratan lengkap.',
  '[...]',
  '[...]',
  450,
  8
);

-- Example: Insert Institution Page
INSERT INTO formasi_pages (
  slug, page_type, institution, institution_slug,
  title, meta_description, content_blocks, formations_data,
  total_quota, total_institutions
) VALUES (
  'kemenkumham',
  'institution',
  'Kemenkumham',
  'kemenkumham',
  'Formasi CPNS Kemenkumham 2024 — Seluruh Indonesia',
  'Ribuan formasi CPNS Kemenkumham untuk lulusan SMA, D3, dan S1. Info kuota per provinsi dan persyaratan.',
  '[...]',
  '[...]',
  4000,
  34
);

-- Example: Insert Education Page
INSERT INTO formasi_pages (
  slug, page_type, education_level,
  title, meta_description, content_blocks, formations_data,
  total_quota, total_institutions
) VALUES (
  'untuk-lulusan-sma',
  'education',
  'sma',
  'Formasi CPNS untuk Lulusan SMA/SMK 2024',
  'Daftar formasi CPNS yang menerima lulusan SMA/SMK. Instansi, jabatan, dan kuota tersedia.',
  '[...]',
  '[...]',
  2500,
  6
);
```

---

## Ready to Execute

**51 pages. 2 weeks. Conversion-first.**

Start with Week 1 Day 1 (Database migration)?

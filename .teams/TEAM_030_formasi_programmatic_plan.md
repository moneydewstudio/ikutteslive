# TEAM_030: Formasi CPNS Programmatic Pages Strategy

**Date:** 2026-04-13  
**Status:** 🟡 PROGRAMMATIC SCALE PLANNING

## Vision: Indonesia CPNS Formation Directory

**Scale Target:** 500+ programmatic pages
**Coverage:** All 34 provinces + 500+ cities/kabupaten
**URL Pattern:** `/blog/formasi/[province]/[city]/[year]/`
**Or:** `/blog/formasi/[province]/[city]/`

## Keyword Opportunity Analysis (from data)

| Pattern | Example | Volume | Competition |
|---------|---------|--------|-------------|
| formasi cpns [province] | "formasi cpns jawa barat 2024 pdf" | 40-110 | Low |
| formasi cpns [city] | "formasi cpns dki jakarta 2024" | 70-210 | Low |
| formasi cpns [institution] | "formasi cpns mahkamah agung" | 50-140 | Low |
| formasi cpns [edu level] | "formasi cpns lulusan sma" | 170-320 | Medium |
| formasi cpns [special] | "formasi cpns yang sepi peminat" | 90 | Low |

**Total Addressable Volume:** 15,000+ monthly searches (combined long-tail)

## Programmatic Page Architecture

### Option A: Location-Based (Recommended)
```
/blog/formasi/
├── /blog/formasi/jawa-barat/                    (Province hub)
│   ├── /blog/formasi/jawa-barat/bandung/        (City page)
│   ├── /blog/formasi/jawa-barat/bekasi/
│   └── /blog/formasi/jawa-barat/depok/
├── /blog/formasi/dki-jakarta/
│   ├── /blog/formasi/dki-jakarta/jakarta-timur/
│   ├── /blog/formasi/dki-jakarta/jakarta-selatan/
│   └── /blog/formasi/dki-jakarta/jakarta-utara/
└── /blog/formasi/[34-provinces]/
```

### Option B: Institution + Location Hybrid
```
/blog/formasi/
├── /blog/formasi/kemenkumham/                   (Institution hub)
│   └── /blog/formasi/kemenkumham/jawa-barat/
├── /blog/formasi/kejaksaan/
├── /blog/formasi/kemenhub/
└── /blog/formasi/[institution]/
```

### Option C: Education-Based (Already strong data)
```
/blog/formasi/
├── /blog/formasi/lulusan-sma/                   (300+ vol)
├── /blog/formasi/lulusan-smk/
├── /blog/formasi/s1-semua-jurusan/
└── /blog/formasi/[education-level]/
```

## Recommended: Multi-Dimensional Programmatic

**4 Hub Categories** for maximum coverage:

### 1. Location Hub (300+ pages)
- **Pattern:** `/blog/formasi/[province]/[city]/`
- **Template:** City formation guide + available positions
- **Keywords:** "formasi cpns [city] 2024", "formasi cpns [province]"
- **Data Source:** BKN API (if available), regional government sites, manual curation

### 2. Institution Hub (50+ pages)
- **Pattern:** `/blog/formasi/[institution]/`
- **Template:** Institution formation requirements, locations, positions
- **Keywords:** "formasi cpns [institution]", "cpns kemenkumham", "cpns kejaksaan"
- **Examples:** Kemenkumham, Kejaksaan, Kemenhub, Kemenkes, Mahkamah Agung

### 3. Education Hub (20+ pages)
- **Pattern:** `/blog/formasi/untuk-[level]/`
- **Template:** Formations by education requirement
- **Keywords:** "formasi cpns lulusan sma", "formasi cpns s1", "formasi cpns d3"
- **Examples:** SMA, SMK, D3, S1 (various majors)

### 4. Special Category Hub (30+ pages)
- **Pattern:** `/blog/formasi/[category]/`
- **Template:** Special formation categories
- **Keywords:** "formasi cpns disabilitas", "formasi cpns tanpa tinggi badan"
- **Examples:** Disabilitas, Tanpa Tinggi Badan, Sepi Peminat, Guru, Cumlaude

## Database Schema Extension

Current schema only supports 3 hubs (tiu, twk, tkp). Need new table:

```sql
-- New table for Formasi pages
CREATE TABLE formasi_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  
  -- Location hierarchy
  province TEXT,
  province_slug TEXT,
  city TEXT,
  city_slug TEXT,
  
  -- Institution (if applicable)
  institution TEXT,
  institution_slug TEXT,
  
  -- Education level (if applicable)
  education_level TEXT, -- 'sma', 'smk', 'd3', 's1', 's2'
  
  -- Special category (if applicable)
  special_category TEXT, -- 'disabilitas', 'tanpa-tinggi', 'guru', etc.
  
  -- Page metadata
  title TEXT NOT NULL,
  meta_description TEXT,
  
  -- Content
  introduction TEXT,
  content_blocks JSONB, -- array of ContentBlock
  
  -- Formation data (structured)
  formations_data JSONB, -- array of available positions
  -- [{ institution, position, requirements, quota, education_required }]
  
  -- SEO
  target_keywords TEXT[],
  canonical_url TEXT,
  
  -- Timestamps
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  year INTEGER DEFAULT 2024 -- CPNS year
);

-- Indexes for fast lookups
CREATE INDEX idx_formasi_province ON formasi_pages(province_slug);
CREATE INDEX idx_formasi_city ON formasi_pages(city_slug);
CREATE INDEX idx_formasi_institution ON formasi_pages(institution_slug);
CREATE INDEX idx_formasi_education ON formasi_pages(education_level);
CREATE INDEX idx_formasi_special ON formasi_pages(special_category);
CREATE INDEX idx_formasi_year ON formasi_pages(year);
```

## Content Block Structure for Formasi Pages

```typescript
type FormasiContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'formation_table'; data: Formation[] }  // NEW
  | { type: 'requirement_box'; requirements: string[] }  // NEW
  | { type: 'cta'; style: 'hard' | 'soft' }
  | { type: 'link_list'; links: { text: string; url: string }[] }  // NEW

type Formation = {
  institution: string;
  position: string;
  quota: number;
  education_required: string;
  major_required?: string;
  special_requirements?: string[];
  salary_range?: string;
  location: string;
};
```

## Page Templates by Type

### Template: City Formation Page
**URL:** `/blog/formasi/jawa-barat/bandung/`

**Structure:**
1. **H1:** Formasi CPNS Bandung 2024 — Instansi, Persyaratan & Cara Daftar
2. **Intro:** Overview of Bandung formations, total quota, deadlines
3. **Formation Table:** List of all available positions in Bandung
4. **Requirements Section:** Education, age, health requirements
5. **How to Apply:** Step-by-step application guide
6. **Important Dates:** Registration period, exam dates
7. **CTA:** "Latihan Soal SKD Sekarang" → links to app
8. **Related:** Links to other cities in Jawa Barat

**Target Keywords:**
- Primary: "formasi cpns bandung", "formasi cpns bandung 2024"
- Secondary: "cpns kota bandung", "formasi cpns jawa barat"
- Long-tail: "formasi cpns bandung untuk sma", "formasi cpns bandung lulusan s1"

### Template: Institution Formation Page
**URL:** `/blog/formasi/kemenkumham/`

**Structure:**
1. **H1:** Formasi CPNS Kemenkumham 2024 — Seluruh Indonesia
2. **Overview:** Total quota, position types (Sipir, Analis, etc.)
3. **By Province Table:** Breakdown by location
4. **Requirements:** Specific to Kemenkumham (Tinggi badan, etc.)
5. **SKD Requirements:** Passing grade info
6. **CTA:** "Simulasi CAT Kemenkumham" → app tryout

### Template: Education Level Page
**URL:** `/blog/formasi/untuk-lulusan-sma/`

**Structure:**
1. **H1:** Formasi CPNS untuk Lulusan SMA/SMK 2024
2. **Overview:** Which institutions accept SMA graduates
3. **Institution List:** Kemenkumham, Kemenhub, etc.
4. **Position Types:** What's available for SMA
5. **Competition:** How competitive (sepi peminat vs ramai)
6. **Tips:** How to prepare with SMA education level
7. **CTA:** "Latihan Soal SKD Level SMA" → app

## Data Sourcing Strategy

### Option 1: Manual Curation (High Quality, Slow)
- Source: BKN website, regional government announcements
- Pros: Accurate, authoritative
- Cons: Time-intensive, data gets stale
- Scale: 100-200 pages max

### Option 2: Semi-Automated Aggregation (Balanced)
- Scrape official sources annually during CPNS announcement season
- Store in database, update yearly
- Manual review for top 50 cities/institutions
- Scale: 500+ pages

### Option 3: Template-Based (Fast, Thin Content Warning)
- Generate pages from templates + location list
- Generic content: "Formasi CPNS [City] biasanya meliputi..."
- Risk: Thin content, Google may penalize
- Scale: Unlimited, but quality concerns

### **Recommended: Hybrid Approach**

**Phase 1 (Launch):** Top 50 Cities + All Institutions
- Manual curation for high-volume locations
- Jakarta, Surabaya, Bandung, etc.
- 10 major institutions (Kemenkumham, Kejaksaan, etc.)

**Phase 2 (Scale):** Template-based for long-tail
- Generate 400+ city pages with template content
- "Coming Soon" or "Based on previous year" data
- Monitor traffic, upgrade popular pages to full curation

**Phase 3 (Iterate):** Annual refresh
- Update during CPNS announcement season
- Add new cities/institutions based on search trends

## URL Structure & Routing

Need new dynamic route in Astro:

```astro
// src/pages/formasi/[...path].astro
// Handles:
// - /blog/formasi/jawa-barat/ (province)
// - /blog/formasi/jawa-barat/bandung/ (city)
// - /blog/formasi/kemenkumham/ (institution)
// - /blog/formasi/untuk-lulusan-sma/ (education)
// - /blog/formasi/disabilitas/ (special)

// Or separate routes for clarity:
// - /blog/formasi/provinsi/[province]/[city].astro
// - /blog/formasi/instansi/[institution].astro
// - /blog/formasi/pendidikan/[level].astro
// - /blog/formasi/kategori/[category].astro
```

## SEO Considerations

### 1. Duplicate Content Mitigation
- Each page must have unique formation data
- City-specific details (quota, local requirements)
- Dynamic content based on actual data

### 2. Thin Content Prevention
- Minimum 500 words per page
- Include formation tables (unique data)
- Add related questions FAQ section

### 3. Internal Linking
- Province → Cities
- Institution → Province breakdowns
- City → Related cities
- All → SKD preparation content (tiu/twk/tkp hubs)

### 4. Freshness
- Year in URL: `/blog/formasi/jawa-barat/bandung/2024/`
- Or update yearly and redirect
- Sitemap prioritization for current year

## 60-Day Launch Plan

### Month 1: Foundation
- **Week 1:** Database schema, new table, migration
- **Week 2:** Build 10 institution pages (manual, high quality)
- **Week 3:** Build 40 city pages (top 40 by population/search volume)
- **Week 4:** Build 20 education/special category pages

### Month 2: Scale
- **Week 5-6:** Generate 400+ long-tail city pages (template-based)
- **Week 7:** Internal linking, sitemap, navigation
- **Week 8:** QA, performance optimization, deployment

**Total Pages:** 470+ programmatic pages

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Data accuracy | High | Clear "last updated" dates, disclaimers |
| Thin content penalty | Medium | Minimum 500 words, unique tables |
| Maintenance burden | High | Automated refresh pipeline, user feedback |
| Competition catching up | Medium | First-mover advantage, focus on UX |

## Success Metrics

- **6 months:** 10,000 organic sessions/month
- **12 months:** 50,000 organic sessions/month
- **Conversion:** 5% of visitors try SKD practice in app
- **Backlinks:** Earn links from CPNS communities/forums

## Decision Points

1. **Which year?** 2024 (current), 2025 (upcoming), or evergreen?
2. **URL structure:** `/blog/formasi/[province]/[city]/` or include year?
3. **Data strategy:** Start with manual top 50, or go full template 500+?
4. **Scope:** Just locations, or include institutions + education + special?

Ready to build? Need decisions on above, then I'll create the technical spec + migration + page templates.

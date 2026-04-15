-- TEAM_030: Formasi CPNS Programmatic Pages Table
-- Date: 2026-04-13
-- Purpose: Store SEO pages for CPNS formation data (province, city, institution, education)
-- Pages: ~51 total (10 provinces + 25 cities + 10 institutions + 6 education levels)

CREATE TABLE formasi_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  
  -- Page type discriminator
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
  
  -- SEO metadata
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  target_keywords TEXT[],
  
  -- Content (ContentBlock array as JSONB)
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Formation data (simplified structure, placeholder-friendly)
  -- [{ institution, position, quota, education_required, major_required, location, additional_requirements }]
  formations_data JSONB DEFAULT '[]'::jsonb,
  
  -- Stats (placeholder-friendly, can be NULL or 0)
  total_quota INTEGER DEFAULT 0,
  total_institutions INTEGER DEFAULT 0,
  
  -- Placeholder tracking
  has_placeholder_data BOOLEAN DEFAULT true,
  data_source TEXT, -- e.g., "BKN 2024", "Template", "Manual Research"
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT unique_location UNIQUE NULLS NOT DISTINCT (province_slug, city_slug, institution_slug, education_level)
);

-- Indexes for fast lookups
CREATE INDEX idx_formasi_type ON formasi_pages(page_type);
CREATE INDEX idx_formasi_province ON formasi_pages(province_slug) WHERE province_slug IS NOT NULL;
CREATE INDEX idx_formasi_city ON formasi_pages(city_slug) WHERE city_slug IS NOT NULL;
CREATE INDEX idx_formasi_institution ON formasi_pages(institution_slug) WHERE institution_slug IS NOT NULL;
CREATE INDEX idx_formasi_education ON formasi_pages(education_level) WHERE education_level IS NOT NULL;
CREATE INDEX idx_formasi_placeholder ON formasi_pages(has_placeholder_data);

-- GIN index for JSONB content search
CREATE INDEX idx_formasi_content ON formasi_pages USING GIN(content_blocks jsonb_path_ops);
CREATE INDEX idx_formasi_formations ON formasi_pages USING GIN(formations_data jsonb_path_ops);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_formasi_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_formasi_pages_updated_at
  BEFORE UPDATE ON formasi_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_formasi_pages_updated_at();

-- Comment for documentation
COMMENT ON TABLE formasi_pages IS 'Programmatic SEO pages for CPNS formations - province, city, institution, and education level pages';
COMMENT ON COLUMN formasi_pages.has_placeholder_data IS 'True if page uses template/placeholder data (to be backfilled with real data later)';
COMMENT ON COLUMN formasi_pages.data_source IS 'Source of formation data: BKN 2024, Template, Manual Research, etc.';

-- TEAM_031: Migrate formasi pages to hub-based architecture
-- 1. Add formations_data to programmatic_pages
-- 2. Insert 4 new hubs
-- 3. Migrate data from formasi_pages (run after generating seed)

-- Step 1: Add formations_data column
ALTER TABLE programmatic_pages ADD COLUMN IF NOT EXISTS formations_data JSONB;

-- Step 2: Insert formasi hubs
INSERT INTO hubs (slug, title, meta_description, introduction) VALUES
('provinsi', 'Formasi CPNS per Provinsi', 'Cari formasi CPNS berdasarkan provinsi di seluruh Indonesia. Data lengkap kuota dan instansi.', 'Pilih provinsi untuk melihat formasi lengkap CPNS 2024.'),
('kota', 'Formasi CPNS per Kota', 'Cari formasi CPNS berdasarkan kota/kabupaten. Info detail kuota dan persyaratan.', 'Pilih kota untuk melihat formasi tersedia.'),
('institusi', 'Formasi CPNS per Instansi', 'Daftar formasi CPNS dari berbagai instansi pemerintah. Kuota dan jabatan lengkap.', 'Pilih instansi untuk melihat formasi.'),
('pendidikan', 'Formasi CPNS by Pendidikan', 'Formasi CPNS untuk lulusan SMA, D3, S1, S2. Cek kuota dan persyaratan.', 'Pilih jenjang pendidikan Anda.')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  introduction = EXCLUDED.introduction;

-- Step 3: Migration helper - copy data from formasi_pages to programmatic_pages
-- This will be done by running the generated seed script instead
-- to ensure proper content block formatting

-- Note: After migration, formasi_pages table can be dropped:
-- DROP TABLE formasi_pages;

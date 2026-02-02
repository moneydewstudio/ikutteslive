-- TEAM_010: create blog tables for Astro SSR programmatic SEO

CREATE TABLE IF NOT EXISTS hubs (
  slug varchar(10) PRIMARY KEY,
  title varchar(120) NOT NULL,
  meta_description varchar(160),
  introduction text
);

CREATE TABLE IF NOT EXISTS programmatic_pages (
  id text PRIMARY KEY,
  hub varchar(10) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  keyword varchar(255) NOT NULL,
  intent varchar(20) NOT NULL,
  title varchar(120) NOT NULL,
  meta_description varchar(160),
  h1 varchar(120) NOT NULL,
  content_blocks jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS programmatic_pages_hub_slug_idx ON programmatic_pages (hub, slug);
CREATE INDEX IF NOT EXISTS programmatic_pages_updated_at_idx ON programmatic_pages (updated_at DESC);

INSERT INTO hubs (slug, title, meta_description, introduction)
VALUES
  ('tiu', 'Panduan TIU CPNS', 'Materi TIU CPNS: verbal, numerik, logika, dan strategi cepat untuk latihan harian.', 'TIU menguji kemampuan verbal, numerik, dan logika. Gunakan hub ini untuk menemukan materi yang langsung bisa dipakai untuk latihan harian.'),
  ('twk', 'Panduan TWK CPNS', 'Materi TWK CPNS: Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika untuk latihan harian.', 'TWK menguji wawasan kebangsaan. Gunakan hub ini untuk belajar konsep inti lalu langsung latihan.'),
  ('tkp', 'Panduan TKP CPNS', 'Materi TKP CPNS: sikap kerja, pelayanan publik, dan penilaian berbobot untuk latihan harian.', 'TKP menilai respons situasional dengan bobot. Fokus pada pola penilaian dan latihan berulang.')
ON CONFLICT (slug) DO NOTHING;

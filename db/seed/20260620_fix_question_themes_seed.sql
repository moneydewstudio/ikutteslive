-- TEAM_002: Complete question_themes seed for ALL SKD categories (TWK + TIU + TKP)
-- Original seed only covered TIU (Verbal + Numerik). TWK and TKP were missing entirely.
-- This seed is idempotent (ON CONFLICT DO UPDATE) and auto-detects subtopic IDs from DB.
-- Also backfills questions.theme_id for spider chart readiness.
BEGIN;

-- ============================================================
-- Step 1: Populate question_themes for ALL subtopics
-- ============================================================

-- ────────────────────────────────────────────────
-- TWK: Tes Wawasan Kebangsaan
-- ────────────────────────────────────────────────

-- TWK subtopics typically: Nasionalisme, Integritas, Bela Negara, Pilar Negara, Bahasa Indonesia
-- We match by name pattern (case-insensitive)

-- Nasionalisme themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NASIONALISME_PANCASILA', 'Pancasila'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%NASIONALISME%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NASIONALISME_UUD1945', 'UUD 1945'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%NASIONALISME%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NASIONALISME_NKRI', 'NKRI'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%NASIONALISME%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NASIONALISME_BHINNEKA', 'Bhinneka Tunggal Ika'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%NASIONALISME%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Integritas themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'INTEGRITAS_KEJUJURAN', 'Kejujuran'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%INTEGRITAS%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'INTEGRITAS_ANTIKORUPSI', 'Anti Korupsi'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%INTEGRITAS%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Bela Negara themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'BELA_NEGARA_PERTAHANAN', 'Pertahanan & Keamanan'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%BELA%NEGARA%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Pilar Negara themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'PILAR_NEGARA_KONSTITUSI', 'Konstitusi & Hukum'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%PILAR%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Bahasa Indonesia themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'BAHASA_PEMAHAMAN_BACAAN', 'Pemahaman Bacaan'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%BAHASA%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'BAHASA_TATA_BAHASA', 'Tata Bahasa'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK' AND upper(qs.name) LIKE '%BAHASA%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- FALLBACK: If TWK subtopics don't match patterns above, create 1 theme per subtopic
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TWK_' || upper(replace(qs.name, ' ', '_')), qs.name
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TWK'
  AND NOT EXISTS (SELECT 1 FROM question_themes qt2 WHERE qt2.subtopic_id = qs.id)
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- ────────────────────────────────────────────────
-- TIU: Tes Intelegensia Umum (already had Verbal + Numerik)
-- ────────────────────────────────────────────────

-- Verbal themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'VERBAL_ANALOGI', 'Analogi'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%VERBAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'VERBAL_SINONIM', 'Sinonim'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%VERBAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'VERBAL_ANTONIM', 'Antonim'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%VERBAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'VERBAL_SILOGISME', 'Silogisme'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%VERBAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'VERBAL_LOGIKA_ANALITIS', 'Logika Analitis'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%VERBAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Numerik themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NUMERIK_ARITMATIKA', 'Aritmatika'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%NUMERIK%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NUMERIK_DERET', 'Deret Angka'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%NUMERIK%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NUMERIK_PERBANDINGAN', 'Perbandingan'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%NUMERIK%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NUMERIK_SOAL_CERITA', 'Soal Cerita'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%NUMERIK%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'NUMERIK_GEOMETRI', 'Geometri'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%NUMERIK%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Figural themes
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'FIGURAL_POLA', 'Pola Gambar'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%FIGURAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'FIGURAL_KERUANGAN', 'Keruangan'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU' AND upper(qs.name) LIKE '%FIGURAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- FALLBACK: any TIU subtopic without themes yet
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TIU_' || upper(replace(qs.name, ' ', '_')), qs.name
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TIU'
  AND NOT EXISTS (SELECT 1 FROM question_themes qt2 WHERE qt2.subtopic_id = qs.id)
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- ────────────────────────────────────────────────
-- TKP: Tes Karakteristik Pribadi
-- ────────────────────────────────────────────────

-- Pelayanan Publik
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_PELAYANAN_PUBLIK', 'Pelayanan Publik'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND upper(qs.name) LIKE '%PELAYANAN%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Jejaring Kerja
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_JEJARING_KERJA', 'Jejaring Kerja'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND upper(qs.name) LIKE '%JEJARING%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Sosial Budaya
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_SOSIAL_BUDAYA', 'Sosial Budaya'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND upper(qs.name) LIKE '%SOSIAL%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Profesionalisme
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_PROFESIONALISME', 'Profesionalisme'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND upper(qs.name) LIKE '%PROFESIONALISME%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Anti Radikalisme
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_ANTI_RADIKALISME', 'Anti Radikalisme'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND (upper(qs.name) LIKE '%RADIKALISME%' OR upper(qs.name) LIKE '%ANTI RADIK%')
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- TIK
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_TIK', 'Teknologi Informasi'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND (upper(qs.name) LIKE '%TIK%' OR upper(qs.name) LIKE '%TEKNOLOGI%')
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- Manajemen Perubahan
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_MANAJEMEN_PERUBAHAN', 'Manajemen Perubahan'
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP' AND upper(qs.name) LIKE '%MANAJEMEN%PERUBAHAN%'
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;

-- FALLBACK: any TKP subtopic without themes yet
INSERT INTO question_themes (subtopic_id, code, name)
SELECT qs.id, 'TKP_' || upper(replace(qs.name, ' ', '_')), qs.name
FROM question_subtopics qs
JOIN question_categories qc ON qs.category_id = qc.id
JOIN question_topics qt ON qc.topic_id = qt.id
WHERE upper(qt.code) = 'TKP'
  AND NOT EXISTS (SELECT 1 FROM question_themes qt2 WHERE qt2.subtopic_id = qs.id)
ON CONFLICT (subtopic_id, code) DO UPDATE SET name = EXCLUDED.name;


-- ============================================================
-- Step 2: Backfill questions.theme_id
-- Assigns first theme under matching subtopic for all untagged questions.
-- ============================================================

-- Via subtopic_id
UPDATE questions q
SET theme_id = sub.first_theme_id
FROM (
  SELECT DISTINCT ON (qs_id)
    qs_id,
    qt.id AS first_theme_id
  FROM (
    SELECT id AS q_id, subtopic_id AS qs_id
    FROM questions
    WHERE theme_id IS NULL
      AND subtopic_id IS NOT NULL
  ) unassigned
  CROSS JOIN LATERAL (
    SELECT id FROM question_themes WHERE subtopic_id = unassigned.qs_id ORDER BY id LIMIT 1
  ) qt
) sub
WHERE q.subtopic_id = sub.qs_id AND q.theme_id IS NULL;

-- Via legacy subcategory_id
UPDATE questions q
SET theme_id = sub.first_theme_id
FROM (
  SELECT DISTINCT ON (qs_id)
    qs_id,
    qt.id AS first_theme_id
  FROM (
    SELECT id AS q_id, subcategory_id AS qs_id
    FROM questions
    WHERE theme_id IS NULL AND subcategory_id IS NOT NULL AND subtopic_id IS NULL
  ) unassigned
  CROSS JOIN LATERAL (
    SELECT id FROM question_themes WHERE subtopic_id = unassigned.qs_id ORDER BY id LIMIT 1
  ) qt
) sub
WHERE q.subcategory_id = sub.qs_id AND q.theme_id IS NULL;

-- ============================================================
-- Step 3: Diagnostic output
-- ============================================================
DO $$
DECLARE
  theme_count integer;
  tagged_count integer;
  untagged_count integer;
BEGIN
  SELECT count(*) INTO theme_count FROM question_themes;
  SELECT count(*) INTO tagged_count FROM questions WHERE theme_id IS NOT NULL;
  SELECT count(*) INTO untagged_count FROM questions WHERE theme_id IS NULL;
  RAISE NOTICE 'question_themes: % rows', theme_count;
  RAISE NOTICE 'questions with theme_id: % tagged, % untagged', tagged_count, untagged_count;
END $$;

COMMIT;

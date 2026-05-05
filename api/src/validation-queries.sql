-- Validation queries for Tryout redesign
-- Run these to verify data prerequisites before deployment

-- 1. Check if topics table exists and has TWK/TIU/TKP
SELECT code, COUNT(*) as count FROM question_topics WHERE code IN ('TWK', 'TIU', 'TKP') GROUP BY code;

-- 2. Verify topic -> category -> subcategory relationships
SELECT 
  qt.code as topic_code,
  qc.code as category_code,
  qsc.code as subcategory_code,
  COUNT(q.id) as question_count
FROM question_topics qt
LEFT JOIN question_categories qc ON qc.topic_id = qt.id
LEFT JOIN question_subcategories qsc ON qsc.category_id = qc.id
LEFT JOIN questions q ON q.subcategory_id = qsc.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qc.code, qsc.code
ORDER BY qt.code, qc.code, qsc.code;

-- 3. Check minimum question pool sizes per topic
SELECT 
  qt.code as topic_code,
  COUNT(q.id) as active_questions,
  SUM(CASE WHEN q.subcategory_id IS NOT NULL THEN 1 ELSE 0 END) as has_subcategory
FROM question_topics qt
LEFT JOIN questions q ON q.topic_id = qt.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code;

-- 4. Verify subcategory coverage (minimum 5 questions per subcategory recommended)
SELECT 
  qt.code as topic_code,
  qsc.code as subcategory_code,
  COUNT(q.id) as question_count
FROM question_topics qt
JOIN question_categories qc ON qc.topic_id = qt.id
JOIN question_subcategories qsc ON qsc.category_id = qc.id
LEFT JOIN questions q ON q.subcategory_id = qsc.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qsc.code
HAVING COUNT(q.id) < 5
ORDER BY qt.code, qsc.code;

-- 5. Verify theme counts per subcategory (sanity)
SELECT
  qt.code as topic_code,
  qsc.code as subcategory_code,
  count(distinct qth.id) as theme_count,
  count(q.id) filter (where q.theme_id is not null) as questions_with_theme
FROM question_topics qt
LEFT JOIN question_categories qc ON qc.topic_id = qt.id
LEFT JOIN question_subcategories qsc ON qsc.category_id = qc.id
LEFT JOIN question_themes qth ON qth.subcategory_id = qsc.id
LEFT JOIN questions q ON q.subcategory_id = qsc.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qsc.code
ORDER BY qt.code, qsc.code;

-- 6. Find questions missing theme_id (optional coverage allowed; this is for monitoring)
SELECT
  qt.code as topic_code,
  count(*) as active_questions,
  sum(case when q.theme_id is null then 1 else 0 end) as missing_theme
FROM questions q
LEFT JOIN question_topics qt ON q.topic_id = qt.id
WHERE q.is_active = true
GROUP BY qt.code
ORDER BY qt.code;

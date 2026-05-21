-- Validation queries for Tryout redesign
-- Run these to verify data prerequisites before deployment

-- 1. Check if topics table exists and has TWK/TIU/TKP
SELECT code, COUNT(*) as count FROM question_topics WHERE code IN ('TWK', 'TIU', 'TKP') GROUP BY code;

-- 2. Verify topic -> subtopic relationships
SELECT 
  qt.code as topic_code,
  qst.code as subtopic_code,
  COUNT(q.id) as question_count
FROM question_topics qt
LEFT JOIN question_subtopics qst ON qst.category_id = qt.id
LEFT JOIN questions q ON q.subtopic_id = qst.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qst.code
ORDER BY qt.code, qst.code;

-- 3. Check minimum question pool sizes per topic
SELECT 
  qt.code as topic_code,
  COUNT(q.id) as active_questions,
  SUM(CASE WHEN q.subtopic_id IS NOT NULL THEN 1 ELSE 0 END) as has_subtopic
FROM question_topics qt
LEFT JOIN questions q ON q.topic_id = qt.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code;

-- 4. Verify subtopic coverage (minimum 5 questions per subtopic recommended)
SELECT 
  qt.code as topic_code,
  qst.code as subtopic_code,
  COUNT(q.id) as question_count
FROM question_topics qt
LEFT JOIN question_subtopics qst ON qst.category_id = qt.id
LEFT JOIN questions q ON q.subtopic_id = qst.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qst.code
HAVING COUNT(q.id) < 5
ORDER BY qt.code, qst.code;

-- 5. Verify theme counts per subtopic (sanity)
SELECT
  qt.code as topic_code,
  qst.code as subtopic_code,
  count(distinct qth.id) as theme_count,
  count(q.id) filter (where q.theme_id is not null) as questions_with_theme
FROM question_topics qt
LEFT JOIN question_subtopics qst ON qst.category_id = qt.id
LEFT JOIN question_themes qth ON qth.subtopic_id = qst.id
LEFT JOIN questions q ON q.subtopic_id = qst.id AND q.is_active = true
WHERE qt.code IN ('TWK', 'TIU', 'TKP')
GROUP BY qt.code, qst.code
ORDER BY qt.code, qst.code;

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

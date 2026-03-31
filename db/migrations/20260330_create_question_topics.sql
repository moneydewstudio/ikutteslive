-- TEAM_019: Create question_topics table and seed categories
-- Mapping: 1=TWK, 2=TIU, 3=TKP

CREATE TABLE IF NOT EXISTS question_topics (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL
);

-- Seed the topics
INSERT INTO question_topics (id, code, name) VALUES
(1, 'TWK', 'Tes Wawasan Kebangsaan'),
(2, 'TIU', 'Tes Intelegensia Umum'),
(3, 'TKP', 'Tes Karakteristik Pribadi')
ON CONFLICT (id) DO NOTHING;

-- TODO: After this migration, run a data migration script to populate questions.topic_id
-- based on existing categorization logic (e.g., from question_subcategories or other mapping)

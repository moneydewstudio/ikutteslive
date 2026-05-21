-- TEAM_035: Rename question_subcategories to question_subtopics for clarity
-- This aligns table names with actual hierarchy: topics > subtopics > themes

-- Rename the main table
ALTER TABLE question_subcategories RENAME TO question_subtopics;

-- Update foreign key references in question_themes
ALTER TABLE question_themes RENAME COLUMN subcategory_id TO subtopic_id;

-- Update foreign key references in questions
ALTER TABLE questions RENAME COLUMN subcategory_id TO subtopic_id;

-- Update foreign key references in tryout_attempt_items
ALTER TABLE tryout_attempt_items RENAME COLUMN subcategory_id TO subtopic_id;

-- Update foreign key references in daily_quiz_attempt_items
ALTER TABLE daily_quiz_attempt_items RENAME COLUMN subcategory_id TO subtopic_id;

-- Update index names for consistency
DROP INDEX IF EXISTS question_themes_subcategory_code_uniq;
DROP INDEX IF EXISTS question_themes_subcategory_id_idx;

CREATE UNIQUE INDEX question_themes_subtopic_code_uniq
  ON question_themes (subtopic_id, code);

CREATE INDEX question_themes_subtopic_id_idx
  ON question_themes (subtopic_id);

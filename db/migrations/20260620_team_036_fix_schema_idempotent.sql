BEGIN;

-- We already renamed theme_id to legacy_theme_id_uuid (or it failed if already done)
ALTER TABLE questions RENAME COLUMN theme_id TO legacy_theme_id_uuid;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS theme_id integer REFERENCES question_themes(id);

-- We already updated question_themes
-- Now safely drop and recreate FK
ALTER TABLE question_themes DROP CONSTRAINT IF EXISTS question_themes_subtopic_id_fkey;
ALTER TABLE question_themes ADD CONSTRAINT question_themes_subtopic_id_fkey FOREIGN KEY (subtopic_id) REFERENCES question_subcategories(id);

-- Safely rename table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'question_subcategories') THEN
    ALTER TABLE question_subcategories RENAME TO question_subtopics;
  END IF;
END $$;

-- Safely rename column if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tryout_attempt_items' AND column_name = 'subcategory_id') THEN
    ALTER TABLE tryout_attempt_items RENAME COLUMN subcategory_id TO subtopic_id;
  END IF;
END $$;

-- Create missing daily_quiz_attempt_items table
CREATE TABLE IF NOT EXISTS daily_quiz_attempt_items (
    id SERIAL PRIMARY KEY,
    attempt_id TEXT NOT NULL REFERENCES daily_quiz_attempts(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    subtopic_id INTEGER REFERENCES question_subtopics(id),
    is_correct BOOLEAN,
    selected_weight INTEGER,
    max_weight INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMIT;

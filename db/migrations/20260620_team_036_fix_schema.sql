BEGIN;

-- 1. Handle UUID vs Integer for theme_id
ALTER TABLE questions RENAME COLUMN theme_id TO legacy_theme_id_uuid;
ALTER TABLE questions ADD COLUMN theme_id integer REFERENCES question_themes(id);

-- 2. Update existing question_themes data to use new subcategory IDs
UPDATE question_themes SET subtopic_id = 1 WHERE subtopic_id = 9;
UPDATE question_themes SET subtopic_id = 2 WHERE subtopic_id = 10;

-- 3. Fix foreign key on question_themes
ALTER TABLE question_themes DROP CONSTRAINT question_themes_subtopic_id_fkey;
ALTER TABLE question_themes ADD CONSTRAINT question_themes_subtopic_id_fkey FOREIGN KEY (subtopic_id) REFERENCES question_subcategories(id);

-- 4. Rename question_subcategories to question_subtopics
ALTER TABLE question_subcategories RENAME TO question_subtopics;

-- 5. Rename subcategory_id to subtopic_id in tryout_attempt_items
ALTER TABLE tryout_attempt_items RENAME COLUMN subcategory_id TO subtopic_id;

-- 6. Create missing daily_quiz_attempt_items table
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

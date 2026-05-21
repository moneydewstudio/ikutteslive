-- TEAM_035: Add optional question themes under existing subtopics

create table if not exists question_themes (
  id integer primary key generated always as identity,
  subtopic_id integer not null references subtopics(id),
  code text not null,
  name text not null
);

create unique index if not exists question_themes_subtopic_code_uniq
  on question_themes (subtopic_id, code);

create index if not exists question_themes_subtopic_id_idx
  on question_themes (subtopic_id);

alter table questions
  add column if not exists theme_id integer references question_themes(id);

create index if not exists questions_theme_id_idx
  on questions (theme_id);

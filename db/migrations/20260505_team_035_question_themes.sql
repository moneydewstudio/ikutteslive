-- TEAM_035: Add optional question themes under existing question_subcategories

create table if not exists question_themes (
  id integer primary key,
  subcategory_id integer not null references question_subcategories(id),
  code text not null,
  name text not null
);

create unique index if not exists question_themes_subcategory_code_uniq
  on question_themes (subcategory_id, code);

create index if not exists question_themes_subcategory_id_idx
  on question_themes (subcategory_id);

alter table questions
  add column if not exists theme_id integer references question_themes(id);

create index if not exists questions_theme_id_idx
  on questions (theme_id);

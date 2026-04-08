-- TEAM_029: Persist daily quiz submissions for profile spider chart readiness analytics (Tryout + Daily Quiz; exclude drills)

create table if not exists daily_quiz_attempts (
  id text primary key,
  user_id text not null,
  day_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, day_key)
);

create index if not exists daily_quiz_attempts_user_id_created_at_idx
  on daily_quiz_attempts (user_id, created_at desc);

create table if not exists daily_quiz_attempt_items (
  id serial primary key,
  attempt_id text not null references daily_quiz_attempts(id) on delete cascade,
  question_id integer not null references questions(id),
  subcategory_id integer references question_subcategories(id),
  is_correct boolean,
  selected_weight integer,
  max_weight integer,
  created_at timestamptz not null default now()
);

create index if not exists daily_quiz_attempt_items_attempt_id_idx
  on daily_quiz_attempt_items (attempt_id);

create index if not exists daily_quiz_attempt_items_subcategory_id_idx
  on daily_quiz_attempt_items (subcategory_id);

-- TEAM_009: Add tryout attempt persistence tables for premium-gated Riwayat Tryout and radar analytics

create table if not exists tryout_attempts (
  id text primary key,
  user_id text not null,
  total integer not null,
  twk integer not null,
  tiu integer not null,
  tkp integer not null,
  passed boolean,
  created_at timestamptz not null default now()
);

create index if not exists tryout_attempts_user_id_created_at_idx
  on tryout_attempts (user_id, created_at desc);

create table if not exists tryout_attempt_items (
  id serial primary key,
  attempt_id text not null references tryout_attempts(id) on delete cascade,
  question_id integer not null references questions(id),
  category_code text,
  subcategory_id integer references question_subcategories(id),
  is_correct boolean,
  selected_weight integer,
  max_weight integer,
  created_at timestamptz not null default now()
);

create index if not exists tryout_attempt_items_attempt_id_idx
  on tryout_attempt_items (attempt_id);

create index if not exists tryout_attempt_items_subcategory_id_idx
  on tryout_attempt_items (subcategory_id);

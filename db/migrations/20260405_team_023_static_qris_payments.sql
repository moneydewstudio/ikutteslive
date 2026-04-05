-- TEAM_023: Static QRIS payments + minimal admin audit trail + user monetization fields

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS purchase_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_purchase_type text,
  ADD COLUMN IF NOT EXISTS first_paywall_seen_at timestamptz,
  ADD COLUMN IF NOT EXISTS sessions_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS questions_answered_total integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wrong_streak integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS payments (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  plan_type text NOT NULL,
  base_amount integer NOT NULL,
  unique_suffix integer NOT NULL,
  amount_expected integer NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  confirmed_at timestamptz,
  confirmed_by text,
  user_claimed_at timestamptz,
  admin_note text,
  transaction_ref text
);

CREATE INDEX IF NOT EXISTS payments_user_created_idx ON payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_status_expires_idx ON payments (status, expires_at);
CREATE INDEX IF NOT EXISTS payments_amount_status_idx ON payments (amount_expected, status);

CREATE TABLE IF NOT EXISTS payment_admin_actions (
  id text PRIMARY KEY,
  payment_id text NOT NULL REFERENCES payments(id),
  admin_id text NOT NULL,
  action text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_admin_actions_payment_idx ON payment_admin_actions (payment_id, created_at DESC);

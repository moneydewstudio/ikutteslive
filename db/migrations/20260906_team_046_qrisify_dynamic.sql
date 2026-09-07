-- TEAM_046: migrate static QRIS to dynamic QRIS via QRIS-ify middleware
-- Add columns for dynamic QRIS transaction tracking and webhook auto-grant.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS qrisify_transaction_id text,
  ADD COLUMN IF NOT EXISTS qrisify_qr_image_url text,
  ADD COLUMN IF NOT EXISTS qrisify_amount_total integer,
  ADD COLUMN IF NOT EXISTS qrisify_unique_code integer;

-- Idempotency: webhook uses (qrisify_transaction_id) as the dedupe key for SUCCESS.
-- Uniqueness on transaction_id (nullable, partial) prevents double-grants.
CREATE UNIQUE INDEX IF NOT EXISTS payments_qrisify_txn_uniq
  ON payments (qrisify_transaction_id)
  WHERE qrisify_transaction_id IS NOT NULL;

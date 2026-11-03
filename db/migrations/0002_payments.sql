-- Zero-cost payments (Premium). ADDITIVE ONLY: new nullable / defaulted columns
-- on appointments, nothing renamed or dropped. Older app versions keep working
-- (they never read these columns). Safe to run more than once.

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';
-- Service fee at booking time (INR). NULL = no fee configured.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_total_inr integer;
-- Amount asked for online (full fee or deposit). NULL = pay at the clinic only.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_due_inr integer;
-- Amount the clinic recorded as received.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_paid_inr integer;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_method text;
-- UPI transaction ID (UTR) / bank reference, from the patient or the clinic.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_ref text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_updated_at timestamptz;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS paid_at timestamptz;

DO $$
BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_payment_status_check
    CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'refunded', 'waived'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_payment_method_check
    CHECK (payment_method IS NULL OR payment_method IN ('cash', 'card', 'upi', 'bank', 'other'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS appointments_payment_status_idx ON appointments (payment_status);

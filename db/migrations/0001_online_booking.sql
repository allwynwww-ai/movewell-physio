-- Online appointment booking (Pro). Safe to run more than once.

CREATE TABLE IF NOT EXISTS appointments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref           text NOT NULL UNIQUE,
  service_id    text NOT NULL,
  service_name  text NOT NULL,
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  status        text NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  name          text NOT NULL,
  phone         text NOT NULL,
  email         text NOT NULL,
  note          text NOT NULL DEFAULT '',
  consent_at    timestamptz NOT NULL,
  source        text NOT NULL DEFAULT 'online',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  cancelled_at  timestamptz,
  cancelled_by  text CHECK (cancelled_by IN ('patient', 'clinic')),
  CHECK (ends_at > starts_at)
);

-- Double-booking guard: only ONE non-cancelled appointment may hold a slot.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_unique
  ON appointments (starts_at)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS appointments_starts_at_idx ON appointments (starts_at);
CREATE INDEX IF NOT EXISTS appointments_phone_idx ON appointments (phone);

-- Days the clinic blocks from /admin (leave, training, etc.).
CREATE TABLE IF NOT EXISTS blocked_dates (
  day         date PRIMARY KEY,
  reason      text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

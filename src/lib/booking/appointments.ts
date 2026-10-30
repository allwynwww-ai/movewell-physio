/**
 * Server-side booking logic: free-slot calculation, creating, cancelling and
 * rescheduling appointments, and the admin queries. Never import this from a
 * client component.
 */
import { randomInt } from "node:crypto";
import { db, isUniqueViolation } from "./db";
import {
  addDays,
  booking,
  configSlotsFor,
  dateKeyOf,
  holidayOn,
  isValidDateKey,
  isValidTime,
  startOfWeek,
  todayKey,
  zonedToUtc,
} from "./time";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export type Appointment = {
  id: string;
  ref: string;
  serviceId: string;
  serviceName: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  name: string;
  phone: string;
  email: string;
  note: string;
  createdAt: Date;
  cancelledAt: Date | null;
  cancelledBy: "patient" | "clinic" | null;
};

type Row = {
  id: string;
  ref: string;
  service_id: string;
  service_name: string;
  starts_at: Date;
  ends_at: Date;
  status: AppointmentStatus;
  name: string;
  phone: string;
  email: string;
  note: string;
  created_at: Date;
  cancelled_at: Date | null;
  cancelled_by: "patient" | "clinic" | null;
};

function toAppointment(r: Row): Appointment {
  return {
    id: r.id,
    ref: r.ref,
    serviceId: r.service_id,
    serviceName: r.service_name,
    startsAt: new Date(r.starts_at),
    endsAt: new Date(r.ends_at),
    status: r.status,
    name: r.name,
    phone: r.phone,
    email: r.email,
    note: r.note,
    createdAt: new Date(r.created_at),
    cancelledAt: r.cancelled_at ? new Date(r.cancelled_at) : null,
    cancelledBy: r.cancelled_by,
  };
}

export class BookingError extends Error {
  constructor(
    public code: "slot-taken" | "invalid-slot" | "blocked" | "limit" | "not-found" | "cutoff" | "not-active" | "not-started",
    message: string,
  ) {
    super(message);
  }
}

export const ACTIVE: AppointmentStatus[] = ["pending", "confirmed"];

/* ── Availability ─────────────────────────────────────────────────────── */

export async function getBlockedDays(fromKey: string, toKey: string): Promise<Map<string, string>> {
  const sql = await db();
  const rows = await sql<{ day: string; reason: string }[]>`
    SELECT to_char(day, 'YYYY-MM-DD') AS day, reason FROM blocked_dates
    WHERE day BETWEEN ${fromKey}::date AND ${toKey}::date ORDER BY day`;
  return new Map(rows.map((r) => [r.day, r.reason]));
}

export type DayAvailability = { date: string; slots: string[]; closed?: string };

/**
 * Free slots for every day from today to maxDaysAhead: opening hours minus
 * breaks, holidays, admin-blocked days, existing bookings and past slots.
 * `forAdmin` skips the minimum-notice rule (but never offers past times).
 */
export async function getAvailability(opts: { forAdmin?: boolean } = {}): Promise<DayAvailability[]> {
  const sql = await db();
  const now = new Date();
  const from = todayKey(now);
  const to = addDays(from, booking.maxDaysAhead);
  const earliest = now.getTime() + (opts.forAdmin ? 0 : booking.minNoticeMinutes * 60000);

  const [blocked, taken] = await Promise.all([
    getBlockedDays(from, to),
    sql<{ starts_at: Date }[]>`
      SELECT starts_at FROM appointments
      WHERE status <> 'cancelled'
        AND starts_at >= ${zonedToUtc(from, "00:00")}
        AND starts_at < ${zonedToUtc(addDays(to, 1), "00:00")}`,
  ]);
  const takenSet = new Set(taken.map((r) => new Date(r.starts_at).getTime()));

  const days: DayAvailability[] = [];
  for (let key = from; key <= to; key = addDays(key, 1)) {
    const holiday = holidayOn(key);
    if (holiday) {
      days.push({ date: key, slots: [], closed: holiday.label });
      continue;
    }
    if (blocked.has(key)) {
      days.push({ date: key, slots: [], closed: blocked.get(key) || "Clinic closed" });
      continue;
    }
    const slots = configSlotsFor(key).filter((t) => {
      const ts = zonedToUtc(key, t).getTime();
      return ts > earliest && !takenSet.has(ts);
    });
    days.push({ date: key, slots });
  }
  return days;
}

/** Checks a requested date/time against config + blocked days. Returns the slot instants. */
async function resolveSlot(dateKey: string, time: string, forAdmin = false) {
  if (!isValidDateKey(dateKey) || !isValidTime(time)) {
    throw new BookingError("invalid-slot", "That date or time is not valid.");
  }
  const now = new Date();
  const today = todayKey(now);
  if (dateKey < today || dateKey > addDays(today, booking.maxDaysAhead)) {
    throw new BookingError("invalid-slot", "That date is outside the booking window.");
  }
  if (!configSlotsFor(dateKey).includes(time)) {
    throw new BookingError("invalid-slot", "That time is not an available slot.");
  }
  const startsAt = zonedToUtc(dateKey, time);
  const earliest = now.getTime() + (forAdmin ? 0 : booking.minNoticeMinutes * 60000);
  if (startsAt.getTime() <= earliest) {
    throw new BookingError("invalid-slot", "That time has already passed or is too soon to book online.");
  }
  const endsAt = new Date(startsAt.getTime() + booking.slotMinutes * 60000);
  return { startsAt, endsAt };
}

/* ── Patient actions ──────────────────────────────────────────────────── */

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newRef() {
  let s = "";
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `BK-${s}`;
}

export type NewBooking = {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  note: string;
};

export async function createAppointment(input: NewBooking): Promise<Appointment> {
  const sql = await db();
  const { startsAt, endsAt } = await resolveSlot(input.date, input.time);
  const status: AppointmentStatus = booking.autoConfirm ? "confirmed" : "pending";

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const row = await sql.begin(async (tx) => {
        const blocked = await tx`SELECT 1 FROM blocked_dates WHERE day = ${input.date}::date`;
        if (blocked.length) throw new BookingError("blocked", "The clinic is closed on that day.");

        const [{ n }] = await tx<{ n: number }[]>`
          SELECT count(*)::int AS n FROM appointments
          WHERE phone = ${input.phone} AND status IN ('pending', 'confirmed') AND starts_at > now()`;
        if (n >= booking.maxUpcomingPerPhone) {
          throw new BookingError(
            "limit",
            `You already have ${n} upcoming appointments. Please manage those or call the clinic.`,
          );
        }

        // The partial unique index on starts_at rejects a second active booking for the slot.
        const [r] = await tx<Row[]>`
          INSERT INTO appointments
            (ref, service_id, service_name, starts_at, ends_at, status, name, phone, email, note, consent_at)
          VALUES
            (${newRef()}, ${input.serviceId}, ${input.serviceName}, ${startsAt}, ${endsAt}, ${status},
             ${input.name}, ${input.phone}, ${input.email}, ${input.note}, now())
          RETURNING *`;
        return r;
      });
      return toAppointment(row);
    } catch (err) {
      if (isUniqueViolation(err)) {
        const constraint = (err as { constraint_name?: string }).constraint_name ?? "";
        if (constraint.includes("ref")) continue; // reference collision – try a new one
        throw new BookingError("slot-taken", "Sorry, that slot was just booked by someone else. Please pick another time.");
      }
      throw err;
    }
  }
  throw new Error("Could not generate a booking reference");
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const sql = await db();
  const [r] = await sql<Row[]>`SELECT * FROM appointments WHERE id = ${id}`;
  return r ? toAppointment(r) : null;
}

/** Can the patient still change this appointment online? */
export function withinCutoff(a: Appointment, now = new Date()): boolean {
  return a.startsAt.getTime() - now.getTime() > booking.cancellationCutoffHours * 3600000;
}

export async function cancelAppointment(id: string, by: "patient" | "clinic"): Promise<Appointment> {
  const sql = await db();
  const current = await getAppointment(id);
  if (!current) throw new BookingError("not-found", "Appointment not found.");
  if (!ACTIVE.includes(current.status)) throw new BookingError("not-active", "This appointment is no longer active.");
  if (by === "patient" && !withinCutoff(current)) {
    throw new BookingError(
      "cutoff",
      `Online changes close ${booking.cancellationCutoffHours} hours before the appointment. Please call the clinic.`,
    );
  }
  const [r] = await sql<Row[]>`
    UPDATE appointments
    SET status = 'cancelled', cancelled_at = now(), cancelled_by = ${by}, updated_at = now()
    WHERE id = ${id} AND status IN ('pending', 'confirmed')
    RETURNING *`;
  if (!r) throw new BookingError("not-active", "This appointment is no longer active.");
  return toAppointment(r);
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string,
  by: "patient" | "clinic",
): Promise<{ before: Appointment; after: Appointment }> {
  const sql = await db();
  const before = await getAppointment(id);
  if (!before) throw new BookingError("not-found", "Appointment not found.");
  if (!ACTIVE.includes(before.status)) throw new BookingError("not-active", "This appointment is no longer active.");
  if (by === "patient" && !withinCutoff(before)) {
    throw new BookingError(
      "cutoff",
      `Online changes close ${booking.cancellationCutoffHours} hours before the appointment. Please call the clinic.`,
    );
  }
  const { startsAt, endsAt } = await resolveSlot(date, time, by === "clinic");
  try {
    const row = await sql.begin(async (tx) => {
      const blocked = await tx`SELECT 1 FROM blocked_dates WHERE day = ${date}::date`;
      if (blocked.length) throw new BookingError("blocked", "The clinic is closed on that day.");
      const [r] = await tx<Row[]>`
        UPDATE appointments
        SET starts_at = ${startsAt}, ends_at = ${endsAt}, updated_at = now()
        WHERE id = ${id} AND status IN ('pending', 'confirmed')
        RETURNING *`;
      if (!r) throw new BookingError("not-active", "This appointment is no longer active.");
      return r;
    });
    return { before, after: toAppointment(row) };
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BookingError("slot-taken", "Sorry, that slot was just booked by someone else. Please pick another time.");
    }
    throw err;
  }
}

/* ── Admin ────────────────────────────────────────────────────────────── */

export async function setStatus(id: string, status: Exclude<AppointmentStatus, "cancelled">): Promise<Appointment> {
  const sql = await db();
  const current = await getAppointment(id);
  if (!current) throw new BookingError("not-found", "Appointment not found.");
  // Cancelled bookings are final here (re-book instead) – stops a stale or forged form from reviving them.
  if (current.status === "cancelled") throw new BookingError("not-active", "This appointment was cancelled and can't be changed.");
  if ((status === "completed" || status === "no_show") && !hasStarted(current)) {
    throw new BookingError("not-started", "You can only mark an appointment done or no-show once it has started.");
  }
  try {
    const [r] = await sql<Row[]>`
      UPDATE appointments SET status = ${status}, updated_at = now()
      WHERE id = ${id} AND status <> 'cancelled' RETURNING *`;
    if (!r) throw new BookingError("not-active", "This appointment was cancelled and can't be changed.");
    return toAppointment(r);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new BookingError("slot-taken", "That slot has been booked by someone else since this was cancelled.");
    }
    throw err;
  }
}

/**
 * today    – every booking on today's date (IST), any status
 * upcoming – bookings that haven't started yet (soonest first)
 * week     – today + next 6 days (IST), not cancelled – matches the Week calendar
 * past     – bookings that have already started, newest first (incl. earlier today)
 * all      – everything, newest first
 */
export type ListScope = "today" | "upcoming" | "week" | "past" | "all";

export async function listAppointments(scope: ListScope, q = ""): Promise<Appointment[]> {
  const sql = await db();
  const today = todayKey();
  const dayStart = zonedToUtc(today, "00:00");
  const dayEnd = zonedToUtc(addDays(today, 1), "00:00");
  const weekEnd = zonedToUtc(addDays(today, 7), "00:00");
  const now = new Date();
  const term = q.trim().slice(0, 80);
  const like = "%" + term.replace(/[%_\\]/g, "\\$&") + "%";
  const digits = term.replace(/\D/g, "");
  const search = term
    ? sql`AND (name ILIKE ${like} OR ref ILIKE ${like} OR email ILIKE ${like}
          ${digits.length >= 3 ? sql`OR regexp_replace(phone, '\\D', '', 'g') LIKE ${"%" + digits + "%"}` : sql``})`
    : sql``;

  let rows: Row[];
  if (scope === "today") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${dayStart} AND starts_at < ${dayEnd} ${search} ORDER BY starts_at, (status = 'cancelled'), ref`;
  } else if (scope === "upcoming") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${now} ${search} ORDER BY starts_at, (status = 'cancelled'), ref LIMIT 500`;
  } else if (scope === "week") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${dayStart} AND starts_at < ${weekEnd} AND status <> 'cancelled' ${search} ORDER BY starts_at, (status = 'cancelled'), ref LIMIT 500`;
  } else if (scope === "past") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at < ${now} ${search} ORDER BY starts_at DESC, (status = 'cancelled'), ref LIMIT 500`;
  } else {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE true ${search} ORDER BY starts_at DESC, (status = 'cancelled'), ref LIMIT 2000`;
  }
  return rows.map(toAppointment);
}

export type AdminStats = {
  today: number;
  thisWeek: number;
  upcoming: number;
  pending: number;
  noShowRate: number | null;
  noShows: number;
  attended: number;
  week: { date: string; count: number }[];
};

export async function getStats(): Promise<AdminStats> {
  const sql = await db();
  const today = todayKey();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 7);
  const [row] = await sql<
    { today: number; this_week: number; upcoming: number; pending: number; no_shows: number; attended: number }[]
  >`
    SELECT
      count(*) FILTER (WHERE status <> 'cancelled' AND starts_at >= ${zonedToUtc(today, "00:00")} AND starts_at < ${zonedToUtc(addDays(today, 1), "00:00")})::int AS today,
      count(*) FILTER (WHERE status <> 'cancelled' AND starts_at >= ${zonedToUtc(weekStart, "00:00")} AND starts_at < ${zonedToUtc(weekEnd, "00:00")})::int AS this_week,
      count(*) FILTER (WHERE status IN ('pending', 'confirmed') AND starts_at >= now())::int AS upcoming,
      count(*) FILTER (WHERE status = 'pending' AND starts_at >= now())::int AS pending,
      count(*) FILTER (WHERE status = 'no_show' AND starts_at >= now() - interval '90 days')::int AS no_shows,
      count(*) FILTER (WHERE status = 'completed' AND starts_at >= now() - interval '90 days')::int AS attended
    FROM appointments`;

  // Next 7 days, for the week-at-a-glance strip.
  const end = addDays(today, 7);
  const perDay = await sql<{ starts_at: Date }[]>`
    SELECT starts_at FROM appointments
    WHERE status <> 'cancelled' AND starts_at >= ${zonedToUtc(today, "00:00")} AND starts_at < ${zonedToUtc(end, "00:00")}`;
  const counts = new Map<string, number>();
  for (const r of perDay) {
    const k = dateKeyOf(new Date(r.starts_at));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return { date, count: counts.get(date) ?? 0 };
  });

  const finished = row.no_shows + row.attended;
  return {
    today: row.today,
    thisWeek: row.this_week,
    upcoming: row.upcoming,
    pending: row.pending,
    noShows: row.no_shows,
    attended: row.attended,
    noShowRate: finished ? row.no_shows / finished : null,
    week,
  };
}

export async function listBlockedDays(): Promise<{ day: string; reason: string; bookings: number }[]> {
  const sql = await db();
  const rows = await sql<{ day: string; reason: string }[]>`
    SELECT to_char(day, 'YYYY-MM-DD') AS day, reason FROM blocked_dates
    WHERE day >= ${todayKey()}::date ORDER BY day`;
  const out = [];
  for (const r of rows) {
    const [{ n }] = await sql<{ n: number }[]>`
      SELECT count(*)::int AS n FROM appointments
      WHERE status IN ('pending', 'confirmed')
        AND starts_at >= ${zonedToUtc(r.day, "00:00")} AND starts_at < ${zonedToUtc(addDays(r.day, 1), "00:00")}`;
    out.push({ ...r, bookings: n });
  }
  return out;
}

export async function blockDay(day: string, reason: string) {
  if (!isValidDateKey(day)) throw new BookingError("invalid-slot", "Invalid date.");
  if (day < todayKey()) throw new BookingError("invalid-slot", "That date is in the past.");
  const sql = await db();
  await sql`
    INSERT INTO blocked_dates (day, reason) VALUES (${day}::date, ${reason})
    ON CONFLICT (day) DO UPDATE SET reason = EXCLUDED.reason`;
}

export async function unblockDay(day: string) {
  if (!isValidDateKey(day)) return;
  const sql = await db();
  await sql`DELETE FROM blocked_dates WHERE day = ${day}::date`;
}

/** Has the appointment's start time passed? */
export function hasStarted(a: Appointment, now = new Date()): boolean {
  return a.startsAt.getTime() <= now.getTime();
}

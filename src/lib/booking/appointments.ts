/**
 * Server-side booking logic: free-slot calculation, creating, cancelling and
 * rescheduling appointments, and the admin queries. Never import this from a
 * client component.
 */
import { randomInt } from "node:crypto";
import type { PaymentMethod, PaymentStatus } from "@/lib/payments";
import { db, isUniqueViolation } from "./db";
import {
  addDays,
  booking,
  configSlotsFor,
  dateKeyOf,
  holidayOn,
  isValidDateKey,
  isValidTime,
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
  /** Premium payments (columns from migration 0002). */
  paymentStatus: PaymentStatus;
  paymentTotalINR: number | null;
  paymentDueINR: number | null;
  paymentPaidINR: number | null;
  paymentMethod: PaymentMethod | null;
  paymentRef: string | null;
  paidAt: Date | null;
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
  payment_status?: PaymentStatus;
  payment_total_inr?: number | null;
  payment_due_inr?: number | null;
  payment_paid_inr?: number | null;
  payment_method?: PaymentMethod | null;
  payment_ref?: string | null;
  paid_at?: Date | null;
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
    paymentStatus: r.payment_status ?? "unpaid",
    paymentTotalINR: r.payment_total_inr ?? null,
    paymentDueINR: r.payment_due_inr ?? null,
    paymentPaidINR: r.payment_paid_inr ?? null,
    paymentMethod: r.payment_method ?? null,
    paymentRef: r.payment_ref ?? null,
    paidAt: r.paid_at ? new Date(r.paid_at) : null,
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
  /** Premium payments: fee and online amount to record (null when payments are off). */
  payment?: { totalINR: number | null; dueINR: number | null } | null;
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
            (ref, service_id, service_name, starts_at, ends_at, status, name, phone, email, note, consent_at,
             payment_total_inr, payment_due_inr)
          VALUES
            (${newRef()}, ${input.serviceId}, ${input.serviceName}, ${startsAt}, ${endsAt}, ${status},
             ${input.name}, ${input.phone}, ${input.email}, ${input.note}, now(),
             ${input.payment?.totalINR ?? null}, ${input.payment?.dueINR ?? null})
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
 * The action lists (today / upcoming / week) only show bookings that still
 * need something from the clinic: status pending or confirmed. Done, no-show
 * and cancelled bookings drop off them and stay visible under Past / All / Report.
 *
 * today    – today's (IST) pending/confirmed bookings, all day (even once their time has passed)
 * upcoming – pending/confirmed bookings that haven't started yet (soonest first)
 * week     – today + next 6 days (IST), pending/confirmed – matches the Week calendar and 7-day strip
 * past     – bookings that have already started, any status, newest first (incl. earlier today)
 * all      – everything, newest first
 */
export type ListScope = "today" | "upcoming" | "week" | "past" | "all";

type Sql = Awaited<ReturnType<typeof db>>;

/** Premium payments filter: "unpaid" = unpaid or awaiting check (cancelled excluded); "check" = awaiting check only. */
export type PaymentFilter = "unpaid" | "check" | "paid";

export function parsePaymentFilter(v: unknown): PaymentFilter | null {
  return v === "unpaid" || v === "check" || v === "paid" ? v : null;
}

function paymentClause(sql: Sql, pay: PaymentFilter | null) {
  if (pay === "unpaid") return sql`AND payment_status IN ('unpaid', 'pending_verification') AND status <> 'cancelled'`;
  if (pay === "check") return sql`AND payment_status = 'pending_verification'`;
  if (pay === "paid") return sql`AND payment_status = 'paid'`;
  return sql``;
}

export async function listAppointments(scope: ListScope, q = "", pay: PaymentFilter | null = null): Promise<Appointment[]> {
  const sql = await db();
  const today = todayKey();
  const dayStart = zonedToUtc(today, "00:00");
  const dayEnd = zonedToUtc(addDays(today, 1), "00:00");
  const weekEnd = zonedToUtc(addDays(today, 7), "00:00");
  const now = new Date();
  const search = searchClause(sql, q);
  const active = sql`AND status IN ('pending', 'confirmed')`;
  const payF = paymentClause(sql, pay);

  let rows: Row[];
  if (scope === "today") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${dayStart} AND starts_at < ${dayEnd} ${active} ${search} ${payF} ORDER BY starts_at, ref`;
  } else if (scope === "upcoming") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${now} ${active} ${search} ${payF} ORDER BY starts_at, ref LIMIT 500`;
  } else if (scope === "week") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at >= ${dayStart} AND starts_at < ${weekEnd} ${active} ${search} ${payF} ORDER BY starts_at, ref LIMIT 500`;
  } else if (scope === "past") {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE starts_at < ${now} ${search} ${payF} ORDER BY starts_at DESC, (status = 'cancelled'), ref LIMIT 500`;
  } else {
    rows = await sql<Row[]>`SELECT * FROM appointments WHERE true ${search} ${payF} ORDER BY starts_at DESC, (status = 'cancelled'), ref LIMIT 2000`;
  }
  return rows.map(toAppointment);
}

/** Name / ref / email / phone-digits search fragment (parameterised). */
function searchClause(sql: Sql, q: string) {
  const term = q.trim().slice(0, 80);
  if (!term) return sql``;
  const like = "%" + term.replace(/[%_\\]/g, "\\$&") + "%";
  const digits = term.replace(/\D/g, "");
  return sql`AND (name ILIKE ${like} OR ref ILIKE ${like} OR email ILIKE ${like}
          ${digits.length >= 3 ? sql`OR regexp_replace(phone, '\\D', '', 'g') LIKE ${"%" + digits + "%"}` : sql``})`;
}

export type AdminStats = {
  /** Today's bookings still to see (pending/confirmed) – matches the Today tab. */
  today: number;
  todayDone: number;
  todayNoShow: number;
  /** Pending/confirmed bookings from today to today+6 (IST) – matches the Week tab and strip. */
  next7Days: number;
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
  const dayStart = zonedToUtc(today, "00:00");
  const dayEnd = zonedToUtc(addDays(today, 1), "00:00");
  const weekEnd = zonedToUtc(addDays(today, 7), "00:00");
  const [row] = await sql<
    { today: number; today_done: number; today_no_show: number; next7: number; upcoming: number; pending: number; no_shows: number; attended: number }[]
  >`
    SELECT
      count(*) FILTER (WHERE status IN ('pending', 'confirmed') AND starts_at >= ${dayStart} AND starts_at < ${dayEnd})::int AS today,
      count(*) FILTER (WHERE status = 'completed' AND starts_at >= ${dayStart} AND starts_at < ${dayEnd})::int AS today_done,
      count(*) FILTER (WHERE status = 'no_show' AND starts_at >= ${dayStart} AND starts_at < ${dayEnd})::int AS today_no_show,
      count(*) FILTER (WHERE status IN ('pending', 'confirmed') AND starts_at >= ${dayStart} AND starts_at < ${weekEnd})::int AS next7,
      count(*) FILTER (WHERE status IN ('pending', 'confirmed') AND starts_at >= now())::int AS upcoming,
      count(*) FILTER (WHERE status = 'pending' AND starts_at >= now())::int AS pending,
      count(*) FILTER (WHERE status = 'no_show' AND starts_at >= now() - interval '90 days')::int AS no_shows,
      count(*) FILTER (WHERE status = 'completed' AND starts_at >= now() - interval '90 days')::int AS attended
    FROM appointments`;

  // Next 7 days, for the week-at-a-glance strip (same rule as the Week tab).
  const perDay = await sql<{ starts_at: Date }[]>`
    SELECT starts_at FROM appointments
    WHERE status IN ('pending', 'confirmed') AND starts_at >= ${dayStart} AND starts_at < ${weekEnd}`;
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
    todayDone: row.today_done,
    todayNoShow: row.today_no_show,
    next7Days: row.next7,
    upcoming: row.upcoming,
    pending: row.pending,
    noShows: row.no_shows,
    attended: row.attended,
    noShowRate: finished ? row.no_shows / finished : null,
    week,
  };
}

/* ── Report (date range, IST) ─────────────────────────────────────────── */

export const ALL_STATUSES: AppointmentStatus[] = ["completed", "no_show", "cancelled", "pending", "confirmed"];

export type ServiceReport = {
  serviceId: string;
  serviceName: string;
  total: number;
  completed: number;
  noShow: number;
  cancelled: number;
};

export type AdminReport = {
  counts: Record<AppointmentStatus, number>;
  total: number;
  /** no_show / (no_show + completed), null when neither happened. */
  noShowRate: number | null;
  services: ServiceReport[];
};

/** Instants covering the IST dates from..to inclusive. */
function rangeBounds(fromKey: string, toKey: string) {
  return { start: zonedToUtc(fromKey, "00:00"), end: zonedToUtc(addDays(toKey, 1), "00:00") };
}

export async function getReport(fromKey: string, toKey: string): Promise<AdminReport> {
  const sql = await db();
  const { start, end } = rangeBounds(fromKey, toKey);
  const rows = await sql<{ service_id: string; service_name: string; status: AppointmentStatus; n: number }[]>`
    SELECT service_id, max(service_name) AS service_name, status, count(*)::int AS n
    FROM appointments
    WHERE starts_at >= ${start} AND starts_at < ${end}
    GROUP BY service_id, status`;
  const counts = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0])) as Record<AppointmentStatus, number>;
  const services = new Map<string, ServiceReport>();
  for (const r of rows) {
    counts[r.status] = (counts[r.status] ?? 0) + r.n;
    const s = services.get(r.service_id) ?? { serviceId: r.service_id, serviceName: r.service_name, total: 0, completed: 0, noShow: 0, cancelled: 0 };
    s.total += r.n;
    if (r.status === "completed") s.completed += r.n;
    if (r.status === "no_show") s.noShow += r.n;
    if (r.status === "cancelled") s.cancelled += r.n;
    services.set(r.service_id, s);
  }
  const finished = counts.no_show + counts.completed;
  return {
    counts,
    total: ALL_STATUSES.reduce((n, s) => n + counts[s], 0),
    noShowRate: finished ? counts.no_show / finished : null,
    services: [...services.values()].sort((a, b) => b.total - a.total || a.serviceName.localeCompare(b.serviceName)),
  };
}

/** Every appointment starting on IST dates from..to, optionally one status, by start time. */
export async function listReportAppointments(
  fromKey: string,
  toKey: string,
  status: AppointmentStatus | null,
  limit = 2000,
): Promise<Appointment[]> {
  const sql = await db();
  const { start, end } = rangeBounds(fromKey, toKey);
  const rows = await sql<Row[]>`
    SELECT * FROM appointments
    WHERE starts_at >= ${start} AND starts_at < ${end}
      ${status ? sql`AND status = ${status}` : sql``}
    ORDER BY starts_at, (status = 'cancelled'), ref
    LIMIT ${limit}`;
  return rows.map(toAppointment);
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

/* ── Premium payments ─────────────────────────────────────────────────── */

/** Patient sends a UPI / bank transaction reference → "awaiting check" until the clinic confirms. */
export async function submitPaymentRef(id: string, ref: string, method: "upi" | "bank"): Promise<Appointment> {
  const sql = await db();
  const [r] = await sql<Row[]>`
    UPDATE appointments
    SET payment_status = 'pending_verification', payment_ref = ${ref}, payment_method = ${method},
        payment_updated_at = now(), updated_at = now()
    WHERE id = ${id} AND status <> 'cancelled' AND payment_status IN ('unpaid', 'pending_verification')
    RETURNING *`;
  if (!r) {
    const current = await getAppointment(id);
    if (!current) throw new BookingError("not-found", "Appointment not found.");
    throw new BookingError("not-active", "This booking can no longer take a payment reference. Please call the clinic.");
  }
  return toAppointment(r);
}

/** Clinic records a payment (admin). */
export async function markPaid(
  id: string,
  opts: { method: PaymentMethod; ref: string | null; amountINR: number | null },
): Promise<Appointment> {
  const sql = await db();
  const [r] = await sql<Row[]>`
    UPDATE appointments
    SET payment_status = 'paid', payment_method = ${opts.method}, payment_ref = ${opts.ref},
        payment_paid_inr = ${opts.amountINR}, paid_at = now(), payment_updated_at = now(), updated_at = now()
    WHERE id = ${id}
    RETURNING *`;
  if (!r) throw new BookingError("not-found", "Appointment not found.");
  return toAppointment(r);
}

/** Clinic sets the payment back to unpaid, or marks it refunded / waived (admin). */
export async function setPaymentStatus(id: string, status: "unpaid" | "refunded" | "waived"): Promise<Appointment> {
  const sql = await db();
  const [r] =
    status === "unpaid"
      ? await sql<Row[]>`
          UPDATE appointments
          SET payment_status = 'unpaid', payment_method = NULL, payment_ref = NULL, payment_paid_inr = NULL,
              paid_at = NULL, payment_updated_at = now(), updated_at = now()
          WHERE id = ${id} RETURNING *`
      : await sql<Row[]>`
          UPDATE appointments
          SET payment_status = ${status}, payment_updated_at = now(), updated_at = now()
          WHERE id = ${id} RETURNING *`;
  if (!r) throw new BookingError("not-found", "Appointment not found.");
  return toAppointment(r);
}

export type PaymentTotals = {
  /** Sum recorded as received (status paid). */
  collectedINR: number;
  paidCount: number;
  /** Fee still to collect on unpaid / awaiting-check bookings (cancelled excluded). */
  outstandingINR: number;
  unpaidCount: number;
  checkCount: number;
  refundedCount: number;
  waivedCount: number;
};

export async function getPaymentTotals(fromKey: string, toKey: string): Promise<PaymentTotals> {
  const sql = await db();
  const { start, end } = rangeBounds(fromKey, toKey);
  const [r] = await sql<
    { collected: number; paid: number; outstanding: number; unpaid: number; checking: number; refunded: number; waived: number }[]
  >`
    SELECT
      coalesce(sum(payment_paid_inr) FILTER (WHERE payment_status = 'paid'), 0)::int AS collected,
      count(*) FILTER (WHERE payment_status = 'paid')::int AS paid,
      coalesce(sum(coalesce(payment_total_inr, payment_due_inr))
        FILTER (WHERE payment_status IN ('unpaid', 'pending_verification') AND status <> 'cancelled'), 0)::int AS outstanding,
      count(*) FILTER (WHERE payment_status IN ('unpaid', 'pending_verification') AND status <> 'cancelled')::int AS unpaid,
      count(*) FILTER (WHERE payment_status = 'pending_verification' AND status <> 'cancelled')::int AS checking,
      count(*) FILTER (WHERE payment_status = 'refunded')::int AS refunded,
      count(*) FILTER (WHERE payment_status = 'waived')::int AS waived
    FROM appointments
    WHERE starts_at >= ${start} AND starts_at < ${end}`;
  return {
    collectedINR: r.collected,
    paidCount: r.paid,
    outstandingINR: r.outstanding,
    unpaidCount: r.unpaid,
    checkCount: r.checking,
    refundedCount: r.refunded,
    waivedCount: r.waived,
  };
}

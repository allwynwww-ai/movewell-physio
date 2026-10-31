import Link from "next/link";
import AdminReschedule from "@/components/admin/AdminReschedule";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import SubmitButton from "@/components/admin/SubmitButton";
import {
  blockDayAction,
  cancelAction,
  loginAction,
  logoutAction,
  setStatusAction,
  unblockDayAction,
} from "@/app/admin/actions";
import {
  ALL_STATUSES,
  getReport,
  listAppointments,
  listReportAppointments,
  getStats,
  hasStarted,
  listBlockedDays,
  type Appointment,
  type AppointmentStatus,
  type AdminReport,
  type ListScope,
} from "@/lib/booking/appointments";
import { isAdmin } from "@/lib/booking/admin-auth";
import { adminConfigured, bookingStatus } from "@/lib/booking/env";
import { MAX_REPORT_DAYS, parseReportStatus, REPORT_PRESETS, resolveReportRange, type ReportRange } from "@/lib/booking/report";
import { addDays, dateKeyOf, formatDateKey, formatSlotTime, timeOf, todayKey, TZ_LABEL } from "@/lib/booking/time";
import { verifyNotice } from "@/lib/booking/tokens";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type View = ListScope | "report";
const VIEWS: { id: View; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "week", label: "Week" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
  { id: "report", label: "Report" },
];

const STATUS: Record<AppointmentStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  confirmed: { label: "Confirmed", cls: "bg-[var(--color-light-teal)] text-[var(--color-primary)]" },
  completed: { label: "Done", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  no_show: { label: "No-show", cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300" },
  cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400 line-through" },
};

const card = "bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]";
const smallBtn =
  "min-h-10 md:min-h-8 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors";
const input =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]";

function Banner({ kind, children }: { kind: "ok" | "error" | "warn"; children: React.ReactNode }) {
  const cls =
    kind === "ok"
      ? "bg-[var(--color-light-teal)] text-[var(--color-primary)] border-transparent"
      : kind === "error"
        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
        : "bg-amber-50 text-amber-900 border-amber-300/60 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm font-medium ${cls}`}>
      {children}
    </p>
  );
}

function Shell({ children, narrow = false }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <section className="py-10 md:py-14">
      <div className={`${narrow ? "max-w-md" : "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8`}>{children}</div>
    </section>
  );
}

function NotConfigured() {
  return (
    <Shell narrow>
      <div className={`${card} p-6 md:p-8`}>
        <p className="section-label mb-3">Clinic admin</p>
        <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-3">Admin is not set up yet</h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          To use the booking admin, the site owner needs to add a database (<code>DATABASE_URL</code> or <code>POSTGRES_URL</code>),{" "}
          <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> in the hosting settings, then redeploy.
        </p>
      </div>
    </Shell>
  );
}

function Login({ error, msg }: { error?: string; msg?: string }) {
  return (
    <Shell narrow>
      <div className={`${card} p-6 md:p-8 shadow-sm`}>
        <p className="section-label mb-3">Clinic admin</p>
        <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-1">Sign in</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Manage {siteConfig.brand.name} appointments.</p>
        <div className="space-y-3 mb-4">
          {error && <Banner kind="error">{error}</Banner>}
          {msg && <Banner kind="ok">{msg}</Banner>}
        </div>
        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Password
            </label>
            <input id="admin-password" name="password" type="password" required autoComplete="current-password" className={input} autoFocus />
          </div>
          <button type="submit" className="premium-btn premium-btn-primary w-full py-3 text-sm">
            Sign in
          </button>
        </form>
      </div>
    </Shell>
  );
}

function AppointmentRow({ a, back }: { a: Appointment; back: string }) {
  const st = STATUS[a.status];
  const isPast = hasStarted(a);
  const active = a.status === "pending" || a.status === "confirmed";
  const hidden = (
    <>
      <input type="hidden" name="id" value={a.id} />
      <input type="hidden" name="back" value={back} />
    </>
  );
  const statusBtn = (status: AppointmentStatus, label: string) => (
    <form action={setStatusAction}>
      {hidden}
      <input type="hidden" name="status" value={status} />
      <SubmitButton className={smallBtn}>{label}</SubmitButton>
    </form>
  );
  return (
    <li className={`${card} p-4 md:p-5`} data-testid="admin-appointment">
      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
        <div className="md:w-40 shrink-0">
          <p className="text-lg font-bold text-[var(--color-secondary)]">{formatSlotTime(timeOf(a.startsAt))}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{formatDateKey(dateKeyOf(a.startsAt))}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[var(--color-secondary)] break-words [overflow-wrap:anywhere] min-w-0">{a.name}</p>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{a.ref}</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{a.serviceName}</p>
          <p className="text-sm mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <a href={`tel:${a.phone}`} className="text-[var(--color-primary)] font-medium hover:underline">
              {a.phone}
            </a>
            <a href={`mailto:${a.email}`} className="text-[var(--color-primary)] font-medium hover:underline break-all">
              {a.email}
            </a>
          </p>
          {a.note && (
            <p className="text-sm text-[var(--color-text)] mt-2 rounded-lg bg-[var(--color-bg)] px-3 py-2 whitespace-pre-line [overflow-wrap:anywhere]">
              “{a.note}”
            </p>
          )}
          {a.status === "cancelled" && a.cancelledBy && (
            <p className="text-xs text-[var(--color-text-muted)] mt-2">Cancelled by {a.cancelledBy}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end md:max-w-xs">
          {a.status === "pending" && statusBtn("confirmed", "Confirm")}
          {active && isPast && statusBtn("completed", "Done")}
          {active && isPast && statusBtn("no_show", "No-show")}
          {!active && a.status !== "cancelled" && statusBtn("confirmed", "Undo")}
          {active && (
            <form action={cancelAction}>
              {hidden}
              <ConfirmSubmit
                message={`Cancel ${a.name}'s appointment? They will be emailed if email is set up.`}
                className={`${smallBtn} hover:!border-red-400 hover:!text-red-600`}
              >
                Cancel
              </ConfirmSubmit>
            </form>
          )}
        </div>
      </div>
      {active && (
        <div className="mt-3 md:pl-46">
          <AdminReschedule id={a.id} back={back} />
        </div>
      )}
    </li>
  );
}

function WeekCalendar({ rows, blocked }: { rows: Appointment[]; blocked: Map<string, string> }) {
  const today = todayKey();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3" data-testid="admin-week">
      {days.map((d) => {
        const items = rows.filter((a) => dateKeyOf(a.startsAt) === d);
        return (
          <div key={d} className={`${card} p-3 min-h-32 ${d === today ? "ring-2 ring-[var(--color-primary)]" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {formatDateKey(d, { year: undefined })}
            </p>
            {blocked.has(d) && <p className="text-[11px] text-red-600 mt-1">Blocked · {blocked.get(d)}</p>}
            <ul className="mt-2 space-y-1.5">
              {items.map((a) => (
                <li key={a.id} className={`rounded-lg px-2 py-1.5 text-xs [overflow-wrap:anywhere] ${STATUS[a.status].cls}`}>
                  <span className="font-bold">{formatSlotTime(timeOf(a.startsAt))}</span> {a.name}
                </li>
              ))}
              {!items.length && !blocked.has(d) && <li className="text-xs text-[var(--color-text-muted)]">No bookings</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const tabCls = (active: boolean) =>
  `min-h-10 md:min-h-8 flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
    active ? "bg-[var(--color-primary)] text-white dark:text-[#0B1220]" : "text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]"
  }`;
const chipCls = (active: boolean) =>
  `min-h-10 md:min-h-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
    active
      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white dark:text-[#0B1220]"
      : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
  }`;

const REPORT_LIST_LIMIT = 2000;

/** Query string for the Report tab / its CSV export. Custom ranges keep their dates. */
function reportQuery(range: ReportRange, status: AppointmentStatus | null, extra: Record<string, string> = {}) {
  return new URLSearchParams({
    ...extra,
    range: range.preset,
    ...(range.preset === "custom" ? { from: range.from, to: range.to } : {}),
    ...(status ? { status } : {}),
  }).toString();
}

function rangeLabel(from: string, to: string) {
  const days = Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) + 1;
  const f = (d: string) => formatDateKey(d, { weekday: undefined });
  return `${from === to ? f(from) : `${f(from)} – ${f(to)}`} · ${days} day${days === 1 ? "" : "s"}`;
}

function Report({
  range,
  status,
  report,
  rows,
}: {
  range: ReportRange;
  status: AppointmentStatus | null;
  report: AdminReport;
  rows: Appointment[];
}) {
  const pct = (r: number | null) => (r === null ? "–" : `${Math.round(r * 100)}%`);
  const countCards: { key: string; label: string; value: string; hint?: string }[] = [
    { key: "total", label: "Total", value: String(report.total) },
    ...(["completed", "no_show", "cancelled", "pending", "confirmed"] as AppointmentStatus[]).map((s) => ({
      key: s,
      label: STATUS[s].label,
      value: String(report.counts[s]),
    })),
    {
      key: "no-show-rate",
      label: "No-show rate",
      value: pct(report.noShowRate),
      hint: `${report.counts.no_show}/${report.counts.no_show + report.counts.completed} done or no-show`,
    },
  ];
  const statusCount = status ? report.counts[status] : report.total;
  return (
    <div id="report" className="scroll-mt-24 space-y-6" data-testid="admin-report">
      <div className={`${card} p-4 md:p-5`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
          <h2 className="font-semibold text-[var(--color-secondary)]">Report</h2>
          <p className="text-sm text-[var(--color-text-muted)]" data-testid="report-range">
            {rangeLabel(range.from, range.to)} ({TZ_LABEL})
          </p>
        </div>
        {range.error && (
          <div className="mb-3">
            <Banner kind="error">{range.error} Showing this month instead.</Banner>
          </div>
        )}
        <nav className="flex flex-wrap gap-2 mb-4" aria-label="Report range">
          {REPORT_PRESETS.map((p) => (
            <Link
              key={p.id}
              href={`/admin?${reportQuery({ preset: p.id, from: "", to: "" }, status, { view: "report" })}`}
              scroll={false}
              aria-current={range.preset === p.id && !range.error ? "page" : undefined}
              className={chipCls(range.preset === p.id && !range.error)}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <form action="/admin#report" method="get" className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end" aria-label="Custom range">
          <input type="hidden" name="view" value="report" />
          <input type="hidden" name="range" value="custom" />
          {status && <input type="hidden" name="status" value={status} />}
          <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
            From
            <input type="date" name="from" required defaultValue={range.from} className={`${input} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)]">
            To
            <input type="date" name="to" required defaultValue={range.to} className={`${input} mt-1`} />
          </label>
          <button type="submit" className="premium-btn premium-btn-primary col-span-2 sm:col-span-1 px-4 py-2.5 text-sm">
            Show range
          </button>
        </form>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-2">Custom ranges can be up to {MAX_REPORT_DAYS} days.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3" data-testid="report-counts">
        {countCards.map((c) => (
          <div key={c.key} data-key={c.key} className={`${card} p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{c.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mt-1" data-value>
              {c.value}
            </p>
            {c.hint && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{c.hint}</p>}
          </div>
        ))}
      </div>

      <div className={`${card} p-4 md:p-5`}>
        <h3 className="font-semibold text-[var(--color-secondary)] mb-3">By service</h3>
        {report.services.length ? (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-sm" data-testid="report-services">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="py-2 pr-3 font-semibold">Service</th>
                  <th className="py-2 px-2 font-semibold text-right">Bookings</th>
                  <th className="py-2 px-2 font-semibold text-right">Done</th>
                  <th className="py-2 px-2 font-semibold text-right">No-show</th>
                  <th className="py-2 pl-2 font-semibold text-right">Cancelled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {report.services.map((sv) => (
                  <tr key={sv.serviceId} data-service={sv.serviceId}>
                    <td className="py-2 pr-3 text-[var(--color-secondary)] font-medium [overflow-wrap:anywhere]">{sv.serviceName}</td>
                    <td className="py-2 px-2 text-right font-semibold tabular-nums">{sv.total}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{sv.completed}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{sv.noShow}</td>
                    <td className="py-2 pl-2 text-right tabular-nums">{sv.cancelled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">No bookings in this range.</p>
        )}
      </div>

      <div className={`${card} p-4 md:p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="font-semibold text-[var(--color-secondary)]">
            Appointments <span className="text-[var(--color-text-muted)] font-normal">({statusCount})</span>
          </h3>
          <a
            href={`/admin/export?${reportQuery(range, status, { scope: "report" })}`}
            className="premium-btn premium-btn-secondary px-4 py-2 text-sm"
            data-testid="report-export"
          >
            Export CSV
          </a>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 mb-4" aria-label="Status filter">
          {[null, ...ALL_STATUSES].map((st) => (
            <Link
              key={st ?? "all"}
              href={`/admin?${reportQuery(range, st, { view: "report" })}`}
              scroll={false}
              aria-current={st === status ? "page" : undefined}
              className={chipCls(st === status)}
            >
              {st ? STATUS[st].label : "All"}
              <span className="opacity-75">{st ? report.counts[st] : report.total}</span>
            </Link>
          ))}
        </nav>
        {rows.length ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {rows.map((a) => (
              <li
                key={a.id}
                data-testid="report-row"
                data-ref={a.ref}
                data-status={a.status}
                className="py-3 grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[9.5rem_minmax(0,1fr)_minmax(0,12rem)_auto] gap-x-3 gap-y-1 items-start"
              >
                <div className="text-sm">
                  <p className="font-bold text-[var(--color-secondary)]">{formatSlotTime(timeOf(a.startsAt))}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDateKey(dateKeyOf(a.startsAt))}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-secondary)] [overflow-wrap:anywhere]">{a.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {a.ref} ·{" "}
                    <a href={`tel:${a.phone}`} className="text-[var(--color-primary)] hover:underline">
                      {a.phone}
                    </a>
                  </p>
                  <p className="sm:hidden text-xs text-[var(--color-text-muted)] mt-0.5">{a.serviceName}</p>
                  <span className={`sm:hidden inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS[a.status].cls}`}>
                    {STATUS[a.status].label}
                  </span>
                </div>
                <p className="hidden sm:block text-sm text-[var(--color-text-muted)] [overflow-wrap:anywhere]">{a.serviceName}</p>
                <span className={`hidden sm:inline-block justify-self-end px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS[a.status].cls}`}>
                  {STATUS[a.status].label}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
            {status ? `No ${STATUS[status].label.toLowerCase()} appointments in this range.` : "No appointments in this range."}
          </p>
        )}
        {rows.length >= REPORT_LIST_LIMIT && (
          <p className="text-xs text-[var(--color-text-muted)] mt-3">Showing the first {REPORT_LIST_LIMIT}. Export CSV for the full list.</p>
        )}
      </div>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    q?: string;
    msg?: string;
    error?: string;
    sig?: string;
    range?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
}) {
  const sp = await searchParams;
  if (!adminConfigured()) return <NotConfigured />;
  // Banner text comes from the redirect URL; only show it if our server signed it.
  const notice = {
    msg: verifyNotice(sp.msg && `msg:${sp.msg}`, sp.sig) && sp.msg,
    error: verifyNotice(sp.error && `error:${sp.error}`, sp.sig) && sp.error,
  };
  if (!(await isAdmin())) return <Login error={notice.error || undefined} msg={notice.msg || undefined} />;

  const view: View = VIEWS.some((v) => v.id === sp.view) ? (sp.view as View) : "today";
  const isReport = view === "report";
  const q = isReport ? "" : (sp.q ?? "").slice(0, 80);
  const one = (v: unknown) => (typeof v === "string" ? v : undefined);
  const range = resolveReportRange({ range: one(sp.range), from: one(sp.from), to: one(sp.to) });
  const reportStatus = parseReportStatus(one(sp.status));
  const back = isReport
    ? `/admin?${reportQuery(range, reportStatus, { view })}`
    : `/admin?${new URLSearchParams({ view, ...(q ? { q } : {}) })}`;

  const [stats, rows, blockedDays, report] = await Promise.all([
    getStats(),
    isReport ? listReportAppointments(range.from, range.to, reportStatus, REPORT_LIST_LIMIT) : listAppointments(view, q),
    listBlockedDays(),
    isReport ? getReport(range.from, range.to) : null,
  ]);
  const blockedMap = new Map(blockedDays.map((b) => [b.day, b.reason]));
  const status = bookingStatus();

  const today = todayKey();
  const short = (d: string) => formatDateKey(d, { year: undefined, weekday: undefined });
  const todayHint = [
    stats.todayDone ? `${stats.todayDone} done` : "",
    stats.todayNoShow ? `${stats.todayNoShow} no-show` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const statCards = [
    { label: "Today", value: String(stats.today), hint: todayHint ? `to see · ${todayHint}` : "to see" },
    { label: "Next 7 days", value: String(stats.next7Days), hint: `${short(today)} – ${short(addDays(today, 6))}` },
    { label: "Upcoming", value: String(stats.upcoming), hint: stats.pending ? `${stats.pending} pending` : undefined },
    {
      label: "No-show rate",
      value: stats.noShowRate === null ? "–" : `${Math.round(stats.noShowRate * 100)}%`,
      hint: `last 90 days · ${stats.noShows}/${stats.noShows + stats.attended}`,
    },
  ];
  const exportHref = isReport
    ? `/admin/export?${reportQuery(range, reportStatus, { scope: "report" })}`
    : `/admin/export?${new URLSearchParams({ scope: view, ...(q ? { q } : {}) })}`;

  const tabs = (
    <nav className="grid grid-cols-3 sm:flex min-w-0 gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1" aria-label="Views">
      {VIEWS.map((v) => (
        <Link
          key={v.id}
          href={`/admin?${new URLSearchParams({ view: v.id, ...(q && v.id !== "report" ? { q } : {}) })}`}
          scroll={false}
          aria-current={v.id === view ? "page" : undefined}
          className={tabCls(v.id === view)}
        >
          {v.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="section-label mb-2">Clinic admin</p>
          <h1 className="heading-display text-3xl md:text-4xl">Appointments</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">All times {TZ_LABEL}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={exportHref} className="premium-btn premium-btn-secondary px-4 py-2 text-sm">
            Export CSV
          </a>
          <form action={logoutAction}>
            <SubmitButton className="premium-btn premium-btn-secondary px-4 py-2 text-sm">Sign out</SubmitButton>
          </form>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {status === "off" && (
          <Banner kind="warn">
            Online booking is switched off on the public site (features.onlineBooking). Patients see the request form; you can still
            manage existing bookings here.
          </Banner>
        )}
        {notice.msg && <Banner kind="ok">{notice.msg}</Banner>}
        {notice.error && <Banner kind="error">{notice.error}</Banner>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" data-testid="admin-stats">
        {statCards.map((s) => (
          <div key={s.label} className={`${card} p-4 md:p-5`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{s.label}</p>
            <p className="text-3xl font-bold text-[var(--color-secondary)] mt-1">{s.value}</p>
            {s.hint && <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.hint}</p>}
          </div>
        ))}
      </div>

      <div className={`${card} p-3 mb-8 grid grid-cols-7 gap-1 text-center`} aria-label="Next 7 days">
        {stats.week.map((d) => (
          <div
            key={d.date}
            title={
              blockedMap.has(d.date)
                ? `Blocked (${blockedMap.get(d.date)}) · ${d.count} booking${d.count === 1 ? "" : "s"} still on this day`
                : `${d.count} booking${d.count === 1 ? "" : "s"}`
            }
            className={`rounded-lg py-2 ${d.date === today ? "bg-[var(--color-light-teal)]" : ""}`}
          >
            <p className="text-[10px] sm:text-xs font-semibold uppercase text-[var(--color-text-muted)]">
              {formatDateKey(d.date, { day: undefined, month: undefined, year: undefined })}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">{Number(d.date.slice(8))}</p>
            <p className={`text-base sm:text-lg font-bold ${blockedMap.has(d.date) ? "text-red-500" : "text-[var(--color-secondary)]"}`}>
              {blockedMap.has(d.date) ? `×${d.count ? d.count : ""}` : d.count}
            </p>
          </div>
        ))}
      </div>

      {isReport && report ? (
        <div>
          <div id="appointments" className="scroll-mt-24 mb-4">
            {tabs}
          </div>
          <Report range={range} status={reportStatus} report={report} rows={rows} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
          <div className="min-w-0">
            <div id="appointments" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              {tabs}
              <form action="/admin#appointments" method="get" className="flex gap-2" role="search">
                <input type="hidden" name="view" value={view} />
                <input name="q" defaultValue={q} placeholder="Search name, phone, email or ref" aria-label="Search" className={`${input} sm:w-60`} />
                <button type="submit" className="premium-btn premium-btn-primary px-4 py-2 text-sm">
                  Search
                </button>
              </form>
            </div>
            {(view === "today" || view === "upcoming" || view === "week") && (
              <p className="text-xs text-[var(--color-text-muted)] -mt-2 mb-3">
                Showing pending and confirmed only. Done, no-show and cancelled bookings are under Past, All and Report.
              </p>
            )}

            {view === "week" ? (
              <WeekCalendar rows={rows} blocked={blockedMap} />
            ) : rows.length ? (
              <ul className="space-y-3">
                {rows.map((a) => (
                  <AppointmentRow key={a.id} a={a} back={back} />
                ))}
              </ul>
            ) : (
              <div className={`${card} p-10 text-center text-sm text-[var(--color-text-muted)]`}>
                {q
                  ? `No appointments match “${q}”.`
                  : {
                      today: "No pending or confirmed appointments today.",
                      upcoming: "No upcoming pending or confirmed appointments.",
                      week: "No bookings in the next 7 days.",
                      past: "No past appointments yet.",
                      all: "No appointments yet.",
                      report: "",
                    }[view]}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className={`${card} p-5`}>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Block a day</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">Leave, training or holidays. Existing bookings stay; patients can&apos;t book new ones.</p>
              <form action={blockDayAction} className="space-y-3">
                <input type="hidden" name="back" value={back} />
                <input type="date" name="day" required min={today} aria-label="Date to block" className={input} />
                <input name="reason" maxLength={80} placeholder="Reason (e.g. On leave)" aria-label="Reason" className={input} />
                <button type="submit" className="premium-btn premium-btn-primary w-full py-2.5 text-sm">
                  Block day
                </button>
              </form>
              {blockedDays.length > 0 && (
                <ul className="mt-5 divide-y divide-[var(--color-border)]">
                  {blockedDays.map((b) => (
                    <li key={b.day} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">{formatDateKey(b.day)}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{b.reason}</p>
                        {b.bookings > 0 && (
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            {b.bookings} booking{b.bookings === 1 ? "" : "s"} still on this day
                          </p>
                        )}
                      </div>
                      <form action={unblockDayAction}>
                        <input type="hidden" name="back" value={back} />
                        <input type="hidden" name="day" value={b.day} />
                        <SubmitButton className={smallBtn}>Re-open</SubmitButton>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={`${card} p-5 text-xs text-[var(--color-text-muted)] leading-relaxed`}>
              <p className="font-semibold text-[var(--color-secondary)] text-sm mb-1">Tips</p>
              Weekly hours, slot length and public holidays are set in <code>site.config.ts</code> → <code>onlineBooking</code>.
              Patient data here is private – don&apos;t share exports.
            </div>
          </aside>
        </div>
      )}
    </Shell>
  );
}

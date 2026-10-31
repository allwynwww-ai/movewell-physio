import { NextResponse } from "next/server";
import { listAppointments, listReportAppointments, type Appointment, type ListScope } from "@/lib/booking/appointments";
import { isAdmin } from "@/lib/booking/admin-auth";
import { parseReportStatus, resolveReportRange } from "@/lib/booking/report";
import { dateKeyOf, timeOf, todayKey } from "@/lib/booking/time";

export const dynamic = "force-dynamic";

/** Quote a CSV cell and neutralise spreadsheet formulas (=, +, -, @). */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Not signed in.", { status: 401 });
  const url = new URL(req.url);
  const scopeParam = url.searchParams.get("scope");
  let rows: Appointment[];
  let fileTag: string;
  if (scopeParam === "report") {
    // Same range + status rules as the Report tab (IST dates).
    const range = resolveReportRange({
      range: url.searchParams.get("range"),
      from: url.searchParams.get("from"),
      to: url.searchParams.get("to"),
    });
    if (range.error) return new NextResponse(range.error, { status: 400, headers: { "Cache-Control": "no-store" } });
    const status = parseReportStatus(url.searchParams.get("status"));
    rows = await listReportAppointments(range.from, range.to, status, 50000);
    fileTag = `report-${range.from}-to-${range.to}${status ? `-${status}` : ""}`;
  } else {
    const scope: ListScope =
      scopeParam === "today" || scopeParam === "upcoming" || scopeParam === "week" || scopeParam === "past" ? scopeParam : "all";
    rows = await listAppointments(scope, url.searchParams.get("q") ?? "");
    fileTag = `${scope}-${todayKey()}`;
  }
  const header = ["Reference", "Date (IST)", "Time (IST)", "Service", "Status", "Name", "Phone", "Email", "Note", "Booked at (IST)"];
  const lines = [header.map(cell).join(",")];
  for (const a of rows) {
    lines.push(
      [
        a.ref,
        dateKeyOf(a.startsAt),
        timeOf(a.startsAt),
        a.serviceName,
        a.status,
        a.name,
        a.phone,
        a.email,
        a.note,
        `${dateKeyOf(a.createdAt)} ${timeOf(a.createdAt)}`,
      ]
        .map(cell)
        .join(","),
    );
  }
  // BOM so Excel opens UTF-8 names correctly.
  return new NextResponse("\uFEFF" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointments-${fileTag}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

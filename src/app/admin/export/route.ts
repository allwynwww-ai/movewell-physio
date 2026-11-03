import { NextResponse } from "next/server";
import {
  listAppointments,
  listReportAppointments,
  parsePaymentFilter,
  type Appointment,
  type ListScope,
} from "@/lib/booking/appointments";
import { isAdmin } from "@/lib/booking/admin-auth";
import { isPaymentsOn } from "@/lib/booking/payments";
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
  const payments = isPaymentsOn();
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
    const pay = payments ? parsePaymentFilter(url.searchParams.get("pay")) : null;
    rows = await listAppointments(scope, url.searchParams.get("q") ?? "", pay);
    fileTag = `${scope}${pay ? `-${pay}` : ""}-${todayKey()}`;
  }
  const header = ["Reference", "Date (IST)", "Time (IST)", "Service", "Status", "Name", "Phone", "Email", "Note", "Booked at (IST)"];
  // Premium payments: extra columns only when the feature is on (the base header stays unchanged).
  if (payments) header.push("Payment status", "Fee (INR)", "Due online (INR)", "Paid (INR)", "Payment method", "Payment reference", "Paid at (IST)");
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
        ...(payments
          ? [
              a.paymentStatus,
              a.paymentTotalINR?.toString() ?? "",
              a.paymentDueINR?.toString() ?? "",
              a.paymentPaidINR?.toString() ?? "",
              a.paymentMethod ?? "",
              a.paymentRef ?? "",
              a.paidAt ? `${dateKeyOf(a.paidAt)} ${timeOf(a.paidAt)}` : "",
            ]
          : []),
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

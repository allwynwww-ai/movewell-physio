import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ManageBooking from "@/components/booking/ManageBooking";
import { getAppointment, hasStarted, withinCutoff } from "@/lib/booking/appointments";
import { bookingStatus } from "@/lib/booking/env";
import { booking, formatInstant } from "@/lib/booking/time";
import { verifyManageToken } from "@/lib/booking/tokens";
import { CLINIC_PHONE_DISPLAY, siteConfig, telLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage your appointment",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "Missed",
};

export default async function ManagePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (bookingStatus() !== "ready") notFound();
  const id = verifyManageToken(decodeURIComponent(token));
  if (!id) notFound();
  const a = await getAppointment(id);
  if (!a) notFound();

  const active = a.status === "pending" || a.status === "confirmed";
  const upcoming = !hasStarted(a);
  const canChange = active && withinCutoff(a);

  return (
    <section className="py-12 md:py-16 bg-[var(--color-bg)] min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="section-label mb-3">Your appointment</p>
        <h1 className="heading-display text-3xl md:text-4xl mb-6">Manage your booking</h1>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Hi {a.name.split(" ")[0]},</p>
              <p className="text-xl font-bold text-[var(--color-secondary)] mt-1">{formatInstant(a.startsAt)}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {a.serviceName} · {booking.slotMinutes} min · Ref {a.ref}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                active
                  ? "bg-[var(--color-light-teal)] text-[var(--color-primary)]"
                  : "bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
              }`}
            >
              {STATUS_LABEL[a.status] ?? a.status}
            </span>
          </div>

          {canChange ? (
            <>
              <ManageBooking token={token} />
              <p className="text-xs text-[var(--color-text-muted)] mt-6">
                You can change or cancel online until {booking.cancellationCutoffHours} hours before your appointment.
              </p>
            </>
          ) : active && upcoming ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Online changes close {booking.cancellationCutoffHours} hours before the appointment. To change or cancel now, please
              call{" "}
              <a href={telLink} className="font-semibold text-[var(--color-primary)] hover:underline">
                {CLINIC_PHONE_DISPLAY}
              </a>
              .
            </p>
          ) : a.status === "cancelled" ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              This appointment was cancelled.{" "}
              <Link href="/book" className="font-semibold text-[var(--color-primary)] hover:underline">
                Book a new time →
              </Link>
            </p>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">This appointment can no longer be changed online.</p>
          )}

          {active && (
            <a
              href={`/api/booking/ics?token=${encodeURIComponent(token)}`}
              className="inline-block mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline"
              download
            >
              Add to calendar (.ics)
            </a>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mt-6">
          Keep this link private – anyone with it can change your booking. Questions? Call {siteConfig.brand.name} on{" "}
          <a href={telLink} className="font-semibold text-[var(--color-primary)] hover:underline">
            {CLINIC_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

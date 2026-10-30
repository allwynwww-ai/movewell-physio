import BookingForm from "@/components/BookingForm";
import OnlineBooking from "@/components/booking/OnlineBooking";
import { bookingStatus } from "@/lib/booking/env";
import { booking } from "@/lib/booking/time";
import OpeningHours from "@/components/OpeningHours";
import {
  CLINIC_PHONE_DISPLAY,
  IS_DEMO_NUMBER,
  siteConfig,
  telLink,
  whatsappLink,
  WHATSAPP_MESSAGES,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const status = bookingStatus();
const live = status === "ready";
const whatToExpect = live
  ? [
      "Pick a free time – your appointment is confirmed instantly.",
      `You get a confirmation with a calendar invite and a link to reschedule or cancel (up to ${booking.cancellationCutoffHours} hours before).`,
      ...siteConfig.booking.whatToExpect.slice(1),
    ]
  : siteConfig.booking.whatToExpect;

export const metadata = pageMetadata({
  title: "Book an Appointment",
  description: live
    ? `Book a physiotherapy appointment at ${siteConfig.brand.name} online. Pick a free time, get instant confirmation, and cancel or reschedule online.`
    : `Request a physiotherapy appointment at ${siteConfig.brand.name}. Send the online form or message the clinic on WhatsApp, and the clinic will contact you to confirm.`,
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="section-label mb-3">Book online</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">{live ? "Book an Appointment" : "Request an Appointment"}</h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            {live
              ? `Choose a service and a free time below. Your appointment is confirmed instantly, and you can cancel or reschedule online up to ${booking.cancellationCutoffHours} hours before.`
              : "Fill in the form below and the clinic will contact you to confirm a time. Prefer a quicker reply? Message us on WhatsApp."}
          </p>
          <a
            href={whatsappLink(WHATSAPP_MESSAGES.book)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold transition-colors"
          >
            {live ? "Or book on WhatsApp" : "Request on WhatsApp"}
          </a>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              {live ? (
                <OnlineBooking />
              ) : status === "not-configured" ? (
                <div className="space-y-6">
                  <div
                    role="status"
                    className="rounded-2xl border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 p-5 text-sm text-amber-900 dark:text-amber-200"
                  >
                    <strong className="font-semibold">Online booking is coming soon.</strong> For now, send a request below and the
                    clinic will confirm a time with you.
                  </div>
                  <BookingForm />
                </div>
              ) : (
                <BookingForm />
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-4">What to Expect</h3>
                <ol className="space-y-3 text-sm text-[var(--color-text-muted)]">
                  {whatToExpect.map((item, i) => (
                    <li key={item} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-4">Opening Hours</h3>
                <OpeningHours />
              </div>

              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-3">Prefer WhatsApp or Call?</h3>
                <a href={telLink} className="text-xl font-bold text-[var(--color-primary)] hover:underline block">
                  {CLINIC_PHONE_DISPLAY}
                </a>
                {IS_DEMO_NUMBER && (
                  <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Demo number</p>
                )}
                <a
                  href={whatsappLink(WHATSAPP_MESSAGES.book)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-[#128C7E] dark:text-[#25D366] hover:underline"
                >
                  Message on WhatsApp →
                </a>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">Replies during opening hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

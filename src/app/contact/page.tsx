import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MoveWell Physiotherapy in Thane, Maharashtra. Phone, email, address and opening hours.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase mb-2">
            Get in Touch
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
            Have a question or ready to book? Reach out — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="pt-6 pb-16 md:pt-8 md:pb-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Phone</h2>
              <a href="tel:+912212345678" className="text-[var(--color-primary)] font-medium hover:underline">
                +91 22 1234 5678
              </a>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">Mon–Fri 8:00am – 6:00pm</p>
            </div>

            {/* Email */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Email</h2>
              <a href="mailto:hello@movewell.physio" className="text-[var(--color-primary)] font-medium hover:underline">
                hello@movewell.physio
              </a>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">We reply within 1 business day</p>
            </div>

            {/* Address */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Clinic</h2>
              <p className="text-[var(--color-text)]">
                Near Jupiter Hospital<br />
                Eastern Express Highway, Thane<br />
                Maharashtra 400601
              </p>
            </div>
          </div>

          {/* Map placeholder + CTA */}
          <div className="mt-12 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 aspect-[16/9] lg:aspect-auto lg:min-h-[320px] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
              <iframe
                title="Jupiter Hospital, Thane - Google Maps"
                src="https://www.google.com/maps?q=Jupiter+Hospital,+Eastern+Express+Highway,+next+to+Viviana+Mall,+Thane,+Maharashtra+400601&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-[var(--color-secondary)] rounded-2xl p-8 flex flex-col justify-center text-white">
              <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                Book online in a few clicks or call us during business hours. New patients are always welcome.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

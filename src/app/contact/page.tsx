import Link from "next/link";
import OpeningHours from "@/components/OpeningHours";
import {
  addressLines,
  CLINIC_EMAIL,
  CLINIC_PHONE_DISPLAY,
  IS_DEMO_NUMBER,
  mailtoLink,
  siteConfig,
  telLink,
  whatsappLink,
  WHATSAPP_MESSAGES,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Get in touch with ${siteConfig.brand.name} in ${siteConfig.address.city}. Address, opening hours, phone, email and WhatsApp.`,
  path: "/contact",
});

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
            WhatsApp is the fastest way to reach us. You can also call, email, or book online.
          </p>
        </div>
      </section>

      <section className="pt-6 pb-16 md:pt-8 md:pb-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[var(--color-surface)] rounded-2xl border-2 border-[#25D366]/40 p-7">
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#25D366] mb-1">Primary</p>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">WhatsApp</h2>
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.ask)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#128C7E] font-medium hover:underline"
              >
                Message us now
              </a>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">Fastest reply during clinic hours</p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Phone</h2>
              <a href={telLink} className="text-[var(--color-primary)] font-medium hover:underline">
                {CLINIC_PHONE_DISPLAY}
              </a>
              {IS_DEMO_NUMBER && (
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Demo number</p>
              )}
              <p className="text-sm text-[var(--color-text-muted)] mt-2">During opening hours</p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Email</h2>
              <a href={mailtoLink} className="text-[var(--color-primary)] font-medium hover:underline break-all">
                {CLINIC_EMAIL}
              </a>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{siteConfig.contact.emailReplyTime}</p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-7">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[var(--color-secondary)] mb-1">Clinic</h2>
              <address className="not-italic text-[var(--color-text)]">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 aspect-[16/9] lg:aspect-auto lg:min-h-[320px] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm">
              <iframe
                title={siteConfig.address.mapTitle}
                src={siteConfig.address.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div id="hours" className="bg-[var(--color-footer-bg)] rounded-2xl p-8 flex flex-col justify-center text-white scroll-mt-28">
              <h2 className="text-lg font-bold mb-3">Opening hours</h2>
              <OpeningHours tone="inverse" className="mb-7" />
              <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                WhatsApp is the quickest way to ask a question or request a slot. New patients are always welcome.
              </p>
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.book)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-full transition-colors mb-3"
              >
                Message on WhatsApp
              </a>
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

import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Services",
  description: `Physiotherapy services at ${siteConfig.brand.name}: ${siteConfig.services
    .map((s) => s.name)
    .join(", ")}.`,
  path: "/services",
});

const services = siteConfig.services;

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="section-label mb-3">What we offer</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">
            Our Physiotherapy Services
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Evidence-based care for your body, movement and wellbeing — personalised to your goals.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="premium-card p-7 group flex flex-col scroll-mt-28"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon name={service.icon} />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 tracking-tight">
                  {service.name}
                </h2>
                {(service.duration || service.priceINR !== undefined) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {service.duration && (
                      <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border-light)] rounded-full px-2.5 py-0.5">
                        {service.duration}
                      </span>
                    )}
                    {service.priceINR !== undefined && (
                      <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-light-teal)] rounded-full px-2.5 py-0.5">
                        {formatINR(service.priceINR)}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5 flex-1">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:gap-2 gap-1 transition-all mt-auto"
                >
                  Book this service
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-footer-bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.12)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Not sure which service you need?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Book an assessment and we&apos;ll guide you to the right plan for your goals.
          </p>
          <Link href="/book" className="premium-btn premium-btn-primary px-8 py-4 text-base">
            Book Your Appointment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

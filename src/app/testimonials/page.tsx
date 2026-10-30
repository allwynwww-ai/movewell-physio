import Link from "next/link";
import AnimatedCounter from "@/components/AnimatedCounter";
import SampleNotice from "@/components/SampleNotice";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { hasSampleStats, hasSampleTestimonials, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Patient Testimonials",
  description: `Patient stories and reviews from people treated at ${siteConfig.brand.name}.`,
  path: "/testimonials",
});

const summaryStats = siteConfig.stats.slice(0, 3);

export default function TestimonialsPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="section-label mb-3">Patient stories</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">
            What Our Patients Say
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Here&apos;s what patients have shared about their experience at {siteConfig.brand.shortName}.
          </p>
          {hasSampleTestimonials && <SampleNotice kind="reviews" className="mt-5" />}
        </div>
      </section>

      {/* Rating summary */}
      <section className="py-10 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            {summaryStats.map((stat, i) => (
              <div key={stat.label} className="contents">
                {i > 0 && <div className="h-16 w-px bg-[var(--color-border)] hidden md:block" />}
                <div>
                  <p className="text-5xl font-bold text-[var(--color-secondary)] tracking-tight">
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          {hasSampleStats && (
            <div className="mt-6 text-center">
              <SampleNotice kind="stats" />
            </div>
          )}
        </div>
      </section>

      {/* Carousel */}
      <section className="py-16 md:py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-footer-bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.12)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Personalised physiotherapy care in {siteConfig.address.city}. Send a request and the clinic will get back to you.
          </p>
          <Link
            href="/book"
            className="premium-btn premium-btn-primary px-8 py-4 text-base"
          >
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

import Link from "next/link";
import type { Metadata } from "next";
import AnimatedCounter from "@/components/AnimatedCounter";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

export const metadata: Metadata = {
  title: "Patient Testimonials",
  description:
    "Read real patient stories and reviews from people who recovered with MoveWell Physiotherapy in Thane, Maharashtra.",
};

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
            Real results from real people. Here&apos;s what patients have shared about their experience at MoveWell.
          </p>
        </div>
      </section>

      {/* Rating summary */}
      <section className="py-10 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-5xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={4.9} duration={2000} decimals={1} />
              </p>
              <div className="flex justify-center gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Based on 240+ Google reviews</p>
            </div>
            <div className="h-16 w-px bg-slate-300 hidden md:block" />
            <div>
              <p className="text-5xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={1000} duration={2200} suffix="+" />
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Patients helped in Thane</p>
            </div>
            <div className="h-16 w-px bg-slate-300 hidden md:block" />
            <div>
              <p className="text-5xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={98} duration={2000} suffix="%" />
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Would recommend to a friend</p>
            </div>
          </div>
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
        <div className="absolute inset-0 bg-[var(--color-secondary)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.12)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Join the hundreds of patients who have found lasting relief with personalised physiotherapy care in Thane.
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

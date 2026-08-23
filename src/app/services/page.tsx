import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our physiotherapy services including back & neck pain, sports injury rehabilitation, post-surgical rehab, pelvic floor therapy and more.",
};

const services = [
  {
    id: "back-neck-pain",
    title: "Back & Neck Pain",
    description:
      "Targeted treatment for neck, upper back and lower back pain to restore mobility and reduce discomfort. We use a combination of manual therapy, exercise prescription and education.",
    features: ["Spinal assessment", "Manual therapy", "Posture correction", "Home exercise programs"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-1 2-2 3.5-2 6s1 4 2 6c1-2 2-3.5 2-6s-1-4-2-6z" />
        <path d="M10 9h4M10 12h4M11 15h2M12 15v5" />
      </svg>
    ),
  },
  {
    id: "sports-injury",
    title: "Sports Injury Rehabilitation",
    description:
      "Specialised rehab to help you recover from sports injuries, regain strength and return to performance safely. Suitable for recreational and elite athletes.",
    features: ["Injury assessment", "Sport-specific rehab", "Return-to-play planning", "Injury prevention"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4l-3 6M12 11l3 6M9 13h6M8 21l2-4M16 21l-2-4" />
      </svg>
    ),
  },
  {
    id: "post-surgical",
    title: "Post-Surgical Rehab",
    description:
      "Structured rehabilitation following surgery to optimise recovery, restore function and help you achieve your goals with confidence.",
    features: ["Pre & post-op care", "Scar management", "Progressive loading", "Functional recovery"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 14c0-2 1.5-4 4-5.5C14.5 10 16 12 16 14a4 4 0 01-8 0z" />
        <path d="M12 8.5V6M10 7h4M7 18h10M9 21h6" />
      </svg>
    ),
  },
  {
    id: "pelvic-floor",
    title: "Pelvic Floor Therapy",
    description:
      "Specialist care for pelvic health concerns including incontinence, pelvic pain and pre/postnatal support in a private and supportive environment.",
    features: ["Pelvic assessment", "Internal & external techniques", "Bladder training", "Pregnancy support"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-4-3.5-7-6.5-7-10a7 7 0 1114 0c0 3.5-3 6.5-7 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
  {
    id: "vestibular-balance",
    title: "Vestibular & Balance",
    description:
      "Assessment and treatment for dizziness, vertigo and balance disorders to improve stability and confidence in daily activities.",
    features: ["Vestibular assessment", "Canalith repositioning", "Balance retraining", "Fall prevention"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10l1.4-1.4" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: "manual-therapy",
    title: "Manual Therapy",
    description:
      "Hands-on techniques including joint mobilisation, soft tissue therapy and manipulation to relieve pain and improve movement.",
    features: ["Joint mobilisation", "Soft tissue release", "Trigger point therapy", "Myofascial techniques"],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
  },
];

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
                key={service.title}
                id={service.id}
                className="premium-card p-7 group flex flex-col scroll-mt-28"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 tracking-tight">
                  {service.title}
                </h2>
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
        <div className="absolute inset-0 bg-[var(--color-secondary)]" />
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

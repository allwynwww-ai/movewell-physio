import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from "@/components/AnimatedCounter";

const services = [
  {
    title: "Back Pain",
    description: "Relieve pain, improve mobility and strengthen your back for lasting results.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0-16c-2 2-4 4-4 8s2 6 4 8m0-16c2 2 4 4 4 8s-2 6-4 8" />
      </svg>
    ),
  },
  {
    title: "Sports Injuries",
    description: "Return to sport safely with expert assessment and tailored rehabilitation.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Post-Surgical Rehab",
    description: "Optimise recovery, restore function and regain confidence after surgery.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Neck & Shoulder",
    description: "Ease tension, improve posture and restore natural movement patterns.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-hero-glow overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-light-teal)] border border-[var(--color-primary)]/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                <span className="text-xs font-semibold text-[var(--color-primary)] tracking-wide">
                  Physiotherapy · Thane, Maharashtra
                </span>
              </div>

              <h1 className="heading-display text-4xl sm:text-5xl lg:text-[3.5rem] mb-5">
                Expert care to get you{" "}
                <span className="text-[var(--color-primary)]">moving pain-free</span>
              </h1>

              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-lg mb-8">
                Personalised, evidence-based physiotherapy. Hands-on treatment and clear guidance so you can return to the life you love.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="premium-btn premium-btn-primary px-7 py-3.5 text-[15px]"
                >
                  Book Appointment
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="premium-btn premium-btn-secondary px-7 py-3.5 text-[15px]"
                >
                  Meet Your Therapist
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-[var(--color-primary)]/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[var(--color-text-muted)] ml-1">Trusted by 1,000+</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  <span className="font-semibold text-[var(--color-secondary)]">4.9</span>
                  <span className="text-[var(--color-text-muted)]">Google</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)]">
                <Image
                  src="/images/hero.jpg"
                  alt="Physiotherapy treatment session"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 left-6 right-6 sm:left-auto sm:right-6 sm:w-56 bg-[var(--color-surface)]/95 backdrop-blur-md rounded-2xl p-4 shadow-[var(--shadow-lg)] border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-secondary)]">Same-week availability</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Book online in minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust metrics with animated counters */}
      <section className="border-y border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--color-border-light)]">
            <div className="py-8 px-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={1000} duration={2200} suffix="+" />
              </p>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">Patients Treated</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={4.9} duration={2000} decimals={1} />
              </p>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">Google Rating</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={10} duration={1800} suffix="+" />
              </p>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">Years Experience</p>
            </div>
            <div className="py-8 px-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] tracking-tight">
                <AnimatedCounter end={98} duration={2000} suffix="%" />
              </p>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">Would Recommend</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 bg-premium-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label mb-3">What we treat</p>
            <h2 className="heading-display text-3xl md:text-4xl mb-4">
              Conditions we help you recover from
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Targeted, one-to-one physiotherapy for the issues that matter most to you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <div key={service.title} className="premium-card p-6 group">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-secondary)] mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">
                  {service.description}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:gap-2 gap-1 transition-all"
                >
                  Learn more
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="premium-btn premium-btn-secondary px-6 py-3 text-sm"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 md:py-28 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)] relative">
                <Image
                  src="/images/therapist.jpg"
                  alt="Emily Watson - Principal Physiotherapist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-lg)] px-5 py-4 border border-[var(--color-border-light)]">
                <p className="font-semibold text-[var(--color-secondary)] text-sm tracking-tight">Emily Watson</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Principal Physiotherapist · IAP</p>
              </div>
            </div>

            <div>
              <p className="section-label mb-3">Your therapist</p>
              <h2 className="heading-display text-3xl md:text-4xl mb-5">
                Hi, I&apos;m Emily
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                With over a decade of clinical experience, I help people move better and live without unnecessary pain. My approach is evidence-based, hands-on, and always centred on your goals.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
                Whether you&apos;re recovering from surgery, managing a sports injury, or dealing with persistent back or neck pain, we&apos;ll create a clear plan together.
              </p>
              <Link
                href="/about"
                className="premium-btn premium-btn-primary px-6 py-3 text-sm"
              >
                More about me
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-secondary)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.15)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to move better?
          </h2>
          <p className="text-white/70 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
            Book your appointment online and take the first step toward lasting relief and better movement.
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

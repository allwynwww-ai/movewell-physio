import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQ from "@/components/FAQ";
import Icon from "@/components/Icon";
import SampleNotice from "@/components/SampleNotice";
import {
  hasSampleStats,
  primaryTherapist,
  siteConfig,
  whatsappLink,
  WHATSAPP_MESSAGES,
} from "@/lib/site";
import { faqJsonLd, jsonLdString, pageMetadata } from "@/lib/seo";
import { GoogleReviewsSection } from "@/components/GoogleReviews";
import TeamMemberCard from "@/components/TeamMemberCard";
import { getTeam } from "@/lib/features";

export const metadata = pageMetadata({ path: "/" });

const { hero, conditions, stats } = siteConfig;
const therapist = primaryTherapist;

export default function HomePage() {
  const team = getTeam();
  const homeTeam = team.slice(0, Math.max(1, Math.min(4, siteConfig.team.homeLimit || 3)));
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
                  {hero.eyebrow}
                </span>
              </div>

              <h1 className="heading-display text-[2.25rem] leading-[1.12] sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] mb-5 text-balance break-words">
                {hero.headingStart}{" "}
                <span className="text-[var(--color-primary)]">{hero.headingHighlight}</span>
              </h1>

              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-lg mb-8">
                {hero.subheading}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappLink(WHATSAPP_MESSAGES.book)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-btn px-7 py-3.5 text-[15px] bg-[#25D366] hover:bg-[#20BD5A] text-white"
                >
                  WhatsApp us
                </a>
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

              {hero.highlights.length > 0 && (
                <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {hero.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="order-1 lg:order-2 relative mb-6 lg:mb-0">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)]">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-60 bg-[var(--color-surface)]/95 backdrop-blur-md rounded-2xl p-4 shadow-[var(--shadow-lg)] border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-secondary)]">{hero.badgeTitle}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{hero.badgeText}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 px-4 text-center border-[var(--color-border-light)] ${
                  i % 2 === 1 ? "border-l" : ""
                } ${i > 0 && i % 4 !== 0 ? "md:border-l" : "md:border-l-0"} ${
                  i >= 2 ? "border-t md:border-t-0" : ""
                }`}
              >
                <p className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] tracking-tight">
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          {hasSampleStats && (
            <div className="pb-5 -mt-1 text-center">
              <SampleNotice kind="stats" />
            </div>
          )}
        </div>
      </section>

      {/* Google rating (Pro — features.googleReviews) */}
      <GoogleReviewsSection />

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
            {conditions.map((service) => (
              <div key={service.title} className="premium-card p-6 group">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon name={service.icon} />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-secondary)] mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">
                  {service.description}
                </p>
                <Link
                  href={service.serviceId ? `/services#${service.serviceId}` : "/services"}
                  className="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:gap-2 gap-1 transition-all"
                  aria-label={`Learn more about ${service.title}`}
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
                  src={therapist.photo}
                  alt={therapist.photoAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-lg)] px-5 py-4 border border-[var(--color-border-light)]">
                <p className="font-semibold text-[var(--color-secondary)] text-sm tracking-tight">{therapist.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{therapist.shortCredentials}</p>
              </div>
            </div>

            <div>
              <p className="section-label mb-3">Your therapist</p>
              <h2 className="heading-display text-3xl md:text-4xl mb-5">
                Hi, I&apos;m {therapist.firstName}
              </h2>
              {therapist.bio.slice(0, 2).map((para, i) => (
                <p
                  key={i}
                  className={`text-[var(--color-text-muted)] leading-relaxed ${i === 1 ? "mb-8" : "mb-4"}`}
                >
                  {para}
                </p>
              ))}
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

      {/* Meet our team (Pro — features.therapists) */}
      {homeTeam.length > 0 && (
        <section data-testid="home-team" className="py-20 md:py-24 bg-premium-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="section-label mb-3">Our team</p>
              <h2 className="heading-display text-3xl md:text-4xl mb-4">{siteConfig.team.heading}</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{siteConfig.team.intro}</p>
            </div>
            <div
              className={`grid gap-5 ${
                homeTeam.length === 1
                  ? "max-w-md mx-auto"
                  : homeTeam.length === 2
                    ? "sm:grid-cols-2 max-w-3xl mx-auto"
                    : homeTeam.length === 4
                      ? "sm:grid-cols-2 lg:grid-cols-4"
                      : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {homeTeam.map((m) => (
                <TeamMemberCard key={m.slug} member={m} variant="compact" />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/team" className="premium-btn premium-btn-secondary px-6 py-3 text-sm">
                {team.length > homeTeam.length ? `Meet all ${team.length} team members` : "Meet the team"}
              </Link>
            </div>
          </div>
        </section>
      )}

      <FAQ />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd()) }}
      />

      {/* CTA Banner */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-footer-bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.15)_0%,_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to move better?
          </h2>
          <p className="text-white/70 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
            Message us on WhatsApp for the fastest reply, or book online if you prefer a form.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.book)}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn px-8 py-4 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              WhatsApp us
            </a>
            <Link
              href="/book"
              className="premium-btn premium-btn-primary px-8 py-4 text-base"
            >
              Book online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

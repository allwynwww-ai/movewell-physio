import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Emily Watson, principal physiotherapist at MoveWell. Learn about our philosophy, qualifications and approach to care.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase mb-2">
            About MoveWell
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4">
            Meet Your Physiotherapist
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
            Real care from a real person. Here&apos;s a little about who you&apos;ll be working with.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative sticky top-28">
                <Image
                  src="/images/therapist.jpg"
                  alt="Emily Watson - Principal Physiotherapist at MoveWell"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-3">
                  Hi, I&apos;m Emily
                </h2>
                <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                  <p>
                    I founded MoveWell Physiotherapy with a simple goal: to provide high-quality,
                    personalised care that helps people get back to the activities they love —
                    without the frustration of long wait times or one-size-fits-all treatment.
                  </p>
                  <p>
                    Based in Thane, Maharashtra, I graduated with a Bachelor of Physiotherapy and spent several years working
                    in private practice and sports settings. I&apos;ve treated everyone from office
                    workers with nagging desk-related pain to weekend warriors and competitive athletes
                    recovering from serious injuries.
                  </p>
                  <p>
                    My approach combines hands-on treatment with clear education and practical
                    exercise programs. I want you to understand <em>why</em> you&apos;re experiencing
                    pain and feel empowered to manage it long-term.
                  </p>
                </div>
              </div>

              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-4">Qualifications & Memberships</h3>
                <ul className="space-y-2.5">
                  {[
                    "Bachelor of Physiotherapy (BPhty)",
                    "Member of the Indian Association of Physiotherapists (IAP)",
                    "Dry Needling Level 1 & 2",
                    "Sports Physiotherapy Level 1",
                    "Pelvic Health introductory training",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                      <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">
                  Our Philosophy
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Listen First", text: "We take time to understand your story, goals and concerns before any treatment begins." },
                    { title: "Evidence-Based", text: "Treatment is guided by the latest research combined with clinical experience." },
                    { title: "You Are the Expert", text: "We collaborate with you — your feedback and goals drive the plan." },
                    { title: "Long-Term Results", text: "We focus on lasting change, not just temporary symptom relief." },
                  ].map((item) => (
                    <div key={item.title} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
                      <h4 className="font-semibold text-[var(--color-secondary)] mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                Book with Emily
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Extra clinic image strip */}
      <section className="pb-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-md">
              <Image
                src="/images/clinic-1.jpg"
                alt="Modern physiotherapy clinic treatment room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-md">
              <Image
                src="/images/clinic-2.jpg"
                alt="Physiotherapy exercise and rehabilitation area"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

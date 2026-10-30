import Link from "next/link";
import Image from "next/image";
import { primaryTherapist, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const { therapists, philosophy, galleryImages, brand } = siteConfig;

export const metadata = pageMetadata({
  title: "About Us",
  description: `Meet ${primaryTherapist.name}, ${primaryTherapist.title.toLowerCase()} at ${brand.name}. Learn about our philosophy, qualifications and approach to care.`,
  path: "/about",
});

export default function AboutPage() {
  const single = therapists.length === 1;

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase mb-2">
            About {brand.shortName}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4">
            {single ? "Meet Your Physiotherapist" : "Meet Our Team"}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
            Real care from real people. Here&apos;s a little about who you&apos;ll be working with.
          </p>
        </div>
      </section>

      {therapists.map((therapist, index) => (
        <section key={therapist.name} className="py-16 md:py-20 bg-[var(--color-bg)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Photo */}
              <div className="lg:col-span-2">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative lg:sticky lg:top-28">
                  <Image
                    src={therapist.photo}
                    alt={therapist.photoAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-1">
                    Hi, I&apos;m {therapist.firstName}
                  </h2>
                  <p className="text-sm font-medium text-[var(--color-primary)] mb-4">
                    {therapist.name} · {therapist.title}
                  </p>
                  <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                    {therapist.bio.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {therapist.qualifications.length > 0 && (
                  <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                    <h3 className="font-semibold text-[var(--color-secondary)] mb-4">Qualifications & Memberships</h3>
                    <ul className="space-y-2.5">
                      {therapist.qualifications.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                          <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {index === 0 && philosophy.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">Our Philosophy</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {philosophy.map((item) => (
                        <div key={item.title} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
                          <h4 className="font-semibold text-[var(--color-secondary)] mb-1">{item.title}</h4>
                          <p className="text-sm text-[var(--color-text-muted)]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
                >
                  Book with {therapist.firstName}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {galleryImages.length > 0 && (
        <section className="pb-16 bg-[var(--color-bg)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((img) => (
                <div key={img.src} className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-md">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

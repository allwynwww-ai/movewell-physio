import Link from "next/link";
import { notFound } from "next/navigation";
import TeamMemberCard from "@/components/TeamMemberCard";
import { getTeam, isFeatureOn } from "@/lib/features";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Team",
  description: `Meet the physiotherapists at ${siteConfig.brand.name} — qualifications, specialties and languages spoken.`,
  path: "/team",
});

export default function TeamPage() {
  const team = getTeam();
  if (!isFeatureOn("therapists") || team.length === 0) notFound();
  const single = team.length === 1;

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 md:pt-12 md:pb-10">
          <p className="section-label mb-3">Our team</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">
            {single ? "Meet your physiotherapist" : siteConfig.team.heading}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">{siteConfig.team.intro}</p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-testid="team-grid"
            className={`grid gap-6 ${single ? "max-w-xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {team.map((m) => (
              <TeamMemberCard key={m.slug} member={m} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-[var(--color-text-muted)] mb-5">Not sure who to see? We&apos;ll match you with the right physiotherapist.</p>
            <Link href="/book" className="premium-btn premium-btn-primary px-7 py-3.5 text-[15px]">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

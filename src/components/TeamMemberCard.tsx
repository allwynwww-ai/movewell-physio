import Image from "next/image";
import type { TeamMember } from "@/site.config";

function initials(name: string): string {
  const words = name
    .replace(/\(.*?\)/g, "")
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

export function TeamAvatar({ member, size = "md" }: { member: TeamMember; size?: "md" | "lg" }) {
  const box = size === "lg" ? "w-28 h-28 text-3xl" : "w-20 h-20 text-xl";
  if (member.photo) {
    return (
      <div className={`${box} relative rounded-full overflow-hidden shrink-0 ring-4 ring-[var(--color-light-teal)]`}>
        <Image src={member.photo} alt={member.photoAlt || `Photo of ${member.name}`} fill className="object-cover" sizes="112px" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${member.name} (initials avatar)`}
      data-testid="initials-avatar"
      className={`${box} rounded-full shrink-0 flex items-center justify-center font-bold tracking-tight bg-[var(--color-light-teal)] text-[var(--color-primary)] ring-4 ring-[var(--color-light-teal)]`}
    >
      {initials(member.name)}
    </div>
  );
}

/** Profile card used on Home ("compact") and /team ("full"). */
export default function TeamMemberCard({ member, variant = "full" }: { member: TeamMember; variant?: "compact" | "full" }) {
  const full = variant === "full";
  return (
    <article
      id={full ? member.slug : undefined}
      data-testid="team-member"
      className="premium-card p-6 md:p-7 flex flex-col h-full scroll-mt-28"
    >
      <div className="flex items-center gap-4 mb-5">
        <TeamAvatar member={member} size={full ? "lg" : "md"} />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--color-secondary)] tracking-tight break-words">{member.name}</h3>
          <p className="text-sm font-medium text-[var(--color-primary)]">{member.title}</p>
          {member.qualifications && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{member.qualifications}</p>}
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">{member.bio}</p>

      {member.specialties.length > 0 && (
        <div className="mb-4">
          <p className="sr-only">Specialties</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Specialties">
            {(full ? member.specialties : member.specialties.slice(0, 3)).map((s) => (
              <li key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(member.yearsExperience || (member.languages && member.languages.length > 0)) && (
        <dl className="mt-auto pt-4 border-t border-[var(--color-border-light)] grid grid-cols-2 gap-3 text-xs">
          {member.yearsExperience ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Experience</dt>
              <dd className="font-semibold text-[var(--color-secondary)]">
                {member.yearsExperience}+ {member.yearsExperience === 1 ? "year" : "years"}
              </dd>
            </div>
          ) : null}
          {member.languages && member.languages.length > 0 ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Languages</dt>
              <dd className="font-semibold text-[var(--color-secondary)]">{member.languages.join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      )}
    </article>
  );
}

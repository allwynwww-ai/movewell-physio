import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Shared layout for the Privacy Policy and Terms pages. */
export default function LegalPage({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="section-label mb-3">{label}</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">{title}</h1>
          <div className="text-lg text-[var(--color-text-muted)] leading-relaxed">{intro}</div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Last updated: {formatDate(siteConfig.legal.lastUpdated)}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-[var(--color-bg)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            role="note"
            className="mb-8 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200"
          >
            <strong>Template notice:</strong> this page is a starting template and is not legal advice. The clinic
            must review it with a qualified lawyer and adapt it to its actual practices before relying on it.
          </div>
          <div className="legal-prose space-y-8 text-[var(--color-text)] leading-relaxed">{children}</div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2 id={`${id}-title`} className="text-xl md:text-2xl font-bold text-[var(--color-secondary)] mb-3 tracking-tight">
        {title}
      </h2>
      <div className="space-y-3 text-[var(--color-text-muted)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[var(--color-text)]">
        {children}
      </div>
    </section>
  );
}

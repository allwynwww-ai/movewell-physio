import Link from "next/link";
import { notFound } from "next/navigation";
import BodyAreaIcon from "@/components/exercises/BodyAreaIcon";
import ExerciseDisclaimer from "@/components/exercises/ExerciseDisclaimer";
import { exercises, getExercise } from "@/content/exercises";
import { isFeatureOn } from "@/lib/features";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Only the slugs in src/content/exercises.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  if (!isFeatureOn("exerciseLibrary")) return [];
  return exercises.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const ex = getExercise(slug);
  if (!ex || !isFeatureOn("exerciseLibrary")) return {};
  return pageMetadata({
    title: `${ex.title} – ${ex.bodyArea} exercise`,
    description: ex.summary,
    path: `/exercises/${ex.slug}`,
  });
}

export default async function ExercisePage({ params }: Props) {
  const { slug } = await params;
  const ex = getExercise(slug);
  if (!ex || !isFeatureOn("exerciseLibrary")) notFound();

  const dosage = [
    { label: "Sets", value: ex.dosage.sets },
    { label: "Reps", value: ex.dosage.reps },
    { label: "Hold", value: ex.dosage.hold },
    { label: "How often", value: ex.dosage.frequency },
  ].filter((d) => d.value);
  const related = exercises.filter((e) => e.slug !== ex.slug).slice(0, 3);

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-10 md:pb-10">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-text-muted)] mb-5">
            <Link href="/exercises" className="hover:text-[var(--color-primary)]">
              ← Exercise library
            </Link>
          </nav>
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center">
              <BodyAreaIcon area={ex.bodyArea} className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  {ex.bodyArea}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-soft-coral)] text-[var(--color-cta)]">
                  {ex.difficulty}
                </span>
              </div>
              <h1 className="heading-display text-3xl md:text-4xl mb-3 break-words">{ex.title}</h1>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">{ex.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ExerciseDisclaimer />

          {dosage.length > 0 && (
            <dl data-testid="exercise-dosage" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dosage.map((d) => (
                <div key={d.label} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-light)] px-4 py-3">
                  <dt className="text-xs font-medium text-[var(--color-text-muted)]">{d.label}</dt>
                  <dd className="text-sm font-semibold text-[var(--color-secondary)] mt-0.5">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-light)] p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">How to do it</h2>
            {ex.equipment && <p className="text-sm text-[var(--color-text-muted)] mb-5">You&apos;ll need: {ex.equipment}</p>}
            <ol className="space-y-4">
              {ex.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--color-primary)] text-white dark:text-[#0B1220] text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {ex.tips.length > 0 && (
            <div className="rounded-2xl bg-[var(--color-light-teal)] p-6 md:p-8">
              <h2 className="text-xl font-semibold text-[var(--color-secondary)] mb-4">Tips</h2>
              <ul className="space-y-2.5">
                {ex.tips.map((tip) => (
                  <li key={tip} className="flex gap-2.5 text-[var(--color-text)]">
                    <svg className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-[var(--color-footer-bg)] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold">Want a plan made for you?</h2>
              <p className="text-white/70 text-sm mt-1">A physiotherapist can check your movement and tailor exercises to your goals.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/book" className="premium-btn premium-btn-primary px-6 py-3 text-sm">
                Book Appointment
              </Link>
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.ask)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn px-6 py-3 text-sm bg-[#25D366] hover:bg-[#20BD5A] text-white"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-secondary)] mb-4">More exercises</h2>
              <ul className="grid sm:grid-cols-3 gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/exercises/${r.slug}`} className="premium-card flex items-center gap-3 p-4 h-full">
                      <span className="w-10 h-10 shrink-0 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center">
                        <BodyAreaIcon area={r.bodyArea} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[var(--color-secondary)]">{r.title}</span>
                        <span className="block text-xs text-[var(--color-text-muted)]">{r.bodyArea}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

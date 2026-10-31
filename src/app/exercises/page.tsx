import { notFound } from "next/navigation";
import ExerciseBrowser from "@/components/exercises/ExerciseBrowser";
import ExerciseDisclaimer from "@/components/exercises/ExerciseDisclaimer";
import { BODY_AREAS, exercises } from "@/content/exercises";
import { isFeatureOn } from "@/lib/features";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Exercise Library",
  description: `Simple, general mobility exercises for the knee, back, neck, shoulder and ankle from ${siteConfig.brand.name}. Step-by-step guides with safety tips.`,
  path: "/exercises",
});

export default function ExercisesPage() {
  if (!isFeatureOn("exerciseLibrary")) notFound();

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 md:pt-12 md:pb-10">
          <p className="section-label mb-3">Exercise library</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">Simple exercises to keep you moving</h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Gentle, general exercises you can do at home. Your physiotherapist can tailor them to you.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExerciseDisclaimer className="mb-8" />
          <ExerciseBrowser exercises={exercises} areas={BODY_AREAS} />
        </div>
      </section>
    </>
  );
}

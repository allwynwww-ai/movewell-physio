import { EXERCISE_DISCLAIMER } from "@/content/exercises";

export default function ExerciseDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      data-testid="exercise-disclaimer"
      className={`flex gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:border-amber-300/25 dark:text-amber-100 px-5 py-4 text-sm leading-relaxed ${className}`}
    >
      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </svg>
      <p>
        <strong className="font-semibold">Safety first: </strong>
        {EXERCISE_DISCLAIMER}
      </p>
    </div>
  );
}

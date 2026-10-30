import { siteConfig } from "@/site.config";

type SampleNoticeProps = {
  kind?: "reviews" | "stats";
  className?: string;
};

/**
 * Small, honest label shown next to sample testimonials / figures.
 * Controlled by `siteConfig.showSampleNotice`.
 */
export default function SampleNotice({ kind = "reviews", className = "" }: SampleNoticeProps) {
  if (!siteConfig.showSampleNotice) return null;
  const text =
    kind === "reviews"
      ? "Sample reviews – replace with your clinic's real reviews"
      : "Sample figures – replace with your clinic's real numbers";
  return (
    <p
      role="note"
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-dashed border-[var(--color-border)] rounded-full px-3 py-1 ${className}`}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {text}
    </p>
  );
}

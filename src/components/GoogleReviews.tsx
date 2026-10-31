import { getGoogleReviews } from "@/lib/features";

function Stars({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className={`relative inline-block ${className}`}>
            <svg viewBox="0 0 20 20" className="absolute inset-0 w-full h-full text-[var(--color-border)]" fill="currentColor">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" className={`${className} text-amber-400`} fill="currentColor">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

const fmtCount = (n: number) => new Intl.NumberFormat("en-IN").format(n);

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-8 8M10 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-4" />
  </svg>
);

/**
 * Home page section: "Rated 4.8 on Google · 120 reviews — See our reviews on Google".
 * Renders nothing when the feature is off or the rating data is incomplete.
 */
export function GoogleReviewsSection() {
  const g = getGoogleReviews();
  if (g.mode === "none") return null;

  if (g.mode === "link") {
    return (
      <section data-testid="google-reviews" data-mode="link" className="py-8 bg-[var(--color-bg)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href={g.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Find us on Google
            <ExternalIcon />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="google-reviews" data-mode="badge" aria-label="Google rating" className="py-10 md:py-12 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-light)] rounded-[1.25rem] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 px-6 py-6 md:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
            <p className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] tracking-tight leading-none">
              {g.rating.toFixed(1)}
            </p>
            <div>
              <Stars rating={g.rating} className="w-5 h-5" />
              <p className="mt-1.5 text-sm md:text-base font-semibold text-[var(--color-secondary)]">
                Rated {g.rating.toFixed(1)} on Google
                <span className="text-[var(--color-text-muted)] font-medium"> · {fmtCount(g.reviewCount)} reviews</span>
              </p>
              {g.isSample && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Sample rating – replace with your clinic&apos;s Google rating</p>
              )}
            </div>
          </div>
          <a
            href={g.url}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-btn premium-btn-secondary px-6 py-3 text-sm shrink-0"
          >
            See our reviews on Google
            <ExternalIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Compact one-line badge for Contact / footer. `tone="dark"` = on the dark footer. */
export function GoogleReviewsBadge({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const g = getGoogleReviews();
  if (g.mode === "none") return null;
  const linkCls =
    tone === "dark"
      ? "text-white/70 hover:text-white"
      : "text-[var(--color-text)] hover:text-[var(--color-primary)]";

  if (g.mode === "link") {
    return (
      <a data-testid="google-reviews-badge" href={g.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-medium ${linkCls} ${className}`}>
        Find us on Google
        <ExternalIcon />
      </a>
    );
  }
  return (
    <a
      data-testid="google-reviews-badge"
      href={g.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Rated ${g.rating.toFixed(1)} out of 5 on Google from ${fmtCount(g.reviewCount)} reviews – see our reviews on Google`}
      className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium ${linkCls} ${className}`}
    >
      <Stars rating={g.rating} className="w-3.5 h-3.5" />
      <span>
        {g.rating.toFixed(1)} on Google · {fmtCount(g.reviewCount)} reviews
        {g.isSample && <span className="opacity-60"> (sample)</span>}
      </span>
    </a>
  );
}

import { getHoursRows } from "@/lib/site";

type OpeningHoursProps = {
  className?: string;
  /** Visual tone: "default" for light cards, "inverse" for dark panels */
  tone?: "default" | "inverse";
};

/** Opening hours from `siteConfig.openingHours` (single source of truth). */
export default function OpeningHours({ className = "", tone = "default" }: OpeningHoursProps) {
  const rows = getHoursRows();
  const muted = tone === "inverse" ? "text-white/50" : "text-[var(--color-text-muted)]";
  const strong = tone === "inverse" ? "text-white/85" : "text-[var(--color-text)]";
  return (
    <dl className={`space-y-1 text-sm ${className}`}>
      {rows.map((row) => (
        <div key={row.days} className="flex justify-between gap-4">
          <dt className={muted}>{row.days}</dt>
          <dd className={`${row.closed ? muted : strong} font-medium text-right`}>{row.hours}</dd>
        </div>
      ))}
    </dl>
  );
}

import type { BodyArea } from "@/content/exercises";

/** Simple line-art placeholder illustrations (original SVG, no third-party images). */
const paths: Record<BodyArea, React.ReactNode> = {
  Knee: (
    <>
      <path d="M9 3v7l2 3-1 8M15 3v6l-1 4 2 8" />
      <circle cx="12.5" cy="11.5" r="2" />
    </>
  ),
  Back: (
    <>
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6c-1.5 3-1.5 6 0 9s1.5 4 0 6M9 9h6M9.5 13h5" />
    </>
  ),
  Neck: (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M10.5 9v3M13.5 9v3M6 20c0-4 2.5-8 6-8s6 4 6 8" />
    </>
  ),
  Shoulder: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M5 13c0-3 3-5 7-5s7 2 7 5M5 13v7M19 13l2 5" />
    </>
  ),
  Ankle: (
    <>
      <path d="M10 3v11c0 2-1 3-3 4h11c1 0 2-1 2-2 0-1-1-2-3-2h-3V3" />
      <circle cx="11.5" cy="14" r="1.2" />
    </>
  ),
  Hip: (
    <>
      <path d="M6 6c0 4 2 6 6 6s6-2 6-6M8 12l-2 9M16 12l2 9" />
      <circle cx="12" cy="9" r="1.5" />
    </>
  ),
};

export default function BodyAreaIcon({ area, className = "w-6 h-6" }: { area: BodyArea; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[area]}
    </svg>
  );
}

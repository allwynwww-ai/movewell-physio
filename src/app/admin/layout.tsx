import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[var(--color-bg)] min-h-[70vh]">{children}</div>;
}

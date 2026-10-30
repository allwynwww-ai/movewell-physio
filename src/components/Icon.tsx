import type { IconName } from "@/site.config";

const paths: Record<IconName, React.ReactNode> = {
  spine: (
    <>
      <path d="M12 3c-1 2-2 3.5-2 6s1 4 2 6c1-2 2-3.5 2-6s-1-4-2-6z" />
      <path d="M10 9h4M10 12h4M11 15h2M12 15v5" />
    </>
  ),
  sports: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4l-3 6M12 11l3 6M9 13h6M8 21l2-4M16 21l-2-4" />
    </>
  ),
  surgery: (
    <>
      <path d="M8 14c0-2 1.5-4 4-5.5C14.5 10 16 12 16 14a4 4 0 01-8 0z" />
      <path d="M12 8.5V6M10 7h4M7 18h10M9 21h6" />
    </>
  ),
  wellness: (
    <>
      <path d="M12 3c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z" />
      <path d="M9 13c.5 1 1.5 2 3 2s2.5-1 3-2" />
    </>
  ),
  pelvic: (
    <>
      <path d="M12 21c-4-3.5-7-6.5-7-10a7 7 0 1114 0c0 3.5-3 6.5-7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  balance: (
    <>
      <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10l1.4-1.4" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  hands: (
    <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  ),
};

export default function Icon({ name, className = "w-7 h-7" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

import Image from "next/image";
import { siteConfig } from "@/site.config";

type BrandLogoProps = {
  variant?: "header" | "footer";
};

/** Logo lock-up driven by `siteConfig.brand`. Uses `brand.logo` if set, otherwise an icon mark. */
export default function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const { brand } = siteConfig;
  const isFooter = variant === "footer";

  return (
    <span className="flex items-center gap-2.5 min-w-0">
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt=""
          width={40}
          height={40}
          className={`${isFooter ? "w-9 h-9" : "w-10 h-10"} rounded-xl object-contain shrink-0`}
        />
      ) : (
        <span
          className={`${
            isFooter ? "w-9 h-9" : "w-10 h-10 shadow-sm group-hover:shadow-md transition-shadow"
          } shrink-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z" />
            <circle cx="12" cy="10" r="2.5" fill="currentColor" />
          </svg>
        </span>
      )}
      <span className="flex flex-col min-w-0">
        <span
          className={
            isFooter
              ? "text-base font-bold block leading-tight tracking-tight truncate"
              : "text-[1.05rem] font-bold text-[var(--color-secondary)] leading-none tracking-tight truncate"
          }
        >
          {brand.shortName}
        </span>
        {brand.logoSubtitle && (
          <span
            className={
              isFooter
                ? "text-[9px] uppercase tracking-[0.12em] text-[var(--color-primary-light)] font-semibold truncate"
                : "text-[9px] uppercase tracking-[0.14em] text-[var(--color-primary)] font-semibold mt-0.5 truncate"
            }
          >
            {brand.logoSubtitle}
          </span>
        )}
      </span>
      <span className="sr-only">{brand.name}</span>
    </span>
  );
}

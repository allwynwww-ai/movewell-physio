import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  addressLines,
  CLINIC_EMAIL,
  CLINIC_PHONE_DISPLAY,
  getHoursRows,
  IS_DEMO_NUMBER,
  mailtoLink,
  siteConfig,
  telLink,
  whatsappLink,
  WHATSAPP_MESSAGES,
} from "@/lib/site";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  googleBusiness: "Google",
};

export default function Footer() {
  const socials = Object.entries(siteConfig.social).filter(([, url]) => Boolean(url));
  const hours = getHoursRows();

  return (
    <footer className="text-white" style={{ background: "var(--color-footer-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="md:col-span-1">
            <div className="mb-5">
              <BrandLogo variant="footer" />
            </div>
            <p className="text-sm text-white/55 leading-relaxed">{siteConfig.brand.tagline}</p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-3 mt-5">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-white border border-white/15 rounded-full px-3 py-1 transition-colors"
                    >
                      {socialLabels[key] ?? key}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/book", label: "Book Appointment" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Services</h3>
            <ul className="space-y-2.5">
              {siteConfig.services.map((item) => (
                <li key={item.id}>
                  <Link href={`/services#${item.id}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <address className="not-italic">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li>
                <a href={whatsappLink(WHATSAPP_MESSAGES.ask)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={telLink} className="hover:text-white transition-colors">
                  {CLINIC_PHONE_DISPLAY}
                </a>
                {IS_DEMO_NUMBER && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-white/35">(demo number)</span>}
              </li>
              <li className="break-all">
                <a href={mailtoLink} className="hover:text-white transition-colors">
                  {CLINIC_EMAIL}
                </a>
              </li>
              <li>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-1.5">Opening hours</span>
                <dl className="space-y-0.5">
                  {hours.map((row) => (
                    <div key={row.days} className="flex justify-between gap-3">
                      <dt>{row.days}</dt>
                      <dd className={row.closed ? "text-white/40" : ""}>{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35 text-center sm:text-left">
            © {new Date().getFullYear()} {siteConfig.brand.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/35">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { CLINIC_EMAIL, CLINIC_PHONE_DISPLAY, CLINIC_PHONE_TEL, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: "var(--color-footer-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z" />
                  <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span className="text-base font-bold block leading-tight tracking-tight">MoveWell</span>
                <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-primary-light)] font-semibold">Physiotherapy</span>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Helping you move better, feel better and live better with personalised, evidence-based care.
            </p>
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
              {[
                { href: "/services#back-neck-pain", label: "Back & Neck Pain" },
                { href: "/services#sports-injury", label: "Sports Injury Rehab" },
                { href: "/services#post-surgical", label: "Post-Surgical Rehab" },
                { href: "/services#pelvic-floor", label: "Pelvic Floor Therapy" },
                { href: "/services#vestibular-balance", label: "Vestibular & Balance" },
                { href: "/services#manual-therapy", label: "Manual Therapy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Near Jupiter Hospital<br />Eastern Express Hwy, Thane 400601</li>
              <li>
                <a href={whatsappLink(WHATSAPP_MESSAGES.ask)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp us
                </a>
              </li>
              <li><a href={`tel:${CLINIC_PHONE_TEL}`} className="hover:text-white transition-colors">{CLINIC_PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${CLINIC_EMAIL}`} className="hover:text-white transition-colors">{CLINIC_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} MoveWell Physiotherapy. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/35">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

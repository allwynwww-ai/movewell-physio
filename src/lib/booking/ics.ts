import { siteConfig } from "@/site.config";
import { addressOneLine } from "@/lib/site";

function stamp(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** iCalendar (.ics) file for one appointment. Times are UTC, so every calendar app shows the right local time. */
export function buildIcs(a: {
  id: string;
  ref: string;
  serviceName: string;
  startsAt: Date;
  endsAt: Date;
  manageUrl?: string;
  cancelled?: boolean;
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${esc(siteConfig.brand.name)}//Online booking//EN`,
    "CALSCALE:GREGORIAN",
    `METHOD:${a.cancelled ? "CANCEL" : "PUBLISH"}`,
    "BEGIN:VEVENT",
    `UID:${a.id}@online-booking`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(a.startsAt)}`,
    `DTEND:${stamp(a.endsAt)}`,
    `SUMMARY:${esc(`${a.serviceName} – ${siteConfig.brand.name}`)}`,
    `LOCATION:${esc(addressOneLine)}`,
    `DESCRIPTION:${esc(
      `Booking ref ${a.ref}. Phone ${siteConfig.contact.phoneDisplay}.` +
        (a.manageUrl ? `\nCancel or reschedule: ${a.manageUrl}` : ""),
    )}`,
    `STATUS:${a.cancelled ? "CANCELLED" : "CONFIRMED"}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Physiotherapy appointment",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

/**
 * Booking emails via Resend (https://resend.com) using plain fetch — no SDK.
 * If RESEND_API_KEY is not set, emails are skipped and logged; booking still works.
 */
import { siteConfig } from "@/site.config";
import { addressOneLine, CLINIC_PHONE_DISPLAY } from "@/lib/site";
import type { Appointment } from "./appointments";
import { clinicNotifyEmail } from "./env";
import { buildIcs } from "./ics";
import { booking, formatInstant } from "./time";

type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  ics?: string;
};

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function send(mail: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[booking] RESEND_API_KEY not set – skipped email "${mail.subject}"`);
    return;
  }
  if (/\.example$/i.test(mail.to)) {
    console.info(`[booking] demo address ${mail.to} – skipped email "${mail.subject}"`);
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || `${siteConfig.brand.name} <onboarding@resend.dev>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        ...(mail.ics
          ? {
              attachments: [
                { filename: "appointment.ics", content: Buffer.from(mail.ics).toString("base64"), content_type: "text/calendar" },
              ],
            }
          : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error(`[booking] Resend error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (err) {
    console.error("[booking] email failed:", err instanceof Error ? err.message : err);
  }
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e2e8f0;border-radius:16px">
<tr><td style="padding:24px 28px;border-bottom:1px solid #f1f5f9"><strong style="color:#0f766e;font-size:16px">${esc(siteConfig.brand.name)}</strong></td></tr>
<tr><td style="padding:28px"><h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>${body}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #f1f5f9;font-size:12px;color:#64748b">${esc(addressOneLine)} · ${esc(CLINIC_PHONE_DISPLAY)}</td></tr>
</table></td></tr></table></body></html>`;
}

function details(a: Appointment) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:14px">${k}</td><td style="padding:6px 0;font-size:14px;font-weight:600">${esc(v)}</td></tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
${row("When", formatInstant(a.startsAt))}${row("Service", a.serviceName)}${row("Reference", a.ref)}</table>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:20px 0"><a href="${esc(href)}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px">${esc(label)}</a></p>`;

const clinicTo = () => clinicNotifyEmail(booking.clinicNotifyEmail || siteConfig.contact.email);

export async function sendBookingEmails(a: Appointment, links: { manageUrl: string; adminUrl: string }) {
  const pending = a.status === "pending";
  const ics = buildIcs({ ...a, manageUrl: links.manageUrl });
  await Promise.all([
    send({
      to: a.email,
      subject: `${pending ? "Booking received" : "Appointment confirmed"} – ${formatInstant(a.startsAt)}`,
      replyTo: siteConfig.contact.email,
      ics,
      html: layout(
        pending ? "We've received your booking" : "Your appointment is confirmed",
        `<p style="font-size:15px;line-height:1.6">Hi ${esc(a.name)}, ${
          pending ? "the clinic will confirm your appointment shortly." : "thanks for booking. See you soon!"
        }</p>${details(a)}
<p style="font-size:14px;line-height:1.6;color:#475569">Need to change it? You can cancel or reschedule online up to ${
          booking.cancellationCutoffHours
        } hours before your appointment.</p>${button(links.manageUrl, "Manage my booking")}`,
      ),
    }),
    send({
      to: clinicTo(),
      subject: `New booking: ${a.name} – ${formatInstant(a.startsAt)}`,
      replyTo: a.email,
      html: layout(
        "New online booking",
        `${details(a)}<p style="font-size:14px;line-height:1.6">Patient: <strong>${esc(a.name)}</strong><br>Phone: ${esc(
          a.phone,
        )}<br>Email: ${esc(a.email)}${a.note ? `<br>Note: ${esc(a.note)}` : ""}</p>${button(links.adminUrl, "Open admin")}`,
      ),
    }),
  ]);
}

export async function sendChangeEmails(
  kind: "cancelled" | "rescheduled",
  a: Appointment,
  by: "patient" | "clinic",
  links: { manageUrl: string; adminUrl: string; previous?: Date },
) {
  const cancelled = kind === "cancelled";
  const title = cancelled ? "Appointment cancelled" : "Appointment rescheduled";
  const prev = links.previous ? `<p style="font-size:14px;color:#64748b">Previously: ${esc(formatInstant(links.previous))}</p>` : "";
  await Promise.all([
    send({
      to: a.email,
      subject: `${title} – ${formatInstant(a.startsAt)}`,
      replyTo: siteConfig.contact.email,
      ics: buildIcs({ ...a, manageUrl: links.manageUrl, cancelled }),
      html: layout(
        title,
        `<p style="font-size:15px;line-height:1.6">Hi ${esc(a.name)}, ${
          cancelled
            ? by === "clinic"
              ? "the clinic has cancelled this appointment. Please get in touch to rebook."
              : "your appointment has been cancelled."
            : "your appointment has a new time."
        }</p>${details(a)}${prev}${cancelled ? button(links.manageUrl.replace(/\/book\/manage.*$/, "/book"), "Book again") : button(links.manageUrl, "Manage my booking")}`,
      ),
    }),
    by === "patient"
      ? send({
          to: clinicTo(),
          subject: `${title} by patient: ${a.name} – ${formatInstant(a.startsAt)}`,
          html: layout(`${title} by patient`, `${details(a)}${prev}<p style="font-size:14px">Patient: ${esc(a.name)} · ${esc(a.phone)}</p>${button(links.adminUrl, "Open admin")}`),
        })
      : Promise.resolve(),
  ]);
}

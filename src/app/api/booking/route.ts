import { after } from "next/server";
import { siteConfig } from "@/site.config";
import { BookingError, createAppointment } from "@/lib/booking/appointments";
import { sendBookingEmails } from "@/lib/booking/email";
import { guard, json, manageUrl, originOf } from "@/lib/booking/http";
import { clientIp, rateLimit } from "@/lib/booking/rate-limit";
import { dateKeyOf, timeOf } from "@/lib/booking/time";
import { manageToken } from "@/lib/booking/tokens";
import { bookingSchema, fieldErrors } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";

/** Create a booking. Confirms instantly if the slot is still free. */
export async function POST(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  const ip = clientIp(req.headers);
  if (!rateLimit(`book:${ip}`, 5, 10 * 60 * 1000)) {
    return json({ error: "Too many booking attempts. Please wait a few minutes or call the clinic." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: bots fill the hidden "website" field. Pretend nothing happened.
  if (body && typeof body === "object" && (body as { website?: unknown }).website) {
    return json({ error: "Invalid request." }, 400);
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, 422);
  }
  const input = parsed.data;
  const service = siteConfig.services.find((s) => s.id === input.serviceId)!;

  try {
    const appt = await createAppointment({
      serviceId: service.id,
      serviceName: service.name,
      date: input.date,
      time: input.time,
      name: input.name,
      phone: input.phone,
      email: input.email,
      note: input.note,
    });
    const token = manageToken(appt.id);
    const origin = originOf(req.headers, req.url);
    const links = { manageUrl: manageUrl(origin, token), adminUrl: `${origin}/admin` };
    after(() => sendBookingEmails(appt, links));

    return json(
      {
        ok: true,
        booking: {
          ref: appt.ref,
          status: appt.status,
          serviceName: appt.serviceName,
          date: dateKeyOf(appt.startsAt),
          time: timeOf(appt.startsAt),
          name: appt.name,
          email: appt.email,
        },
        token,
        manageUrl: links.manageUrl,
        icsUrl: `/api/booking/ics?token=${encodeURIComponent(token)}`,
      },
      201,
    );
  } catch (err) {
    if (err instanceof BookingError) {
      const status = err.code === "slot-taken" ? 409 : err.code === "limit" ? 429 : 422;
      return json({ error: err.message, code: err.code }, status);
    }
    console.error("[booking] create failed:", err);
    return json({ error: "Something went wrong. Please try again or call the clinic." }, 500);
  }
}

import { after } from "next/server";
import { BookingError, cancelAppointment, rescheduleAppointment } from "@/lib/booking/appointments";
import { sendChangeEmails } from "@/lib/booking/email";
import { guard, json, manageUrl, originOf } from "@/lib/booking/http";
import { clientIp, rateLimit } from "@/lib/booking/rate-limit";
import { dateKeyOf, timeOf } from "@/lib/booking/time";
import { verifyManageToken } from "@/lib/booking/tokens";
import { manageSchema } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";

/** Patient cancel / reschedule via the signed manage link. */
export async function POST(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;

  if (!rateLimit(`manage:${clientIp(req.headers)}`, 20, 10 * 60 * 1000)) {
    return json({ error: "Too many attempts. Please wait a few minutes or call the clinic." }, 429);
  }

  const parsed = manageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Invalid request." }, 400);

  const id = verifyManageToken(parsed.data.token);
  if (!id) return json({ error: "This link is not valid." }, 404);

  const origin = originOf(req.headers, req.url);
  const links = { manageUrl: manageUrl(origin, parsed.data.token), adminUrl: `${origin}/admin` };

  try {
    if (parsed.data.action === "cancel") {
      const a = await cancelAppointment(id, "patient");
      after(() => sendChangeEmails("cancelled", a, "patient", links));
      return json({ ok: true, status: a.status });
    }
    const { before, after: a } = await rescheduleAppointment(id, parsed.data.date, parsed.data.time, "patient");
    after(() => sendChangeEmails("rescheduled", a, "patient", { ...links, previous: before.startsAt }));
    return json({ ok: true, status: a.status, date: dateKeyOf(a.startsAt), time: timeOf(a.startsAt) });
  } catch (err) {
    if (err instanceof BookingError) {
      const status = err.code === "slot-taken" ? 409 : err.code === "not-found" ? 404 : 422;
      return json({ error: err.message, code: err.code }, status);
    }
    console.error("[booking] manage failed:", err);
    return json({ error: "Something went wrong. Please try again or call the clinic." }, 500);
  }
}

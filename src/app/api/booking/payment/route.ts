import { BookingError, submitPaymentRef } from "@/lib/booking/appointments";
import { guard, json } from "@/lib/booking/http";
import { isPaymentsOn, paymentView } from "@/lib/booking/payments";
import { clientIp, rateLimit } from "@/lib/booking/rate-limit";
import { verifyManageToken } from "@/lib/booking/tokens";
import { fieldErrors, paymentRefSchema } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";

/** Premium payments: the patient submits their UPI / bank transaction reference (via the signed manage token). */
export async function POST(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  if (!isPaymentsOn()) return json({ error: "Payments are not enabled." }, 404);

  if (!rateLimit(`payref:${clientIp(req.headers)}`, 10, 10 * 60 * 1000)) {
    return json({ error: "Too many attempts. Please wait a few minutes or call the clinic." }, 429);
  }

  const parsed = paymentRefSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return json({ error: fields.reference || "Invalid request.", fields }, fields.reference ? 422 : 400);
  }
  const id = verifyManageToken(parsed.data.token);
  if (!id) return json({ error: "This link is not valid." }, 404);

  try {
    const a = await submitPaymentRef(id, parsed.data.reference, parsed.data.method);
    return json({ ok: true, payment: await paymentView(a) });
  } catch (err) {
    if (err instanceof BookingError) {
      return json({ error: err.message, code: err.code }, err.code === "not-found" ? 404 : 422);
    }
    console.error("[booking] payment reference failed:", err);
    return json({ error: "Something went wrong. Please try again or call the clinic." }, 500);
  }
}

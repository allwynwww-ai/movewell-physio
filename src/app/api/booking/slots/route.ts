import { getAvailability } from "@/lib/booking/appointments";
import { guard, json } from "@/lib/booking/http";
import { booking, TZ, TZ_LABEL } from "@/lib/booking/time";

export const dynamic = "force-dynamic";

/** Public: free slots only (no patient data). */
export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;
  try {
    const days = await getAvailability();
    return json({ timezone: TZ, timezoneLabel: TZ_LABEL, slotMinutes: booking.slotMinutes, days });
  } catch (err) {
    console.error("[booking] slots failed:", err);
    return json({ error: "Online booking is not available right now." }, 503);
  }
}

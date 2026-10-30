import { getAppointment } from "@/lib/booking/appointments";
import { guard, json, manageUrl, originOf } from "@/lib/booking/http";
import { buildIcs } from "@/lib/booking/ics";
import { verifyManageToken } from "@/lib/booking/tokens";

export const dynamic = "force-dynamic";

/** "Add to calendar" download for the patient's own booking (signed token required). */
export async function GET(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  const token = new URL(req.url).searchParams.get("token");
  const id = verifyManageToken(token);
  if (!id || !token) return json({ error: "This link is not valid." }, 404);
  const a = await getAppointment(id);
  if (!a) return json({ error: "Appointment not found." }, 404);
  const ics = buildIcs({ ...a, manageUrl: manageUrl(originOf(req.headers, req.url), token), cancelled: a.status === "cancelled" });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointment-${a.ref}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}

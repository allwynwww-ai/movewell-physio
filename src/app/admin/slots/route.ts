import { getAvailability } from "@/lib/booking/appointments";
import { isAdmin } from "@/lib/booking/admin-auth";
import { json } from "@/lib/booking/http";

export const dynamic = "force-dynamic";

/** Free slots for the clinic's reschedule picker (ignores the patient minimum-notice rule). */
export async function GET() {
  if (!(await isAdmin())) return json({ error: "Not signed in." }, 401);
  try {
    return json({ days: await getAvailability({ forAdmin: true }) });
  } catch (err) {
    console.error("[admin] slots failed:", err);
    return json({ error: "Could not load free slots." }, 500);
  }
}

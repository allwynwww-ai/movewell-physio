"use server";

import { after } from "next/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  blockDay,
  BookingError,
  cancelAppointment,
  rescheduleAppointment,
  setStatus,
  unblockDay,
} from "@/lib/booking/appointments";
import { ADMIN_COOKIE, ADMIN_SESSION_TTL, checkAdminPassword, isAdmin } from "@/lib/booking/admin-auth";
import { sendChangeEmails } from "@/lib/booking/email";
import { adminConfigured } from "@/lib/booking/env";
import { manageUrl, originOf } from "@/lib/booking/http";
import { clientIp, rateLimit } from "@/lib/booking/rate-limit";
import { adminSessionValue, manageToken } from "@/lib/booking/tokens";

/** Only ever redirect back inside /admin. */
function backTo(formData: FormData, params: Record<string, string>): never {
  const raw = String(formData.get("back") ?? "/admin");
  const safe = raw.startsWith("/admin") && !raw.startsWith("//") ? raw : "/admin";
  const url = new URL(safe, "http://local");
  url.searchParams.delete("msg");
  url.searchParams.delete("error");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  redirect(`${url.pathname}${url.search}${url.hash}`);
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin?error=Please+sign+in+again.");
}

function errorMessage(err: unknown): string {
  if (err instanceof BookingError) return err.message;
  console.error("[admin] action failed:", err);
  return "Something went wrong. Please try again.";
}

async function links(id: string) {
  const origin = originOf(await headers());
  return { manageUrl: manageUrl(origin, manageToken(id)), adminUrl: `${origin}/admin` };
}

export async function loginAction(formData: FormData) {
  if (!adminConfigured()) redirect("/admin");
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000)) {
    redirect("/admin?error=Too+many+attempts.+Try+again+in+15+minutes.");
  }
  const password = String(formData.get("password") ?? "");
  if (!password || password.length > 200 || !checkAdminPassword(password)) {
    redirect("/admin?error=Incorrect+password.");
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminSessionValue(ADMIN_SESSION_TTL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_SESSION_TTL,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin?msg=Signed+out.");
}

const STATUS_MSG = {
  confirmed: "Appointment confirmed.",
  completed: "Marked as done.",
  no_show: "Marked as no-show.",
  pending: "Moved back to pending.",
} as const;

export async function setStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as keyof typeof STATUS_MSG;
  if (!(status in STATUS_MSG)) backTo(formData, { error: "Unknown status." });
  let message: string;
  try {
    await setStatus(id, status);
    message = STATUS_MSG[status];
  } catch (err) {
    backTo(formData, { error: errorMessage(err) });
  }
  backTo(formData, { msg: message });
}

export async function cancelAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  try {
    const a = await cancelAppointment(id, "clinic");
    const l = await links(id);
    if (formData.get("notify") !== "no") after(() => sendChangeEmails("cancelled", a, "clinic", l));
  } catch (err) {
    backTo(formData, { error: errorMessage(err) });
  }
  backTo(formData, { msg: "Appointment cancelled." });
}

export async function rescheduleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  try {
    const { before, after: a } = await rescheduleAppointment(id, date, time, "clinic");
    const l = await links(id);
    after(() => sendChangeEmails("rescheduled", a, "clinic", { ...l, previous: before.startsAt }));
  } catch (err) {
    backTo(formData, { error: errorMessage(err) });
  }
  backTo(formData, { msg: "Appointment rescheduled." });
}

export async function blockDayAction(formData: FormData) {
  await requireAdmin();
  const day = String(formData.get("day") ?? "");
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 80) || "Clinic closed";
  try {
    await blockDay(day, reason);
  } catch (err) {
    backTo(formData, { error: errorMessage(err) });
  }
  backTo(formData, { msg: "Day blocked. Patients can no longer book it online." });
}

export async function unblockDayAction(formData: FormData) {
  await requireAdmin();
  await unblockDay(String(formData.get("day") ?? ""));
  backTo(formData, { msg: "Day re-opened for online booking." });
}

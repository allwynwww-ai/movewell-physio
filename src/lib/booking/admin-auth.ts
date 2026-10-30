import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { adminConfigured } from "./env";
import { safeEqual, verifyAdminSession } from "./tokens";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_SESSION_TTL = 12 * 60 * 60; // 12 hours

const digest = (v: string) => createHash("sha256").update(v).digest("hex");

/** Constant-time password check against ADMIN_PASSWORD (never sent to the browser). */
export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(digest(input), digest(expected));
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

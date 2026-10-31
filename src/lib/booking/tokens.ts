import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { sessionSecret } from "./env";

function sign(purpose: string, value: string): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(`${purpose}:${value}`).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Signed token for a patient's manage link: "<appointment id>.<signature>". */
export function manageToken(appointmentId: string): string {
  return `${appointmentId}.${sign("manage", appointmentId)}`;
}

/** Returns the appointment id if the token is genuine, otherwise null. */
export function verifyManageToken(token: string | null | undefined): string | null {
  if (!token || token.length > 200) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!UUID.test(id)) return null;
  try {
    return safeEqual(sig, sign("manage", id)) ? id : null;
  } catch {
    return null;
  }
}

/**
 * The admin session is bound to the current ADMIN_PASSWORD: changing the
 * password (and redeploying) signs every existing session out.
 */
function passwordTag(): string {
  return createHash("sha256").update(`movewell-admin:${process.env.ADMIN_PASSWORD ?? ""}`).digest("base64url").slice(0, 16);
}

/** Signed admin session value: "<expiry ms>.<signature>". */
export function adminSessionValue(ttlSeconds: number): string {
  const exp = String(Date.now() + ttlSeconds * 1000);
  return `${exp}.${sign("admin", `${exp}:${passwordTag()}`)}`;
}

export function verifyAdminSession(value: string | undefined): boolean {
  if (!value || value.length > 200) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, sign("admin", `${exp}:${passwordTag()}`));
  } catch {
    return false;
  }
}

/**
 * Admin banner messages travel in the redirect URL. They are signed so a link
 * from someone else can't make arbitrary text look like an official notice.
 */
export function noticeSig(text: string): string {
  return sign("notice", text).slice(0, 22);
}

export function verifyNotice(text: string | undefined, sig: string | undefined): string | undefined {
  if (!text || !sig || text.length > 300) return undefined;
  try {
    return safeEqual(sig, noticeSig(text)) ? text : undefined;
  } catch {
    return undefined;
  }
}

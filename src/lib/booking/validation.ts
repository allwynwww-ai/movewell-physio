import { z } from "zod";
import { siteConfig } from "@/site.config";
import { isValidDateKey, isValidTime } from "./time";

const serviceIds = siteConfig.services.map((s) => s.id);

const dateKey = z.string().refine(isValidDateKey, "Invalid date");
const time = z.string().refine(isValidTime, "Invalid time");

/** Strips spaces, dashes and brackets; keeps an optional leading "+". */
export function normalisePhone(v: string): string {
  const trimmed = v.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

export const bookingSchema = z.object({
  serviceId: z.string().refine((v) => serviceIds.includes(v), "Please choose a service."),
  date: dateKey,
  time,
  name: z.string().trim().min(2, "Please enter your full name.").max(80, "Name is too long."),
  phone: z
    .string()
    .transform(normalisePhone)
    .refine((v) => /^\+?\d{10,15}$/.test(v), "Enter a valid phone number (at least 10 digits)."),
  email: z.string().trim().toLowerCase().max(160).pipe(z.email("Enter a valid email address.")),
  note: z.string().trim().max(500, "Please keep the note under 500 characters.").default(""),
  consent: z.literal(true, { error: "Please tick the consent box." }),
  /** Honeypot – must stay empty. */
  website: z.string().max(0).optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const manageSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("cancel"), token: z.string().max(200) }),
  z.object({ action: z.literal("reschedule"), token: z.string().max(200), date: dateKey, time }),
]);

/** First message per field, for showing errors next to inputs. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

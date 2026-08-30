/** Clinic contact — update these when you have the real number */
export const CLINIC_PHONE_DISPLAY = "+91 22 1234 5678";
export const CLINIC_PHONE_TEL = "+912212345678";
/** WhatsApp: country code + number, no + or spaces (same as Call now) */
export const CLINIC_WHATSAPP = "912212345678";
export const CLINIC_EMAIL = "allwyn.www@gmail.com";

export const WHATSAPP_MESSAGES = {
  default:
    "Hi MoveWell, I'd like to book a physiotherapy appointment in Thane.",
  book:
    "Hi MoveWell, I'd like to book a physiotherapy appointment in Thane. Please share the next available slot.",
  ask: "Hi MoveWell, I have a question about physiotherapy at your Thane clinic.",
  followup:
    "Hi MoveWell, I recently requested an appointment and would like a quicker confirmation on WhatsApp.",
} as const;

export const WHATSAPP_PREFILL = WHATSAPP_MESSAGES.default;

export function whatsappLink(message: string = WHATSAPP_PREFILL): string {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

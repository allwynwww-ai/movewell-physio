/** Clinic contact — update these when you have the real number */
export const CLINIC_PHONE_DISPLAY = "+91 22 1234 5678";
export const CLINIC_PHONE_TEL = "+912212345678";
/** WhatsApp: country code + number, no + or spaces (update later) */
export const CLINIC_WHATSAPP = "912212345678";
export const CLINIC_EMAIL = "allwyn.www@gmail.com";

export const WHATSAPP_PREFILL =
  "Hi MoveWell, I'd like to book a physiotherapy appointment in Thane.";

export function whatsappLink(message = WHATSAPP_PREFILL) {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

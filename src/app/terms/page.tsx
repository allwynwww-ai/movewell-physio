import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { CLINIC_EMAIL, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: `Terms of use for the ${siteConfig.brand.name} website, including appointment requests and our medical disclaimer.`,
  path: "/terms",
});

export default function TermsPage() {
  const { legal, brand } = siteConfig;

  return (
    <LegalPage
      label="Legal"
      title="Terms of Use"
      intro={
        <p>
          These terms apply to your use of the {brand.name} website, operated by {legal.entityName}. By using the site you
          agree to them. If you do not agree, please do not use the site.
        </p>
      }
    >
      <LegalSection id="medical-disclaimer" title="1. Medical disclaimer">
        <p>
          The content on this website — including descriptions of services, conditions, exercises and FAQs — is for general
          information only. It is <strong>not medical advice</strong> and is not a substitute for an in-person assessment,
          diagnosis or treatment by a qualified physiotherapist or doctor. Do not ignore or delay professional advice because
          of something you read here.
        </p>
        <p>
          <strong>This website is not for emergencies.</strong> If you have a medical emergency, call <strong>112</strong> or
          go to the nearest hospital.
        </p>
        <p>
          Outcomes of physiotherapy vary from person to person. Any reviews, figures or examples shown on the site do not
          guarantee a particular result.
        </p>
      </LegalSection>

      <LegalSection id="appointments" title="2. Appointment requests">
        <ul>
          <li>
            Submitting the booking form or messaging us on WhatsApp is a <strong>request</strong>, not a confirmed booking.
            An appointment is confirmed only when the clinic contacts you and confirms a date and time.
          </li>
          <li>Please give accurate contact details so we can reach you.</li>
          <li>
            Prices and session durations shown on the site are indicative and may change. The clinic will confirm the fee
            before your appointment.
          </li>
          <li>
            If you need to cancel or reschedule, please let the clinic know as early as possible. The clinic may apply its
            own cancellation policy, which it will tell you about when confirming your appointment.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="privacy" title="3. Your personal data">
        <p>
          How we collect and use your personal data is explained in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <p>You agree not to misuse the website, including by:</p>
        <ul>
          <li>submitting false or misleading details, or someone else&apos;s details without their permission;</li>
          <li>sending spam, malicious code or automated requests; or</li>
          <li>attempting to interfere with the security or operation of the site.</li>
        </ul>
      </LegalSection>

      <LegalSection id="content" title="5. Website content">
        <p>
          The text, design, logos and images on this site belong to the clinic or its licensors and may not be copied or
          reused without permission, except for personal, non-commercial viewing.
        </p>
        <p>
          The site may link to third-party services (such as WhatsApp or Google Maps). We are not responsible for their
          content or practices.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="6. Limitation of liability">
        <p>
          We try to keep the website accurate and available, but it is provided &ldquo;as is&rdquo;. To the extent permitted
          by law, we are not liable for any loss arising from your use of, or reliance on, the website content. Nothing in
          these terms limits any liability that cannot be limited under Indian law, or any duty of care owed to you as a
          patient during treatment.
        </p>
      </LegalSection>

      <LegalSection id="law" title="7. Governing law">
        <p>
          These terms are governed by the laws of India. Courts at {legal.jurisdictionCity} will have jurisdiction over any
          dispute relating to the website.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="8. Changes and contact">
        <p>
          We may update these terms from time to time; the &ldquo;Last updated&rdquo; date shows the latest version.
          Questions? Email <a href={`mailto:${CLINIC_EMAIL}`}>{CLINIC_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

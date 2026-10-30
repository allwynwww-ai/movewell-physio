import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { addressOneLine, CLINIC_EMAIL, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { isOnlineBookingOn } from "@/lib/booking/flags";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.brand.name} collects, uses, stores and protects your personal data under India's Digital Personal Data Protection Act, 2023.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const { legal, brand } = siteConfig;
  const g = legal.grievanceOfficer;
  const onlineBooking = isOnlineBookingOn();

  return (
    <LegalPage
      label="Legal"
      title="Privacy Policy"
      intro={
        <p>
          This notice explains how {legal.entityName} (&ldquo;{brand.shortName}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles
          your personal data when you use this website, in line with India&apos;s Digital Personal Data Protection Act, 2023
          (&ldquo;DPDP Act&rdquo;). Under the DPDP Act we are the &ldquo;Data Fiduciary&rdquo; and you are the &ldquo;Data Principal&rdquo;.
        </p>
      }
    >
      <LegalSection id="data-we-collect" title="1. Personal data we collect">
        <p>We only collect what we need to respond to you:</p>
        <ul>
          <li>
            <strong>Appointment request form:</strong> first and last name, email address, phone number, reason for visit,
            preferred date, any notes you choose to add, and a record that you gave consent (with date and time).
          </li>
          {onlineBooking && (
            <li>
              <strong>Online booking:</strong> when you book a time online we store your name, phone number, email address,
              the service and time you chose, any note you add, and the date and time you gave consent. We use this to hold
              your appointment, send you a confirmation and a private link to cancel or reschedule, and keep the
              clinic&apos;s appointment diary.
            </li>
          )}
          <li>
            <strong>Health information you volunteer:</strong> the reason for visit and notes may reveal information about
            your health. Please share only what is needed to arrange your appointment — clinical details can be discussed at
            your visit.
          </li>
          <li>
            <strong>WhatsApp, phone and email:</strong> if you contact us this way, we receive your number or address and
            the content of your messages.
          </li>
          <li>
            <strong>Technical data:</strong> our hosting provider automatically processes basic technical information (such
            as IP address, browser type and pages requested) to deliver and secure the site. Your light/dark display
            preference is stored only in your own browser. This website does not use advertising or analytics cookies.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="purpose" title="2. Why we use it (purpose)">
        <ul>
          <li>To contact you about your appointment request, and to confirm, reschedule or cancel a time.</li>
          <li>To answer questions you send us.</li>
          <li>To keep the website secure and prevent spam or misuse.</li>
          <li>To meet legal obligations that apply to us.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use it for marketing unless you separately agree to that.
        </p>
      </LegalSection>

      <LegalSection id="consent" title="3. Consent">
        <p>
          We process the details in the appointment request form on the basis of your consent, which you give by ticking the
          consent box before submitting. Your consent is limited to the purposes in section 2.
        </p>
        <p>
          You can <strong>withdraw consent at any time</strong> by contacting us using the details in section 8. Withdrawing is
          as easy as giving consent; it does not affect processing already carried out, and after withdrawal we will stop
          processing your data unless the law requires us to keep it.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="4. Who we share it with">
        <p>We use a small number of service providers (&ldquo;Data Processors&rdquo;) that handle data on our behalf:</p>
        <ul>
          <li>
            <strong>Form delivery service</strong> (FormSubmit, formsubmit.co) — forwards your form submission to the
            clinic&apos;s email inbox.
          </li>
          {onlineBooking && (
            <>
              <li>
                <strong>Booking database</strong> (Neon Postgres, via Vercel) — stores online bookings securely. Only the
                clinic can see them, through a password-protected admin page.
              </li>
              <li>
                <strong>Transactional email</strong> (Resend) — sends your booking confirmation and change notices.
              </li>
            </>
          )}
          <li>
            <strong>Email provider</strong> used by the clinic to receive and reply to your request.
          </li>
          <li>
            <strong>Website hosting</strong> (Vercel) — serves this website.
          </li>
          <li>
            <strong>WhatsApp</strong> (Meta) — only if you choose to contact us on WhatsApp.
          </li>
        </ul>
        <p>
          Some of these providers may process data outside India. We will not transfer data to any country that the
          Government of India has restricted under the DPDP Act. We may also disclose data where required by law or a lawful
          order.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="5. How long we keep it">
        <p>
          Appointment requests that do not lead to treatment are deleted within{" "}
          <strong>{legal.enquiryRetentionMonths} months</strong> of our last contact with you, or sooner if you withdraw
          consent. If you become a patient, your clinical records are kept for the period required by applicable medical
          record-keeping rules and professional guidelines, and are handled under the clinic&apos;s patient records policy.
        </p>
        {onlineBooking && (
          <p>
            Online bookings follow the same rule: bookings that do not lead to treatment are deleted within{" "}
            {legal.enquiryRetentionMonths} months of the appointment date. Cancelling a booking does not delete it straight
            away; ask us (section 8) if you want it erased sooner.
          </p>
        )}
      </LegalSection>

      <LegalSection id="rights" title="6. Your rights">
        <p>Under the DPDP Act you have the right to:</p>
        <ul>
          <li>obtain a summary of the personal data we hold about you and how we process it;</li>
          <li>ask us to correct, complete or update inaccurate or incomplete data;</li>
          <li>
            ask us to erase data that is no longer needed, or that you withdraw consent for (unless the law requires us to
            keep it);
          </li>
          <li>withdraw your consent at any time;</li>
          <li>have your grievances addressed by us (section 8); and</li>
          <li>nominate another person to exercise these rights on your behalf in the event of death or incapacity.</li>
        </ul>
        <p>
          If you are not satisfied with our response to a grievance, you may complain to the Data Protection Board of India
          after first using our grievance process.
        </p>
      </LegalSection>

      <LegalSection id="children" title="7. Children">
        <p>
          The appointment form is meant for adults. If you are requesting an appointment for a child (under 18), the request
          must be made by a parent or lawful guardian, who gives consent on the child&apos;s behalf.
        </p>
      </LegalSection>

      <LegalSection id="grievance" title="8. Contact and grievance officer">
        <p>To exercise your rights, withdraw consent or raise a concern, contact:</p>
        <ul>
          <li>
            <strong>{g.name}</strong>, {legal.entityName}
          </li>
          <li>
            Email: <a href={`mailto:${g.email}`}>{g.email}</a>
          </li>
          {g.phone && <li>Phone: {g.phone}</li>}
          <li>Address: {addressOneLine}</li>
        </ul>
        <p>
          General enquiries: <a href={`mailto:${CLINIC_EMAIL}`}>{CLINIC_EMAIL}</a>. We aim to acknowledge requests promptly
          and to resolve them within the timelines set under the DPDP Act and its Rules.
        </p>
      </LegalSection>

      <LegalSection id="security" title="9. Security">
        <p>
          We use reasonable security safeguards, such as encrypted (HTTPS) connections and access limited to clinic staff
          who need it. No method of transmission over the internet is completely secure; please avoid sending sensitive
          medical documents through the website form.
        </p>
      </LegalSection>

      <LegalSection id="medical-disclaimer" title="10. Medical disclaimer">
        <p>
          Information on this website is general and is not a substitute for a diagnosis or treatment plan from a qualified
          healthcare professional. Submitting the form does not create a therapist–patient relationship. In an emergency,
          call <strong>112</strong> or go to the nearest hospital. See our <Link href="/terms">Terms of Use</Link> for more.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to this policy">
        <p>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it was last
          changed. Material changes affecting how we use data you have already given us will be communicated where required.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

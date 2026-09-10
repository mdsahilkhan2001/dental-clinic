import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Jeevan Dental & Aesthetic Clinic collects and uses the information you provide when booking an appointment or contacting the clinic.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: January 2026"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />
      <section className="section">
        <div className="container-page prose-clinic max-w-3xl text-[15px]">
          <p>
            This policy explains what information {siteConfig.name}{" "}
            (&ldquo;the clinic&rdquo;, &ldquo;we&rdquo;) collects through this
            website and how we use it. It is written in plain language and is not
            a substitute for advice on your specific circumstances.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Appointment requests:</strong> your name, phone number,
              optional email, the service and clinician you select, your
              preferred date and time, and any message you choose to add.
            </li>
            <li>
              <strong>Enquiries:</strong> your name, phone number, optional email
              and the content of your message.
            </li>
            <li>
              <strong>Technical data:</strong> standard server logs (such as IP
              address and browser type) used to keep the site secure and working.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> ask for detailed medical history, ID
            numbers or payment details through this website. Please share
            clinical information in person or by phone.
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>To contact you and arrange, confirm or change your appointment.</li>
            <li>To respond to your enquiry.</li>
            <li>To keep basic records of appointments and communications.</li>
            <li>To protect the website against misuse.</li>
          </ul>
          <p>
            We rely on your consent (the checkbox on our forms) and our
            legitimate interest in running the clinic and responding to you.
          </p>

          <h2>Sharing</h2>
          <p>
            We do not sell your information. We use a small number of service
            providers to operate the website and store form submissions
            securely (our hosting and database provider). They process data on
            our instructions only.
          </p>

          <h2>Retention</h2>
          <p>
            We keep appointment and enquiry records for as long as needed to
            provide care and meet our record-keeping obligations, after which
            they are deleted or anonymised.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us to access, correct or delete the information you have
            given us. Contact us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
            {siteConfig.phone.display}. You can withdraw consent at any time; this
            does not affect anything done before you withdrew it.
          </p>

          <h2>Cookies</h2>
          <p>
            This website uses only the cookies required for it to function
            (including keeping staff signed in to the admin area). It does not
            use advertising cookies. The embedded Google Map may set cookies
            controlled by Google.
          </p>

          <h2>Contact</h2>
          <p>
            {siteConfig.name}
            <br />
            {siteConfig.address.full}
            <br />
            Phone: {siteConfig.phone.display} · Email:{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

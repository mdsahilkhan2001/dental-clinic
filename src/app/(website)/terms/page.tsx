import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { MEDICAL_DISCLAIMER, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Terms for using the Jeevan Dental & Aesthetic Clinic website, including appointment requests and the medical information disclaimer.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Last updated: January 2026"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Terms & Conditions", href: "/terms" },
        ]}
      />
      <section className="section">
        <div className="container-page prose-clinic max-w-3xl text-[15px]">
          <p>
            These terms apply to your use of the {siteConfig.name} website. By
            using the site you accept them.
          </p>

          <h2>Information on this website</h2>
          <p>{MEDICAL_DISCLAIMER}</p>
          <p>
            Service descriptions are general and indicative. The treatments
            actually offered, their suitability for you and their cost are
            confirmed only after an in-person consultation.
          </p>

          <h2>Appointment requests</h2>
          <ul>
            <li>
              Submitting the appointment form sends a <strong>request</strong>,
              not a confirmed booking. Your slot is confirmed only when our team
              contacts you.
            </li>
            <li>
              Please provide accurate contact details so we can reach you.
            </li>
            <li>
              If you cannot attend, let us know in advance so the time can be
              offered to someone else.
            </li>
          </ul>

          <h2>Acceptable use</h2>
          <p>
            Do not use this website to submit false information, attempt to
            disrupt the service, or gain unauthorised access to any part of it.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content, branding and design of this website belong to the
            clinic unless stated otherwise, and may not be copied without
            permission.
          </p>

          <h2>Third-party links</h2>
          <p>
            The site links to external services such as WhatsApp and Google Maps.
            We are not responsible for their content or practices.
          </p>

          <h2>Liability</h2>
          <p>
            We take reasonable care to keep the information on this site accurate
            and the site available, but we do not warrant that it is error-free
            or uninterrupted. Nothing in these terms limits liability that cannot
            be limited by law.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The current version is
            always the one published on this page.
          </p>

          <h2>Contact</h2>
          <p>
            {siteConfig.name}, {siteConfig.address.full}. Phone:{" "}
            {siteConfig.phone.display}. Email:{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}

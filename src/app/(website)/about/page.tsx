import Image from "next/image";
import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/website/page-hero";
import { SectionHeading } from "@/components/website/section-heading";
import { WhyChooseUs } from "@/components/website/why-choose-us";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { OpeningHours } from "@/components/website/opening-hours";
import { ContactCard } from "@/components/website/contact-card";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getClinicHours, getSiteContent } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About the Clinic",
  description:
    "About Jeevan Dental & Aesthetic Clinic in Mahuadanr, Latehar — our approach to personalized dental, skin, hair and aesthetic care, hygiene and patient comfort.",
  path: "/about",
});

export default async function AboutPage() {
  const [content, hours] = await Promise.all([
    getSiteContent(),
    getClinicHours(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About us"
        title={content.about.heading}
        description="One clinic for dental, skin, hair and aesthetic care in Mahuadanr, Latehar."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="prose-clinic max-w-none text-[15px]">
            {content.about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h2>Our approach</h2>
            <p>
              Care begins with a proper assessment. We take time to understand
              your concern, examine what is relevant, and explain what we find in
              plain language. Where treatment is recommended, you receive a
              written plan with the sequence and costs so you can decide how to
              proceed.
            </p>
            <ul>
              <li>
                <strong>Personalized care</strong> — plans built around your
                needs, priorities and budget.
              </li>
              <li>
                <strong>Hygiene &amp; sterilisation</strong> — instruments
                cleaned and sterilised to protocol; treatment areas prepared
                between patients.
              </li>
              <li>
                <strong>Patient comfort</strong> — a calm environment and a pace
                you are comfortable with.
              </li>
              <li>
                <strong>Clear communication</strong> — findings, options and
                costs explained before treatment starts.
              </li>
              <li>
                <strong>Modern treatment approach</strong> — chairside imaging
                and current techniques support careful, conservative care.
              </li>
            </ul>
            <MedicalDisclaimer className="not-prose mt-6" />
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-border">
                <Image
                  src="/images/clinic/operatory-wide.jpg"
                  alt="Treatment room with dental chair and workstation"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-border">
                <Image
                  src="/images/clinic/operatory-light.jpg"
                  alt="Operating light and chairside monitor above the dental chair"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            </div>
            <ContactCard />
            <OpeningHours hours={hours} />
          </div>
        </div>
      </section>

      <WhyChooseUs items={content.whyChooseUs} />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Location"
            title="Serving Mahuadanr, Latehar & nearby"
            description={`We welcome patients from ${siteConfig.serviceAreas.join(", ")} and the surrounding area.`}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {siteConfig.serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-primary"
              >
                <Check className="size-3.5 text-accent" aria-hidden />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading={content.cta.heading}
        body={content.cta.body}
        tone="surface"
      />
    </>
  );
}

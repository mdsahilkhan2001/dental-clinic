import Image from "next/image";

import { PageHero } from "@/components/website/page-hero";
import { ServiceGrid } from "@/components/website/service-grid";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { SectionHeading } from "@/components/website/section-heading";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import { getFaqs, getServices } from "@/lib/data";
import { serviceCategories, type ServiceCategorySlug } from "@/lib/site";
import type { FaqCategory } from "@/types/database";

const HERO_IMAGE: Record<ServiceCategorySlug, string> = {
  dental: "/images/clinic/operatory-unit.jpg",
  skin: "/images/clinic/operatory-room.jpg",
  hair: "/images/clinic/operatory-workstation.jpg",
  aesthetic: "/images/clinic/operatory-light.jpg",
};

const INTRO: Record<ServiceCategorySlug, string> = {
  dental:
    "From routine check-ups to restorative and cosmetic treatment, our dental care is planned around a proper examination and a clear, costed treatment plan.",
  skin: "Consultation-led skin care for concerns such as acne, pigmentation and scarring. Assessment is in person, and any treatment is planned around your skin and history.",
  hair: "Structured assessment and management for hair fall and scalp concerns, addressing contributing factors alongside any treatment considered appropriate.",
  aesthetic:
    "Elective facial aesthetic and cosmetic care, planned individually after an in-person assessment, with realistic expectations set before anything begins.",
};

export async function ServiceCategoryView({
  category,
}: {
  category: ServiceCategorySlug;
}) {
  const meta = serviceCategories.find((c) => c.slug === category)!;
  const [services, faqs] = await Promise.all([
    getServices({ category }),
    getFaqs({ category: category as FaqCategory }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: meta.label, path: meta.href },
          ]),
          ...(faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow="Services"
        title={meta.label}
        description={INTRO[category]}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: meta.label, href: meta.href },
        ]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <Image
                src={HERO_IMAGE[category]}
                alt={`${meta.label} at Jeevan Dental & Aesthetic Clinic`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl">What to expect</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {meta.blurb} Every plan starts with an assessment and a
                discussion of your options, and you decide how to proceed with
                written information in front of you.
              </p>
              <MedicalDisclaimer variant="suitability" className="mt-5" />
            </div>
          </div>

          <div className="mt-12">
            <SectionHeading title={`${meta.label} treatments`} />
            <div className="mt-6">
              <ServiceGrid services={services} columns={3} />
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="mt-14 max-w-3xl">
              <SectionHeading
                eyebrow="FAQ"
                title={`${meta.label} — common questions`}
              />
              <div className="mt-4">
                <FaqAccordion
                  items={faqs.map((f) => ({
                    question: f.question,
                    answer: f.answer,
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading={`Book your ${meta.label.toLowerCase()} appointment`}
        body="Request a time online, or message us on WhatsApp and our team will help you book."
        tone="surface"
      />
    </>
  );
}

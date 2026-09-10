import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { CTASection } from "@/components/website/cta-section";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/data";
import type { FaqCategory } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about appointments, services, timings and contacting Jeevan Dental & Aesthetic Clinic in Mahuadanr, Latehar.",
  path: "/faq",
});

const CATEGORY_ORDER: { key: FaqCategory; label: string }[] = [
  { key: "appointments", label: "Appointments" },
  { key: "general", label: "General" },
  { key: "dental", label: "Dental" },
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "aesthetic", label: "Aesthetic" },
];

export default async function FaqPage() {
  const faqs = await getFaqs();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    ...cat,
    items: faqs.filter((f) => f.category === cat.key),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          ...(faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <PageHero
        eyebrow="Help"
        title="Frequently asked questions"
        description="Can't find an answer? Call the clinic or message us on WhatsApp and we'll help."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />

      <section className="section">
        <div className="container-page max-w-3xl">
          {grouped.length > 0 ? (
            <div className="space-y-12">
              {grouped.map((group) => (
                <div key={group.key}>
                  <h2 className="text-2xl">{group.label}</h2>
                  <div className="mt-3">
                    <FaqAccordion
                      items={group.items.map((f) => ({
                        question: f.question,
                        answer: f.answer,
                      }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              FAQs will be published here shortly.
            </p>
          )}
        </div>
      </section>

      <CTASection
        heading="Still have a question?"
        body="Our team is happy to help by phone or WhatsApp during opening hours."
        tone="surface"
      />
    </>
  );
}

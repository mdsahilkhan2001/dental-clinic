import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/website/page-hero";
import { ServiceGrid } from "@/components/website/service-grid";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getServices } from "@/lib/data";
import { serviceCategories } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Services — Dental, Skin, Hair & Aesthetic Care",
  description:
    "Explore dental, skin, hair and aesthetic services at Jeevan Dental & Aesthetic Clinic, Mahuadanr. Only treatments the clinic currently offers are listed.",
  path: "/services",
  keywords: [
    "dental treatment Mahuadanr",
    "skin care clinic in Mahuadanr",
    "hair care clinic in Mahuadanr",
    "aesthetic clinic in Mahuadanr",
  ],
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        eyebrow="Our services"
        title="Dental, skin, hair & aesthetic care"
        description="Browse by category below. Each treatment page explains what is involved, who it may suit and answers common questions."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group flex flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                <h2 className="text-lg group-hover:text-accent">{cat.label}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {cat.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Explore <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            ))}
          </div>

          {serviceCategories.map((cat) => {
            const list = services.filter((s) => s.category === cat.slug);
            if (list.length === 0) return null;
            return (
              <div key={cat.slug} className="mt-14 scroll-mt-24" id={cat.slug}>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-2xl">{cat.label}</h2>
                  <Link
                    href={cat.href}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    View {cat.label} page
                  </Link>
                </div>
                <div className="mt-5">
                  <ServiceGrid services={list} columns={3} />
                </div>
              </div>
            );
          })}

          <MedicalDisclaimer className="mt-12" />
        </div>
      </section>

      <CTASection
        heading="Not sure which service you need?"
        body="Book a consultation and our clinician will assess your concern and recommend a suitable plan."
        primaryLabel="Book a Consultation"
        tone="surface"
      />
    </>
  );
}

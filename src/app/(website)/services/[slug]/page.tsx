import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, ListChecks, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/website/page-hero";
import { ServiceGrid } from "@/components/website/service-grid";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { SectionHeading } from "@/components/website/section-heading";
import { WhatsAppButton } from "@/components/website/action-buttons";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getRelatedServices,
  getServiceBySlug,
  getServices,
} from "@/lib/data";
import { serviceCategories } from "@/lib/site";

export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

const CATEGORY_FALLBACK: Record<string, string> = {
  dental: "/images/clinic/operatory-unit.jpg",
  skin: "/images/clinic/operatory-room.jpg",
  hair: "/images/clinic/operatory-workstation.jpg",
  aesthetic: "/images/clinic/operatory-light.jpg",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return buildMetadata({
      title: "Service not found",
      description: "This service could not be found.",
      path: `/services/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: service.meta_title ?? `${service.title} in Mahuadanr`,
    description: service.meta_description ?? service.short_description,
    path: `/services/${service.slug}`,
    images: service.image_url
      ? [{ url: service.image_url, alt: service.title }]
      : undefined,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const categoryMeta = serviceCategories.find(
    (c) => c.slug === service.category,
  )!;
  const related = await getRelatedServices(service, 3);
  const image = service.image_url ?? CATEGORY_FALLBACK[service.category];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: categoryMeta.label, path: categoryMeta.href },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd(service),
          ...(service.faqs.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow={categoryMeta.label}
        title={service.title}
        description={service.short_description}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: categoryMeta.label, href: categoryMeta.href },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <Image
                src={image}
                alt={`${service.title} at Jeevan Dental & Aesthetic Clinic`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div className="prose-clinic mt-8 max-w-none text-[15px]">
              <h2>Overview</h2>
              <p>{service.description ?? service.short_description}</p>
            </div>

            {service.suitable_for.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-xl">
                  <Users className="size-5 text-accent" aria-hidden />
                  Who it may be suitable for
                </h2>
                <ul className="mt-3 space-y-2">
                  {service.suitable_for.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[15px] text-muted-foreground"
                    >
                      <Check
                        className="mt-1 size-4 shrink-0 text-accent"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.procedure_steps.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-xl">
                  <ListChecks className="size-5 text-accent" aria-hidden />
                  What the treatment involves
                </h2>
                <ol className="mt-3 space-y-3">
                  {service.procedure_steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[15px]">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {service.benefits.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl">Benefits</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {service.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2.5 rounded-[var(--radius)] border border-border bg-surface px-3 py-2.5 text-sm text-primary"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-accent"
                        aria-hidden
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl">Frequently asked questions</h2>
                <div className="mt-3">
                  <FaqAccordion items={service.faqs} />
                </div>
              </div>
            )}

            <MedicalDisclaimer variant="suitability" className="mt-10" />
          </div>

          {/* Sticky booking rail */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                Book this treatment
              </p>
              <h2 className="mt-1 text-lg">{service.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Request an appointment and our team will confirm a suitable time
                with you.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button asChild variant="gold">
                  <Link href={`/appointment?service=${service.slug}`}>
                    Book Appointment
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <WhatsAppButton
                  message={`Hello Jeevan Dental & Aesthetic Clinic, I would like to book an appointment for ${service.title}.`}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-surface">
          <div className="container-page">
            <SectionHeading
              eyebrow="Related"
              title={`More ${categoryMeta.label.toLowerCase()}`}
            />
            <div className="mt-6">
              <ServiceGrid services={related} columns={3} />
            </div>
          </div>
        </section>
      )}

      <CTASection
        heading="Have a question first?"
        body="Message us on WhatsApp or call the clinic — we're happy to help before you book."
        primaryLabel="Book Appointment"
      />
    </>
  );
}

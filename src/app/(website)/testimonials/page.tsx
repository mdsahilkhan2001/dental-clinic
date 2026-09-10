import type { Metadata } from "next";
import { MessageSquareQuote } from "lucide-react";

import { PageHero } from "@/components/website/page-hero";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { CTASection } from "@/components/website/cta-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Patient Testimonials",
  description:
    "Feedback from patients of Jeevan Dental & Aesthetic Clinic, Mahuadanr. Reviews are published by the clinic and are not fabricated.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ])}
      />
      <PageHero
        eyebrow="Patient feedback"
        title="What our patients say"
        description="Reviews shared with the clinic. We do not publish fabricated or incentivised reviews."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Testimonials", href: "/testimonials" },
        ]}
      />

      <section className="section">
        <div className="container-page">
          {testimonials.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-10 text-center">
              <MessageSquareQuote
                className="mx-auto size-8 text-navy-300"
                aria-hidden
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Patient reviews will appear here once published by the clinic.
                If you have visited us, we would be glad to hear your feedback in
                person or on WhatsApp.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading="Experience the care yourself"
        body="Book an appointment and see how we work."
        tone="surface"
      />
    </>
  );
}

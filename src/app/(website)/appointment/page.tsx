import type { Metadata } from "next";
import { CalendarClock, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/website/page-hero";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { OpeningHours } from "@/components/website/opening-hours";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getClinicHours, getDoctors, getServices } from "@/lib/data";
import { siteConfig, whatsappLink } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book an Appointment",
  description:
    "Request an appointment at Jeevan Dental & Aesthetic Clinic, Mahuadanr. Choose a service, date and time — our team confirms your slot by phone or WhatsApp.",
  path: "/appointment",
});

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; doctor?: string }>;
}) {
  const { service, doctor } = await searchParams;
  const [services, doctors, hours] = await Promise.all([
    getServices(),
    getDoctors(),
    getClinicHours(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book Appointment", path: "/appointment" },
        ])}
      />
      <PageHero
        eyebrow="Appointments"
        title="Book an appointment"
        description="Tell us what you need and pick a time that suits you. We'll confirm your slot and answer any questions before your visit."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Book Appointment", href: "/appointment" },
        ]}
      />

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <AppointmentForm
            services={services}
            doctors={doctors}
            initialServiceSlug={service}
            initialDoctorSlug={doctor}
          />

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <CalendarClock className="size-4 text-accent" aria-hidden />
                Prefer to talk to us?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Call or message the clinic during opening hours and we&apos;ll
                book you in.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href={siteConfig.phone.tel}
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2.5 text-sm font-semibold text-primary hover:border-accent"
                >
                  <Phone className="size-4 text-accent" aria-hidden />
                  {siteConfig.phone.display}
                </a>
                <a
                  href={whatsappLink(
                    "Hello Jeevan Dental & Aesthetic Clinic, I would like to book an appointment.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2.5 text-sm font-semibold text-primary hover:border-[#1FA855]"
                >
                  <MessageCircle className="size-4 text-[#1FA855]" aria-hidden />
                  WhatsApp us
                </a>
              </div>
            </div>

            <OpeningHours hours={hours} />

            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="size-4 text-accent" aria-hidden />
                Your information
              </p>
              <p className="mt-2">
                We only collect what we need to arrange your appointment and
                contact you about it. We do not ask for detailed medical history
                through this form.
              </p>
            </div>

            <MedicalDisclaimer variant="suitability" />
          </aside>
        </div>
      </section>
    </>
  );
}

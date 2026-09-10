import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { DoctorCard } from "@/components/website/doctor-card";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getDoctors } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Our Doctors & Clinical Team",
  description:
    "Meet the clinicians at Jeevan Dental & Aesthetic Clinic, Mahuadanr. Clinician profiles, qualifications and specializations are published as provided by the clinic.",
  path: "/doctor",
});

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Doctors", path: "/doctor" },
        ])}
      />
      <PageHero
        eyebrow="Our team"
        title="Doctors & clinical team"
        description="The people who will look after you. Full profiles and registration details are published as the clinic provides them."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Doctors", href: "/doctor" },
        ]}
      />

      <section className="section">
        <div className="container-page">
          {doctors.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
              Clinician profiles are being prepared. Please contact the clinic
              for information about the treating clinician for your appointment.
            </p>
          )}
          <MedicalDisclaimer className="mt-10" />
        </div>
      </section>

      <CTASection
        heading="Book with our team"
        body="Request an appointment and we'll confirm a suitable time and clinician with you."
        tone="surface"
      />
    </>
  );
}

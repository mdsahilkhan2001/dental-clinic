import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  BriefcaseMedical,
  GraduationCap,
  Languages,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/website/page-hero";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { WhatsAppButton } from "@/components/website/action-buttons";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getDoctorBySlug, getDoctors } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) {
    return buildMetadata({
      title: "Doctor not found",
      description: "This profile could not be found.",
      path: `/doctor/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: `${doctor.name}${doctor.title ? ` — ${doctor.title}` : ""}`,
    description:
      doctor.bio?.slice(0, 200) ??
      `${doctor.name} at Jeevan Dental & Aesthetic Clinic, Mahuadanr.`,
    path: `/doctor/${doctor.slug}`,
    images: doctor.image_url
      ? [{ url: doctor.image_url, alt: doctor.name }]
      : undefined,
  });
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const facts = [
    doctor.qualification && {
      Icon: GraduationCap,
      label: "Qualification",
      value: doctor.qualification,
    },
    doctor.specialization && {
      Icon: Stethoscope,
      label: "Specialization",
      value: doctor.specialization,
    },
    doctor.experience && {
      Icon: BriefcaseMedical,
      label: "Experience",
      value: doctor.experience,
    },
    doctor.languages.length > 0 && {
      Icon: Languages,
      label: "Languages",
      value: doctor.languages.join(", "),
    },
  ].filter(Boolean) as {
    Icon: typeof GraduationCap;
    label: string;
    value: string;
  }[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Doctors", path: "/doctor" },
            { name: doctor.name, path: `/doctor/${doctor.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Physician",
            name: doctor.name,
            medicalSpecialty: doctor.specialization ?? "Dentistry",
            worksFor: { "@id": `${siteConfig.url}/#clinic` },
            url: `${siteConfig.url}/doctor/${doctor.slug}`,
          },
        ]}
      />

      <PageHero
        eyebrow="Doctor profile"
        title={doctor.name}
        description={doctor.title ?? undefined}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Doctors", href: "/doctor" },
          { name: doctor.name, href: `/doctor/${doctor.slug}` },
        ]}
      />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted">
              {doctor.image_url ? (
                <Image
                  src={doctor.image_url}
                  alt={`Portrait of ${doctor.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-navy-300">
                  <Stethoscope className="size-16" aria-hidden />
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button asChild variant="gold">
                <Link href={`/appointment?doctor=${doctor.slug}`}>
                  Book an Appointment
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <WhatsAppButton
                message={`Hello Jeevan Dental & Aesthetic Clinic, I would like to book an appointment with ${doctor.name}.`}
              />
            </div>
          </div>

          <div>
            {facts.length > 0 && (
              <dl className="grid gap-4 sm:grid-cols-2">
                {facts.map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-[var(--radius)] border border-border bg-surface p-4"
                  >
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Icon className="size-4 text-accent" aria-hidden />
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {doctor.bio && (
              <div className="prose-clinic mt-8 max-w-none text-[15px]">
                <h2>About</h2>
                {doctor.bio.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {doctor.services.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl">Services</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {doctor.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-primary"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <MedicalDisclaimer className="mt-10" />
          </div>
        </div>
      </section>

      <CTASection
        heading={`Book with ${doctor.name.split(" ")[0]}`}
        body="Request a time online and our team will confirm your appointment."
        primaryHref={`/appointment?doctor=${doctor.slug}`}
        tone="surface"
      />
    </>
  );
}

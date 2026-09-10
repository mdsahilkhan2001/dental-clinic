import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/website/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactMethods } from "@/components/website/contact-methods";
import { OpeningHours } from "@/components/website/opening-hours";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { SectionHeading } from "@/components/website/section-heading";
import { CTASection } from "@/components/website/cta-section";
import { Reveal } from "@/components/website/reveal";
import {
  CallButton,
  DirectionsButton,
  WhatsAppButton,
} from "@/components/website/action-buttons";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getClinicHours, getOpenStatus } from "@/lib/data";
import { siteConfig, whatsappLink } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Location",
  description:
    "Contact Jeevan Dental & Aesthetic Clinic, Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119. Call, WhatsApp, get directions or book an appointment.",
  path: "/contact",
  keywords: [
    "dental clinic in Mahuadanr contact",
    "dentist Mahuadanr phone number",
  ],
});

const CONTACT_ROWS = [
  {
    Icon: Phone,
    label: "Phone",
    value: siteConfig.phone.display,
    href: siteConfig.phone.tel,
    external: false,
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.phone.display,
    href: whatsappLink(
      "Hello Jeevan Dental & Aesthetic Clinic, I have a question.",
    ),
    external: true,
  },
  {
    Icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
  },
];

export default async function ContactPage() {
  const hours = await getClinicHours();
  const status = getOpenStatus(hours);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Call, message us on WhatsApp, or send an enquiry below. We're on Main Road, right next to the petrol pump in Mahuadanr — open all seven days."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      {/* Quick contact methods */}
      <section className="container-page relative z-10 -mt-8 md:-mt-10">
        <ContactMethods />
      </section>

      {/* Details + form */}
      <section className="section pt-10 md:pt-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <Reveal className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg">{siteConfig.name}</h2>
                <Badge variant={status.open ? "success" : "muted"}>
                  <span
                    className={`mr-1 inline-block size-1.5 rounded-full ${
                      status.open ? "bg-teal-600" : "bg-muted-foreground"
                    }`}
                    aria-hidden
                  />
                  {status.label}
                </Badge>
              </div>

              <div className="mt-4 flex gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden
                />
                <address className="not-italic text-sm leading-relaxed text-muted-foreground">
                  Near Petrol Pump, Main Road,
                  <br />
                  Mahuadanr, Latehar,
                  <br />
                  Jharkhand&nbsp;&ndash;&nbsp;822119, India
                  <span className="mt-1.5 block text-xs text-muted-foreground/80">
                    Landmark: right beside the petrol pump on Main Road.
                  </span>
                </address>
              </div>

              <ul className="mt-4 divide-y divide-border border-y border-border">
                {CONTACT_ROWS.map(({ Icon, label, value, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center gap-3 py-3 text-sm transition-colors hover:text-primary"
                    >
                      <Icon
                        className="size-4 shrink-0 text-accent"
                        aria-hidden
                      />
                      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </span>
                      <span className="font-medium text-primary">{value}</span>
                    </a>
                  </li>
                ))}
                <li className="flex items-center gap-3 py-3 text-sm">
                  <Clock className="size-4 shrink-0 text-accent" aria-hidden />
                  <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Today
                  </span>
                  <span className="font-medium text-primary">
                    {status.todaySummary}
                  </span>
                </li>
              </ul>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Serving
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {siteConfig.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-primary"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <CallButton size="sm" />
                <WhatsAppButton size="sm" />
                <DirectionsButton size="sm" />
                <Button asChild variant="gold" size="sm">
                  <Link href="/appointment">Book Appointment</Link>
                </Button>
              </div>
            </Reveal>

            <OpeningHours hours={hours} />
            <MedicalDisclaimer />
          </div>

          <Reveal delay={80} className="space-y-4">
            <ContactForm />
            <p className="rounded-[var(--radius)] border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
              We reply to enquiries during clinic hours. For anything urgent, or
              to book for the same day, please{" "}
              <a
                href={siteConfig.phone.tel}
                className="font-semibold text-accent"
              >
                call the clinic
              </a>{" "}
              or message us on WhatsApp.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="section bg-surface pt-0" id="map">
        <div className="container-page">
          <SectionHeading
            eyebrow="Find us"
            title="On Main Road, next to the petrol pump"
            description="Mahuadanr, Latehar district. Free to park nearby. Tap the map for turn-by-turn directions."
          />
          <div className="relative mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <iframe
              title={`Map showing ${siteConfig.name}`}
              src={siteConfig.maps.embed}
              width="100%"
              height="440"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[0.15]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:inset-auto sm:bottom-5 sm:left-5 sm:max-w-xs">
              <div className="pointer-events-auto rounded-[var(--radius-lg)] border border-border bg-background/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur">
                <p className="text-sm font-semibold text-primary">
                  {siteConfig.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {siteConfig.address.line1}, {siteConfig.address.line2},{" "}
                  {siteConfig.address.region} {siteConfig.address.postalCode}
                </p>
                <Button asChild variant="accent" size="sm" className="mt-3 w-full">
                  <a
                    href={siteConfig.maps.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation aria-hidden />
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help strip */}
      <section className="section">
        <div className="container-page grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6">
            <HelpCircle className="size-6 text-accent" aria-hidden />
            <h3 className="mt-3 text-lg">Looking for a quick answer?</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">
              Appointments, timings, services and WhatsApp — the common questions
              are answered on our FAQ page.
            </p>
            <Link
              href="/faq"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Read the FAQ <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6">
            <Phone className="size-6 text-accent" aria-hidden />
            <h3 className="mt-3 text-lg">Prefer to talk to someone?</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">
              Call {siteConfig.phone.display} during clinic hours and our team
              will help you book or answer your question.
            </p>
            <a
              href={siteConfig.phone.tel}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Call now <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <CTASection
        heading="Ready to visit Jeevan Clinic?"
        body="Request an appointment online and our team will confirm a time that works for you."
        tone="surface"
      />
    </>
  );
}

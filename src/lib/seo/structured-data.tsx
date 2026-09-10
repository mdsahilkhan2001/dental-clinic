import { siteConfig } from "@/lib/site";
import type { NormalizedDayHours } from "@/lib/data";
import type { FaqRow, ServiceRow } from "@/types/database";

const SCHEMA_DAY: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    addressLocality: siteConfig.address.line2,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  };
}

function openingHoursSpec(hours: NormalizedDayHours[]) {
  const specs: Record<string, unknown>[] = [];
  for (const day of hours) {
    if (!day.is_open) continue;
    const dayName = SCHEMA_DAY[day.day_of_week];
    if (day.morning_start && day.morning_end) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayName,
        opens: day.morning_start,
        closes: day.morning_end,
      });
    }
    if (day.evening_start && day.evening_end) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayName,
        opens: day.evening_start,
        closes: day.evening_end,
      });
    }
    if (!day.morning_start && !day.evening_start) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayName,
        opens: "00:00",
        closes: "23:59",
      });
    }
  }
  return specs;
}

/**
 * LocalBusiness graph. Modelled as both Dentist and MedicalClinic since the
 * clinic offers dental plus skin/hair/aesthetic care. No latitude/longitude
 * is included — none has been provided.
 */
export function localBusinessJsonLd(options: {
  hours: NormalizedDayHours[];
  sameAs?: string[];
}) {
  const sameAs = (options.sameAs ?? []).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
    "@id": `${siteConfig.url}/#clinic`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone.e164,
    email: siteConfig.email,
    image: `${siteConfig.url}/images/logo.jpg`,
    logo: `${siteConfig.url}/images/logo.jpg`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    address: postalAddress(),
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    medicalSpecialty: ["Dentistry", "Dermatology", "CosmeticProcedure"],
    availableService: [
      { "@type": "MedicalProcedure", name: "Dental Care" },
      { "@type": "MedicalProcedure", name: "Skin Care" },
      { "@type": "MedicalProcedure", name: "Hair Care" },
      { "@type": "MedicalProcedure", name: "Aesthetic Care" },
    ],
    openingHoursSpecification: openingHoursSpec(options.hours),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteConfig.url}/#clinic` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function serviceJsonLd(service: ServiceRow) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.short_description,
    url: `${siteConfig.url}/services/${service.slug}`,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    provider: { "@id": `${siteConfig.url}/#clinic` },
  };
}

export function faqJsonLd(faqs: Pick<FaqRow, "question" | "answer">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is server-rendered from trusted, non-user content.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

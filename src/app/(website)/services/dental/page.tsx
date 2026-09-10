import type { Metadata } from "next";

import { ServiceCategoryView } from "@/components/website/service-category-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Dental Care in Mahuadanr — Check-ups, Root Canals, Crowns, Braces",
  description:
    "Dental care at Jeevan Dental & Aesthetic Clinic, Mahuadanr: consultations, cleaning, fillings, root canal treatment, crowns, bridges, implants, braces and aligners.",
  path: "/services/dental",
  keywords: [
    "dental clinic in Mahuadanr",
    "dentist in Mahuadanr",
    "dental clinic in Latehar",
    "root canal Mahuadanr",
  ],
});

export default function DentalServicesPage() {
  return <ServiceCategoryView category="dental" />;
}

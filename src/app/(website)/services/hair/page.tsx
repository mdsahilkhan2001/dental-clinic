import type { Metadata } from "next";

import { ServiceCategoryView } from "@/components/website/service-category-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Hair Care Clinic in Mahuadanr — Hair Fall & Scalp Care",
  description:
    "Hair care at Jeevan Dental & Aesthetic Clinic, Mahuadanr: hair consultation, hair fall care, scalp care and hair restoration treatments for suitable patients.",
  path: "/services/hair",
  keywords: ["hair care clinic in Mahuadanr", "hair fall treatment Mahuadanr"],
});

export default function HairServicesPage() {
  return <ServiceCategoryView category="hair" />;
}

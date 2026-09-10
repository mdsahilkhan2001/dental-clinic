import type { Metadata } from "next";

import { ServiceCategoryView } from "@/components/website/service-category-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Aesthetic Clinic in Mahuadanr — Facial Aesthetic & Cosmetic Care",
  description:
    "Aesthetic care at Jeevan Dental & Aesthetic Clinic, Mahuadanr: aesthetic consultation, facial aesthetic treatments and personalized cosmetic care planned after assessment.",
  path: "/services/aesthetic",
  keywords: ["aesthetic clinic in Mahuadanr", "cosmetic treatment Mahuadanr"],
});

export default function AestheticServicesPage() {
  return <ServiceCategoryView category="aesthetic" />;
}

import type { Metadata } from "next";

import { ServiceCategoryView } from "@/components/website/service-category-view";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Skin Care Clinic in Mahuadanr — Acne, Pigmentation & Scar Care",
  description:
    "Consultation-led skin care at Jeevan Dental & Aesthetic Clinic, Mahuadanr: acne care, pigmentation care, scar care and skin rejuvenation, planned after an in-person assessment.",
  path: "/services/skin",
  keywords: ["skin care clinic in Mahuadanr", "acne treatment Mahuadanr"],
});

export default function SkinServicesPage() {
  return <ServiceCategoryView category="skin" />;
}

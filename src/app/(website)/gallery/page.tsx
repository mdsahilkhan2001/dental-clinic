import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { GalleryGrid } from "@/components/website/gallery-grid";
import { BeforeAfterGallery } from "@/components/website/before-after-slider";
import { SectionHeading } from "@/components/website/section-heading";
import { CTASection } from "@/components/website/cta-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getBeforeAfter, getGallery } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Clinic Gallery",
  description:
    "Photos of Jeevan Dental & Aesthetic Clinic in Mahuadanr — treatment rooms, equipment and the clinic environment.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [images, beforeAfter] = await Promise.all([
    getGallery(),
    getBeforeAfter(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageHero
        eyebrow="Gallery"
        title="Inside Jeevan Clinic"
        description="A look at our treatment rooms, equipment and clinic environment. Filter by category, and tap any image to view it larger."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ]}
      />

      <section className="section">
        <div className="container-page">
          <GalleryGrid images={images} />
        </div>
      </section>

      {beforeAfter.length > 0 && (
        <section className="section bg-surface">
          <div className="container-page">
            <SectionHeading
              eyebrow="Before & after"
              title="Treatment outcomes"
              description="Shared with patient consent. Results vary from person to person — drag the slider to compare."
            />
            <div className="mt-8">
              <BeforeAfterGallery items={beforeAfter} />
            </div>
          </div>
        </section>
      )}

      <CTASection
        heading="Like what you see?"
        body="Book a visit and experience the clinic for yourself."
      />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/website/hero";
import { QuickActionBar } from "@/components/website/quick-action-bar";
import { TrustStrip } from "@/components/website/trust-strip";
import { SectionHeading } from "@/components/website/section-heading";
import { ServiceGrid } from "@/components/website/service-grid";
import { DentalSpecialties } from "@/components/website/dental-specialties";
import { WhyChooseUs } from "@/components/website/why-choose-us";
import { DoctorCard } from "@/components/website/doctor-card";
import { GalleryGrid } from "@/components/website/gallery-grid";
import { BeforeAfterGallery } from "@/components/website/before-after-slider";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { FaqAccordion } from "@/components/website/faq-accordion";
import { CTASection } from "@/components/website/cta-section";
import { OpeningHours } from "@/components/website/opening-hours";
import { ContactCard } from "@/components/website/contact-card";
import { Reveal } from "@/components/website/reveal";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { JsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import { serviceCategories, siteConfig } from "@/lib/site";
import {
  getBeforeAfter,
  getClinicHours,
  getDentalSpecialties,
  getDoctors,
  getFaqs,
  getFeaturedServices,
  getGallery,
  getServices,
  getSiteContent,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage() {
  const [
    content,
    featuredServices,
    skinServices,
    hairServices,
    aestheticServices,
    specialties,
    doctors,
    gallery,
    beforeAfter,
    testimonials,
    faqs,
    hours,
  ] = await Promise.all([
    getSiteContent(),
    getFeaturedServices(6),
    getServices({ category: "skin" }),
    getServices({ category: "hair" }),
    getServices({ category: "aesthetic" }),
    getDentalSpecialties(),
    getDoctors(),
    getGallery(),
    getBeforeAfter(),
    getTestimonials({ limit: 6 }),
    getFaqs({ featuredOnly: true }),
    getClinicHours(),
  ]);

  const homeFaqs = faqs.slice(0, 6);

  return (
    <>
      {homeFaqs.length > 0 && <JsonLd data={faqJsonLd(homeFaqs)} />}

      <Hero content={content.hero} />
      <QuickActionBar />
      <TrustStrip />

      {/* About */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow">About the clinic</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">{content.about.heading}</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {content.about.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Personalized care",
                "Strict hygiene & sterilisation",
                "Patient comfort",
                "Clear communication",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-teal-100 text-accent">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/about">
                Learn More About Us
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </Reveal>

          <Reveal className="order-1 grid grid-cols-2 gap-4 lg:order-2" delay={100}>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <Image
                src="/images/clinic/operatory-room.jpg"
                alt="Treatment room at Jeevan Dental & Aesthetic Clinic"
                fill
                sizes="(max-width: 1024px) 45vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <Image
                src="/images/clinic/operatory-chair.jpg"
                alt="Dental chair and equipment at the clinic"
                fill
                sizes="(max-width: 1024px) 45vw, 25vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services overview */}
      <section className="section bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title="Four areas of care, one clinic"
            description="Explore treatments across dental, skin, hair and aesthetic care. Only services the clinic currently offers are listed."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((cat, i) => (
              <Reveal
                key={cat.slug}
                delay={i * 50}
                className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6"
              >
                <h3 className="text-lg">{cat.label}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.blurb}
                </p>
                <Link
                  href={cat.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  Explore {cat.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-xl">Popular treatments</h3>
            <div className="mt-5">
              <ServiceGrid services={featuredServices} showCategory columns={3} />
            </div>
            <Button asChild variant="ghost" className="mt-6">
              <Link href="/services">
                View all services
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <DentalSpecialties specialties={specialties} />

      {/* Skin & Hair */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Beyond dentistry"
            title="Skin & Hair Care"
            description="Consultation-led care for skin and hair concerns. Assessment is in person; treatment is planned around your individual needs."
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-xl text-accent">Skin Care</h3>
              <div className="mt-4">
                <ServiceGrid services={skinServices.slice(0, 4)} columns={2} />
              </div>
              <Link
                href="/services/skin"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                All skin services <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div>
              <h3 className="text-xl text-accent">Hair Care</h3>
              <div className="mt-4">
                <ServiceGrid services={hairServices.slice(0, 4)} columns={2} />
              </div>
              <Link
                href="/services/hair"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                All hair services <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <MedicalDisclaimer variant="suitability" className="mt-8" />
        </div>
      </section>

      {/* Aesthetic */}
      <section className="section bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Aesthetic care"
            title="Personalized aesthetic treatments"
            description="Elective facial aesthetic and cosmetic care, planned individually after an in-person assessment with realistic expectations set in advance."
          />
          <div className="mt-8">
            <ServiceGrid services={aestheticServices} columns={4} />
          </div>
        </div>
      </section>

      <WhyChooseUs items={content.whyChooseUs} />

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeading
              eyebrow="Our team"
              title="Meet the clinicians"
              description="Full clinician profiles, qualifications and registration details are published as provided by the clinic."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.slice(0, 3).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-6">
              <Link href="/doctor">
                View all doctors
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="section bg-surface">
          <div className="container-page">
            <SectionHeading
              eyebrow="Inside the clinic"
              title="Clinic gallery"
              description="A look at our treatment rooms and equipment."
            />
            <div className="mt-8">
              <GalleryGrid images={gallery.slice(0, 6)} />
            </div>
            <Button asChild variant="ghost" className="mt-6">
              <Link href="/gallery">
                Open full gallery
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Before & After */}
      {beforeAfter.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeading
              eyebrow="Before & after"
              title="Treatment outcomes"
              description="Shared with patient consent. Outcomes vary from person to person."
            />
            <div className="mt-8">
              <BeforeAfterGallery items={beforeAfter} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-surface">
          <div className="container-page">
            <SectionHeading
              eyebrow="Patient feedback"
              title="What our patients say"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-6">
              <Link href="/testimonials">
                See more reviews
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* FAQ */}
      {homeFaqs.length > 0 && (
        <section className="section">
          <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Good to know"
              title="Frequently asked questions"
              description="Answers to common questions about visiting the clinic. See the full list on the FAQ page."
            />
            <div>
              <FaqAccordion
                items={homeFaqs.map((f) => ({
                  question: f.question,
                  answer: f.answer,
                }))}
              />
              <Button asChild variant="ghost" className="mt-4">
                <Link href="/faq">
                  All FAQs
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <CTASection heading={content.cta.heading} body={content.cta.body} />

      {/* Location & Contact */}
      <section className="section bg-surface" id="location">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Find us"
              title="Visit Jeevan Clinic"
              description={siteConfig.address.full}
            />
            <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <iframe
                title={`Map showing ${siteConfig.name}`}
                src={siteConfig.maps.embed}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <ContactCard />
            <OpeningHours hours={hours} />
          </div>
        </div>
      </section>
    </>
  );
}

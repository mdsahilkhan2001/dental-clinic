import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/website/action-buttons";
import { HeroSlider, type HeroSlide } from "@/components/website/hero-slider";
import { siteConfig } from "@/lib/site";
import type { SiteContent } from "@/lib/content/defaults";

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/hero/hero-1.webp",
    alt: "Jeevan Dental & Aesthetic Clinic — modern treatment room for dental, skin, hair and aesthetic care in Mahuadanr, Latehar",
  },
  {
    src: "/images/hero/hero-2.webp",
    alt: "A clinician gently examining a smiling patient at Jeevan Dental & Aesthetic Clinic",
  },
];

export function Hero({ content }: { content: SiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full bg-teal-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-gold-100/60 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-12 pb-20 pt-10 md:pb-28 md:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="animate-[slide-up_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
          <p className="eyebrow">
            <Sparkles className="size-3.5" aria-hidden />
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            {content.headline}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            {content.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/appointment">
                {content.primaryCtaLabel}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <WhatsAppButton size="lg" label={content.secondaryCtaLabel} />
            <Button asChild variant="ghost" size="lg">
              <a
                href={siteConfig.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden />
                Get Directions
              </a>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
            <span>
              {siteConfig.address.line1}, {siteConfig.address.line2},{" "}
              {siteConfig.address.district}, {siteConfig.address.region}{" "}
              {siteConfig.address.postalCode}
            </span>
          </div>
        </div>

        <div className="relative animate-[fade-in_0.9s_ease_both]">
          <HeroSlider slides={HERO_SLIDES} />
           
        </div>
      </div>
    </section>
  );
}

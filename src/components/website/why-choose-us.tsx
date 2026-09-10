import {
  CalendarCheck,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import type { SiteContent } from "@/lib/content/defaults";

const ICONS = [
  UserRound,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  MapPin,
  CalendarCheck,
];

export function WhyChooseUs({
  items,
}: {
  items: SiteContent["whyChooseUs"];
}) {
  return (
    <section className="section bg-surface">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why choose us"
          title="Considered care, clearly explained"
          description="What patients can expect at every visit — no exaggerated claims, just how we work."
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Reveal
                key={item.title}
                delay={index * 50}
                className="rounded-[var(--radius-lg)] border border-border bg-background p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-teal-50 text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

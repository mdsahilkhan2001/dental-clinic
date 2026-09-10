import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import type { DentalSpecialtyRow } from "@/types/database";

export function DentalSpecialties({
  specialties,
}: {
  specialties: DentalSpecialtyRow[];
}) {
  if (specialties.length === 0) return null;

  return (
    <section className="section bg-navy-900 text-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Focused expertise"
          title={<span className="text-white">Our Dental Specialties</span>}
          description={
            <span className="text-navy-200">
              Areas of dental care we treat regularly, with planning and follow-up
              tailored to each patient.
            </span>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((item, index) => {
            const Card = (
              <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-navy-700">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-navy-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="inline-block rounded-full bg-gold-300/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-900">
                    {item.subtitle ?? "Dental"}
                  </span>
                  <h3 className="mt-2 flex items-center gap-1.5 text-lg text-white">
                    {item.title}
                    {item.href && (
                      <ArrowUpRight
                        className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden
                      />
                    )}
                  </h3>
                </div>
              </div>
            );

            return (
              <Reveal key={item.id} delay={index * 60}>
                {item.href ? (
                  <Link href={item.href} className="block">
                    {Card}
                  </Link>
                ) : (
                  Card
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

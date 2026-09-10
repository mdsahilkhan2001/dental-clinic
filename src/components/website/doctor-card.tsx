import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Stethoscope } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DoctorRow } from "@/types/database";

export function DoctorCard({
  doctor,
  className,
}: {
  doctor: DoctorRow;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
        {doctor.image_url ? (
          <Image
            src={doctor.image_url}
            alt={`Portrait of ${doctor.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-navy-300">
            <Stethoscope className="size-14" aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg">
          <Link
            href={`/doctor/${doctor.slug}`}
            className="after:absolute after:inset-0 group-hover:text-accent"
          >
            {doctor.name}
          </Link>
        </h3>
        {doctor.title && (
          <p className="mt-1 text-sm font-medium text-accent">{doctor.title}</p>
        )}
        {doctor.qualification && (
          <p className="mt-1 text-xs text-muted-foreground">
            {doctor.qualification}
          </p>
        )}
        {doctor.specialization && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {doctor.specialization}
          </p>
        )}
        <span className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
          View profile
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ServiceRow } from "@/types/database";

const CATEGORY_LABEL: Record<ServiceRow["category"], string> = {
  dental: "Dental Care",
  skin: "Skin Care",
  hair: "Hair Care",
  aesthetic: "Aesthetic Care",
};

const FALLBACK_IMAGE: Record<ServiceRow["category"], string> = {
  dental: "/images/clinic/operatory-unit.jpg",
  skin: "/images/clinic/operatory-room.jpg",
  hair: "/images/clinic/operatory-workstation.jpg",
  aesthetic: "/images/clinic/operatory-light.jpg",
};

export function ServiceCard({
  service,
  className,
  showCategory = false,
}: {
  service: ServiceRow;
  className?: string;
  showCategory?: boolean;
}) {
  const image = service.image_url || FALLBACK_IMAGE[service.category];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <Link
        href={`/services/${service.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {showCategory && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
            {CATEGORY_LABEL[service.category]}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg">
          <Link
            href={`/services/${service.slug}`}
            className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
          >
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.short_description}
        </p>
        <div className="relative z-10 mt-4 flex items-center gap-4 text-sm font-semibold">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            Learn more
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={`/appointment?service=${service.slug}`}
            className="inline-flex items-center gap-1 text-gold-700 hover:underline"
          >
            <CalendarPlus className="size-4" aria-hidden />
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

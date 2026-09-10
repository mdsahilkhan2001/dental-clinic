import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceCategories } from "@/lib/site";

/** Compact "Dental / Skin / Hair / Aesthetic" strip shown below the hero. */
export function TrustStrip() {
  return (
    <section
      aria-label="Care areas"
      className="container-page mt-6 md:mt-10"
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background sm:divide-y-0 md:grid-cols-4">
        {serviceCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.href}
            className="group flex items-center justify-center gap-2 px-3 py-4 text-center text-[13px] font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-surface hover:text-accent"
          >
            {cat.label}
            <ArrowRight
              className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GalleryImageRow } from "@/types/database";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  clinic: "Clinic",
  dental: "Dental",
  skin: "Skin",
  hair: "Hair",
  aesthetic: "Aesthetic",
  team: "Team",
  results: "Results",
};

export function GalleryGrid({ images }: { images: GalleryImageRow[] }) {
  const categories = React.useMemo(() => {
    const present = new Set(images.map((i) => i.category));
    return ["all", ...Object.keys(CATEGORY_LABELS).filter((c) => c !== "all" && present.has(c as GalleryImageRow["category"]))];
  }, [images]);

  const [active, setActive] = React.useState("all");
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  const filtered = React.useMemo(
    () =>
      active === "all"
        ? images
        : images.filter((i) => i.category === active),
    [images, active],
  );

  React.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((v) => (v === null ? v : (v + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setLightbox((v) =>
          v === null ? v : (v - 1 + filtered.length) % filtered.length,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, filtered.length]);

  if (images.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
        Photos are being added. Please check back soon.
      </p>
    );
  }

  const current = lightbox === null ? null : filtered[lightbox];

  return (
    <div>
      {categories.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-primary",
              )}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {filtered.map((image, index) => (
          <li key={image.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setLightbox(index)}
              className="group block w-full overflow-hidden rounded-[var(--radius-lg)] border border-border"
              aria-label={`View larger: ${image.title ?? image.alt_text}`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
            {image.title && (
              <p className="mt-1.5 px-1 text-xs text-muted-foreground">
                {image.title}
              </p>
            )}
          </li>
        ))}
      </ul>

      {current && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt_text}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            <X className="size-5" aria-hidden />
          </button>
          <figure
            className="max-h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.image_url}
              alt={current.alt_text}
              width={1400}
              height={1000}
              className="max-h-[80vh] w-auto rounded-[var(--radius-lg)] object-contain"
            />
            {current.title && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {current.title}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}

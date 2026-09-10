"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type HeroSlide = { src: string; alt: string };

export function HeroSlider({
  slides,
  interval = 6000,
  className,
}: {
  slides: HeroSlide[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = slides.length;

  const go = React.useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (count < 2 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval, paused]);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-muted shadow-[var(--shadow-elevated)]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Jeevan Dental & Aesthetic Clinic"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={i === 0 ? slide.alt : ""}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 48vw"
            className={cn(
              "object-cover object-center transition-transform duration-[7000ms] ease-linear motion-reduce:transition-none",
              i === index ? "scale-105" : "scale-100",
            )}
          />
        </div>
      ))}

      {/* Readability veil at the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/20 to-transparent"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/85 p-2 text-primary shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:bg-background sm:inline-flex"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/85 p-2 text-primary shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:bg-background sm:inline-flex"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-background"
                    : "w-1.5 bg-background/60 hover:bg-background/90",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

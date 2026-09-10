import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/website/action-buttons";
import { cn } from "@/lib/utils";

export function CTASection({
  heading,
  body,
  primaryHref = "/appointment",
  primaryLabel = "Book Appointment",
  className,
  tone = "navy",
}: {
  heading: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  className?: string;
  tone?: "navy" | "surface";
}) {
  return (
    <section className={cn("section", className)}>
      <div className="container-page">
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-12 text-center md:px-12 md:py-16",
            tone === "navy"
              ? "bg-navy-900 text-white"
              : "border border-border bg-surface text-primary",
          )}
        >
          {tone === "navy" && (
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-teal-500/20 blur-3xl"
            />
          )}
          <h2
            className={cn(
              "mx-auto max-w-2xl text-3xl sm:text-4xl",
              tone === "navy" && "text-white",
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "mx-auto mt-4 max-w-xl text-[15px] leading-relaxed",
              tone === "navy" ? "text-navy-200" : "text-muted-foreground",
            )}
          >
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <WhatsAppButton
              size="lg"
              variant={tone === "navy" ? "outline" : "whatsapp"}
              className={
                tone === "navy"
                  ? "border-white/30 text-white hover:border-white hover:text-white"
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

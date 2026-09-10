import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { TestimonialRow } from "@/types/database";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: TestimonialRow;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6",
        className,
      )}
    >
      <div
        className="flex items-center gap-1 text-gold-500"
        aria-label={`${testimonial.rating} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < testimonial.rating ? "fill-current" : "text-border",
            )}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
        “{testimonial.review}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <Avatar>
          {testimonial.photo_url && (
            <AvatarImage src={testimonial.photo_url} alt="" />
          )}
          <AvatarFallback>{initials(testimonial.patient_name)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-semibold text-primary">
            {testimonial.patient_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {[testimonial.service, testimonial.display_date
              ? formatDate(testimonial.display_date, { day: undefined })
              : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { MEDICAL_DISCLAIMER, SUITABILITY_DISCLAIMER } from "@/lib/site";

export function MedicalDisclaimer({
  variant = "general",
  className,
}: {
  variant?: "general" | "suitability";
  className?: string;
}) {
  const text =
    variant === "suitability" ? SUITABILITY_DISCLAIMER : MEDICAL_DISCLAIMER;
  return (
    <p
      className={cn(
        "flex gap-2.5 rounded-[var(--radius)] border border-border bg-surface px-4 py-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <span>{text}</span>
    </p>
  );
}

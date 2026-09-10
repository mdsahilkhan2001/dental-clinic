import { cn } from "@/lib/utils";
import type { ServiceRow } from "@/types/database";
import { ServiceCard } from "./service-card";

export function ServiceGrid({
  services,
  showCategory = false,
  className,
  columns = 3,
}: {
  services: ServiceRow[];
  showCategory?: boolean;
  className?: string;
  columns?: 2 | 3 | 4;
}) {
  if (services.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
        Services in this category are being finalised. Please contact the clinic
        for the current list.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NormalizedDayHours } from "@/lib/data";

export function OpeningHours({
  hours,
  className,
  highlightToday = true,
}: {
  hours: NormalizedDayHours[];
  className?: string;
  highlightToday?: boolean;
}) {
  const today = new Date().getDay();

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-background p-5",
        className,
      )}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
        <Clock className="size-4 text-accent" aria-hidden />
        Opening hours
      </h3>
      <dl className="mt-3 divide-y divide-border text-sm">
        {hours.map((day) => {
          const isToday = highlightToday && day.day_of_week === today;
          return (
            <div
              key={day.day_of_week}
              className={cn(
                "flex items-center justify-between gap-4 py-2",
                isToday && "font-semibold text-primary",
              )}
            >
              <dt className={isToday ? undefined : "text-muted-foreground"}>
                {day.label}
                {isToday && (
                  <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-teal-800">
                    Today
                  </span>
                )}
              </dt>
              <dd
                className={cn(
                  day.is_open ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {day.summary}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        Hours can vary on public holidays. Please call ahead to confirm.
      </p>
    </div>
  );
}

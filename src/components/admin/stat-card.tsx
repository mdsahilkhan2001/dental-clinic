import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: number | string;
  Icon?: LucideIcon;
  href?: string;
  tone?: "default" | "accent" | "gold" | "danger";
}) {
  const toneClass = {
    default: "text-navy-700 bg-navy-100",
    accent: "text-teal-800 bg-teal-100",
    gold: "text-gold-800 bg-gold-100",
    danger: "text-red-800 bg-red-100",
  }[tone];

  const body = (
    <div className="rounded-[var(--radius-lg)] border border-border bg-background p-5 transition-colors hover:border-navy-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full",
              toneClass,
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 font-serif text-3xl text-primary">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

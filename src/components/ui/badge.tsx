import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy-100 text-navy-800",
        accent: "border-transparent bg-teal-100 text-teal-800",
        gold: "border-transparent bg-gold-100 text-gold-800",
        outline: "border-border text-muted-foreground",
        success: "border-transparent bg-teal-100 text-teal-800",
        warning: "border-transparent bg-gold-100 text-gold-800",
        danger: "border-transparent bg-red-100 text-red-800",
        muted: "border-transparent bg-surface-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-card)] hover:bg-navy-700 hover:-translate-y-0.5",
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-card)] hover:bg-teal-700 hover:-translate-y-0.5",
        gold: "bg-gold-400 text-gold-foreground shadow-[var(--shadow-card)] hover:bg-gold-500 hover:-translate-y-0.5",
        outline:
          "border border-navy-200 bg-transparent text-primary hover:border-accent hover:text-accent",
        ghost: "text-primary hover:bg-surface",
        subtle: "bg-surface text-primary hover:bg-surface-muted",
        link: "text-accent underline-offset-4 hover:underline",
        whatsapp:
          "bg-[#1FA855] text-white shadow-[var(--shadow-card)] hover:bg-[#178c46] hover:-translate-y-0.5",
        destructive:
          "bg-danger text-white shadow-[var(--shadow-card)] hover:brightness-110",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-[13px]",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

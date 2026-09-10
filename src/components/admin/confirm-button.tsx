"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ActionResult = { ok: boolean; error?: string } | void;

export function ConfirmButton({
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  triggerLabel,
  triggerIcon,
  variant = "ghost",
  size = "sm",
  destructive = false,
  onDone,
}: {
  onConfirm: () => Promise<ActionResult>;
  title: string;
  description: string;
  confirmLabel?: string;
  triggerLabel: React.ReactNode;
  triggerIcon?: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  destructive?: boolean;
  onDone?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handle() {
    setPending(true);
    try {
      const res = await onConfirm();
      if (res && !res.ok) {
        toast.error(res.error ?? "Action failed.");
      } else {
        toast.success("Done.");
        setOpen(false);
        onDone?.();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {triggerIcon}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handle}
            disabled={pending}
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

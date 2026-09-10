"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/confirm-button";

type Result = { ok: boolean; error?: string };

/**
 * Row actions for admin list tables. Because this is a Client Component used
 * from Server Components, every prop is serializable: an id string, an
 * optional href, and bare Server Action references (never inline closures).
 */
export function RowActions({
  id,
  editHref,
  published,
  toggleAction,
  deleteAction,
  deleteTitle = "Delete this item?",
  deleteDescription = "This action cannot be undone.",
}: {
  id: string;
  editHref?: string;
  published?: boolean;
  toggleAction?: (id: string, published: boolean) => Promise<Result>;
  deleteAction: (id: string) => Promise<Result>;
  deleteTitle?: string;
  deleteDescription?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function toggle() {
    if (!toggleAction) return;
    setBusy(true);
    try {
      const res = await toggleAction(id, !published);
      if (res.ok) {
        toast.success(published ? "Hidden." : "Published.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {toggleAction && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          disabled={busy}
          aria-label={published ? "Hide" : "Publish"}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : published ? (
            <Eye className="size-4 text-teal-600" aria-hidden />
          ) : (
            <EyeOff className="size-4 text-muted-foreground" aria-hidden />
          )}
        </Button>
      )}
      {editHref && (
        <Button variant="ghost" size="icon" asChild aria-label="Edit">
          <Link href={editHref}>
            <Pencil className="size-4" aria-hidden />
          </Link>
        </Button>
      )}
      <ConfirmButton
        variant="ghost"
        size="icon"
        destructive
        triggerLabel=""
        triggerIcon={<Trash2 className="size-4 text-red-600" aria-hidden />}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel="Delete"
        onConfirm={() => deleteAction(id)}
        onDone={() => router.refresh()}
      />
    </div>
  );
}

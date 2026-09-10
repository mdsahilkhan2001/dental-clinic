"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckboxRow,
  Field,
  ImageField,
  Input,
} from "@/components/admin/form-kit";
import { PublishedBadge } from "@/components/admin/status-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  deleteGalleryImageAction,
  saveGalleryImageAction,
} from "@/app/actions/admin/content";
import type { GalleryCategory, GalleryImageRow } from "@/types/database";

const CATEGORIES: GalleryCategory[] = [
  "clinic",
  "dental",
  "skin",
  "hair",
  "aesthetic",
  "team",
  "results",
];

type Draft = Partial<GalleryImageRow>;

export function GalleryManager({ images }: { images: GalleryImageRow[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({});
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function edit(row?: GalleryImageRow) {
    setErrors({});
    setDraft(
      row ?? {
        category: "clinic",
        published: true,
        display_order: images.length + 1,
        alt_text: "",
        image_url: "",
      },
    );
    setOpen(true);
  }

  async function save() {
    setPending(true);
    setErrors({});
    try {
      const res = await saveGalleryImageAction({
        id: draft.id,
        image_url: draft.image_url ?? "",
        storage_path: draft.storage_path ?? "",
        title: draft.title ?? "",
        category: draft.category ?? "clinic",
        alt_text: draft.alt_text ?? "",
        display_order: draft.display_order ?? 0,
        published: draft.published ?? true,
      });
      if (res.ok) {
        toast.success("Saved.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="default" size="sm" onClick={() => edit()}>
          <Plus aria-hidden /> Add image
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          No images yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background"
            >
              <div className="relative aspect-[4/3] bg-surface">
                <Image
                  src={img.image_url}
                  alt={img.alt_text}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-primary">
                    {img.title || "Untitled"}
                  </p>
                  <PublishedBadge published={img.published} />
                </div>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {img.category} · order {img.display_order}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => edit(img)}
                  >
                    <Pencil className="size-4" aria-hidden /> Edit
                  </Button>
                  <ConfirmButton
                    variant="ghost"
                    size="sm"
                    destructive
                    triggerLabel="Delete"
                    title="Delete this image?"
                    description="The image is removed from the gallery and from storage."
                    confirmLabel="Delete"
                    onConfirm={() => deleteGalleryImageAction(img.id)}
                    onDone={() => router.refresh()}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit image" : "Add image"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageField
              label="Image"
              bucket="gallery"
              required
              error={errors.image_url}
              value={draft.image_url ?? ""}
              onChange={(url, path) =>
                setDraft((d) => ({ ...d, image_url: url, storage_path: path ?? d.storage_path }))
              }
            />
            <Field label="Title" htmlFor="g-title">
              <Input
                id="g-title"
                value={draft.title ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </Field>
            <Field
              label="Alt text"
              htmlFor="g-alt"
              required
              error={errors.alt_text}
              hint="Describe the image for screen readers."
            >
              <Input
                id="g-alt"
                value={draft.alt_text ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, alt_text: e.target.value }))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" htmlFor="g-cat">
                <select
                  id="g-cat"
                  value={draft.category ?? "clinic"}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      category: e.target.value as GalleryCategory,
                    }))
                  }
                  className="h-11 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm capitalize"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Display order" htmlFor="g-order">
                <Input
                  id="g-order"
                  type="number"
                  min={0}
                  value={draft.display_order ?? 0}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      display_order: Number(e.target.value),
                    }))
                  }
                />
              </Field>
            </div>
            <CheckboxRow
              label="Published"
              checked={draft.published ?? true}
              onChange={(c) => setDraft((d) => ({ ...d, published: c }))}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button onClick={save} disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

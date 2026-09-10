"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckboxRow,
  Field,
  Input,
  Textarea,
} from "@/components/admin/form-kit";
import { PublishedBadge } from "@/components/admin/status-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from "@/app/actions/admin/content";
import type { TestimonialRow } from "@/types/database";

type Draft = Partial<TestimonialRow>;

export function TestimonialsManager({
  testimonials,
}: {
  testimonials: TestimonialRow[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({});
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function edit(row?: TestimonialRow) {
    setErrors({});
    setDraft(
      row ?? {
        rating: 5,
        published: false,
        display_order: testimonials.length + 1,
        patient_name: "",
        review: "",
      },
    );
    setOpen(true);
  }

  async function save() {
    setPending(true);
    setErrors({});
    try {
      const res = await saveTestimonialAction({
        id: draft.id,
        patient_name: draft.patient_name ?? "",
        rating: draft.rating ?? 5,
        review: draft.review ?? "",
        service: draft.service ?? "",
        photo_url: draft.photo_url ?? "",
        display_date: draft.display_date ?? "",
        published: draft.published ?? false,
        display_order: draft.display_order ?? 0,
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
          <Plus aria-hidden /> Add testimonial
        </Button>
      </div>

      <p className="rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
        Only publish genuine feedback shared by patients. Do not add fabricated
        or incentivised reviews.
      </p>

      <div className="rounded-[var(--radius-lg)] border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No testimonials yet.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <p className="font-medium text-primary">{t.patient_name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {t.review}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-0.5 text-gold-500">
                      {t.rating}
                      <Star className="size-3.5 fill-current" aria-hidden />
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.service ?? "—"}
                  </TableCell>
                  <TableCell>
                    <PublishedBadge published={t.published} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => edit(t)}>
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <ConfirmButton
                        variant="ghost"
                        size="icon"
                        destructive
                        triggerLabel=""
                        triggerIcon={<span className="text-xs text-red-600">Del</span>}
                        title="Delete testimonial?"
                        description="This permanently removes the review."
                        confirmLabel="Delete"
                        onConfirm={() => deleteTestimonialAction(t.id)}
                        onDone={() => router.refresh()}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {draft.id ? "Edit testimonial" : "Add testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Patient name" htmlFor="t-name" required error={errors.patient_name}>
              <Input
                id="t-name"
                value={draft.patient_name ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, patient_name: e.target.value }))
                }
              />
            </Field>
            <Field label="Review" htmlFor="t-review" required error={errors.review}>
              <Textarea
                id="t-review"
                rows={4}
                value={draft.review ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, review: e.target.value }))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating" htmlFor="t-rating">
                <select
                  id="t-rating"
                  value={draft.rating ?? 5}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, rating: Number(e.target.value) }))
                  }
                  className="h-11 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Display date" htmlFor="t-date">
                <Input
                  id="t-date"
                  type="date"
                  value={draft.display_date ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, display_date: e.target.value }))
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service (optional)" htmlFor="t-service">
                <Input
                  id="t-service"
                  value={draft.service ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, service: e.target.value }))
                  }
                />
              </Field>
              <Field label="Display order" htmlFor="t-order">
                <Input
                  id="t-order"
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
              description="Show on the website."
              checked={draft.published ?? false}
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

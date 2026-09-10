"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { deleteFaqAction, saveFaqAction } from "@/app/actions/admin/content";
import type { FaqCategory, FaqRow } from "@/types/database";

const CATEGORIES: FaqCategory[] = [
  "general",
  "appointments",
  "dental",
  "skin",
  "hair",
  "aesthetic",
];

type Draft = Partial<FaqRow>;

export function FaqsManager({ faqs }: { faqs: FaqRow[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({});
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function edit(row?: FaqRow) {
    setErrors({});
    setDraft(
      row ?? {
        category: "general",
        featured: false,
        published: true,
        display_order: faqs.length + 1,
        question: "",
        answer: "",
      },
    );
    setOpen(true);
  }

  async function save() {
    setPending(true);
    setErrors({});
    try {
      const res = await saveFaqAction({
        id: draft.id,
        question: draft.question ?? "",
        answer: draft.answer ?? "",
        category: draft.category ?? "general",
        featured: draft.featured ?? false,
        published: draft.published ?? true,
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
          <Plus aria-hidden /> Add FAQ
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Home</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No FAQs yet.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-md">
                    <p className="font-medium text-primary">{f.question}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {f.answer}
                    </p>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {f.category}
                  </TableCell>
                  <TableCell>
                    {f.featured ? <Badge variant="gold">Featured</Badge> : "—"}
                  </TableCell>
                  <TableCell>
                    <PublishedBadge published={f.published} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => edit(f)}>
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <ConfirmButton
                        variant="ghost"
                        size="icon"
                        destructive
                        triggerLabel=""
                        triggerIcon={<span className="text-xs text-red-600">Del</span>}
                        title="Delete FAQ?"
                        description="This removes the question from the site."
                        confirmLabel="Delete"
                        onConfirm={() => deleteFaqAction(f.id)}
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
            <DialogTitle>{draft.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Question" htmlFor="f-q" required error={errors.question}>
              <Input
                id="f-q"
                value={draft.question ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, question: e.target.value }))
                }
              />
            </Field>
            <Field label="Answer" htmlFor="f-a" required error={errors.answer}>
              <Textarea
                id="f-a"
                rows={4}
                value={draft.answer ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, answer: e.target.value }))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" htmlFor="f-cat">
                <select
                  id="f-cat"
                  value={draft.category ?? "general"}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      category: e.target.value as FaqCategory,
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
              <Field label="Display order" htmlFor="f-order">
                <Input
                  id="f-order"
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
              label="Show on homepage"
              description="Featured FAQs appear in the homepage FAQ section."
              checked={draft.featured ?? false}
              onChange={(c) => setDraft((d) => ({ ...d, featured: c }))}
            />
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

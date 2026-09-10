"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  CheckboxRow,
  Field,
  ImageField,
  Input,
  SubmitBar,
  Textarea,
} from "@/components/admin/form-kit";
import { slugify } from "@/lib/utils";
import { saveServiceAction } from "@/app/actions/admin/services";
import type { ServiceCategory, ServiceRow } from "@/types/database";

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "dental", label: "Dental" },
  { value: "skin", label: "Skin" },
  { value: "hair", label: "Hair" },
  { value: "aesthetic", label: "Aesthetic" },
];

export function ServiceForm({ service }: { service?: ServiceRow }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    title: service?.title ?? "",
    slug: service?.slug ?? "",
    category: service?.category ?? ("dental" as ServiceCategory),
    short_description: service?.short_description ?? "",
    description: service?.description ?? "",
    image_url: service?.image_url ?? "",
    suitable_for: (service?.suitable_for ?? []).join("\n"),
    procedure_steps: (service?.procedure_steps ?? []).join("\n"),
    benefits: (service?.benefits ?? []).join("\n"),
    featured: service?.featured ?? false,
    published: service?.published ?? true,
    display_order: service?.display_order ?? 0,
    meta_title: service?.meta_title ?? "",
    meta_description: service?.meta_description ?? "",
  });
  const [faqs, setFaqs] = React.useState(service?.faqs ?? []);
  const [slugTouched, setSlugTouched] = React.useState(Boolean(service));

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await saveServiceAction({
        id: service?.id,
        ...form,
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      });
      if (res.ok) {
        toast.success("Service saved.");
        router.push("/admin/services");
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-6 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" required error={errors.title}>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="slug"
          required
          error={errors.slug}
          hint="URL: /services/<slug>"
        >
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
        </Field>
        <Field label="Category" htmlFor="category" required error={errors.category}>
          <select
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value as ServiceCategory)}
            className="h-11 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Display order"
          htmlFor="display_order"
          error={errors.display_order}
        >
          <Input
            id="display_order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => set("display_order", Number(e.target.value))}
          />
        </Field>
        <Field
          label="Short description"
          htmlFor="short_description"
          required
          error={errors.short_description}
          className="sm:col-span-2"
          hint="One or two sentences, shown on cards and listings."
        >
          <Textarea
            id="short_description"
            rows={2}
            value={form.short_description}
            onChange={(e) => set("short_description", e.target.value)}
          />
        </Field>
        <Field
          label="Full description"
          htmlFor="description"
          error={errors.description}
          className="sm:col-span-2"
          hint="Shown as the Overview on the service page."
        >
          <Textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <ImageField
            label="Image"
            bucket="services"
            value={form.image_url}
            onChange={(url) => set("image_url", url)}
            hint="Used as the hero image on the service page and on cards."
          />
        </div>
      </div>

      <div className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-6 sm:grid-cols-3">
        <Field
          label="Suitable for"
          htmlFor="suitable_for"
          hint="One item per line"
        >
          <Textarea
            id="suitable_for"
            rows={5}
            value={form.suitable_for}
            onChange={(e) => set("suitable_for", e.target.value)}
          />
        </Field>
        <Field
          label="Treatment steps"
          htmlFor="procedure_steps"
          hint="One step per line"
        >
          <Textarea
            id="procedure_steps"
            rows={5}
            value={form.procedure_steps}
            onChange={(e) => set("procedure_steps", e.target.value)}
          />
        </Field>
        <Field label="Benefits" htmlFor="benefits" hint="One benefit per line">
          <Textarea
            id="benefits"
            rows={5}
            value={form.benefits}
            onChange={(e) => set("benefits", e.target.value)}
          />
        </Field>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Service FAQs</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFaqs((f) => [...f, { question: "", answer: "" }])}
          >
            <Plus className="size-4" aria-hidden />
            Add
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {faqs.length === 0 && (
            <p className="text-sm text-muted-foreground">No FAQs added.</p>
          )}
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-[var(--radius)] border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Input
                    value={faq.question}
                    placeholder="Question"
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, question: e.target.value } : f,
                        ),
                      )
                    }
                  />
                  <Textarea
                    value={faq.answer}
                    rows={2}
                    placeholder="Answer"
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, answer: e.target.value } : f,
                        ),
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove FAQ"
                  onClick={() =>
                    setFaqs((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="size-4 text-red-600" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-6 sm:grid-cols-2">
        <Field label="SEO title" htmlFor="meta_title" error={errors.meta_title}>
          <Input
            id="meta_title"
            value={form.meta_title}
            onChange={(e) => set("meta_title", e.target.value)}
          />
        </Field>
        <Field
          label="SEO description"
          htmlFor="meta_description"
          error={errors.meta_description}
        >
          <Input
            id="meta_description"
            value={form.meta_description}
            onChange={(e) => set("meta_description", e.target.value)}
          />
        </Field>
        <CheckboxRow
          label="Featured"
          description="Highlight on the homepage 'popular treatments' section."
          checked={form.featured}
          onChange={(c) => set("featured", c)}
        />
        <CheckboxRow
          label="Published"
          description="Visible on the website and bookable."
          checked={form.published}
          onChange={(c) => set("published", c)}
        />
      </div>

      <SubmitBar
        pending={pending}
        label={service ? "Save changes" : "Create service"}
        onCancel={() => router.push("/admin/services")}
      />
    </form>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  CheckboxRow,
  Field,
  ImageField,
  Input,
  SubmitBar,
  Textarea,
} from "@/components/admin/form-kit";
import { slugify } from "@/lib/utils";
import { saveDoctorAction } from "@/app/actions/admin/doctors";
import type { DoctorRow } from "@/types/database";

export function DoctorForm({ doctor }: { doctor?: DoctorRow }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = React.useState(Boolean(doctor));

  const [form, setForm] = React.useState({
    name: doctor?.name ?? "",
    slug: doctor?.slug ?? "",
    title: doctor?.title ?? "",
    qualification: doctor?.qualification ?? "",
    specialization: doctor?.specialization ?? "",
    experience: doctor?.experience ?? "",
    bio: doctor?.bio ?? "",
    image_url: doctor?.image_url ?? "",
    languages: (doctor?.languages ?? []).join("\n"),
    services: (doctor?.services ?? []).join("\n"),
    published: doctor?.published ?? true,
    display_order: doctor?.display_order ?? 0,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await saveDoctorAction({ id: doctor?.id, ...form });
      if (res.ok) {
        toast.success("Doctor saved.");
        router.push("/admin/doctors");
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
        <Field label="Name" htmlFor="name" required error={errors.name}>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Slug" htmlFor="slug" required error={errors.slug} hint="URL: /doctor/<slug>">
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
        </Field>
        <Field label="Professional title" htmlFor="title" error={errors.title}>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Dental Surgeon"
          />
        </Field>
        <Field label="Display order" htmlFor="display_order">
          <Input
            id="display_order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => set("display_order", Number(e.target.value))}
          />
        </Field>
        <Field label="Qualification" htmlFor="qualification" error={errors.qualification}>
          <Input
            id="qualification"
            value={form.qualification}
            onChange={(e) => set("qualification", e.target.value)}
            placeholder="e.g. BDS, MDS"
          />
        </Field>
        <Field label="Specialization" htmlFor="specialization" error={errors.specialization}>
          <Input
            id="specialization"
            value={form.specialization}
            onChange={(e) => set("specialization", e.target.value)}
          />
        </Field>
        <Field label="Experience" htmlFor="experience" error={errors.experience}>
          <Input
            id="experience"
            value={form.experience}
            onChange={(e) => set("experience", e.target.value)}
            placeholder="e.g. 8 years"
          />
        </Field>
        <Field label="Bio" htmlFor="bio" error={errors.bio} className="sm:col-span-2" hint="One paragraph per line.">
          <Textarea
            id="bio"
            rows={5}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <ImageField
            label="Photo"
            bucket="doctors"
            value={form.image_url}
            onChange={(url) => set("image_url", url)}
          />
        </div>
        <Field label="Languages" htmlFor="languages" hint="One per line">
          <Textarea
            id="languages"
            rows={3}
            value={form.languages}
            onChange={(e) => set("languages", e.target.value)}
          />
        </Field>
        <Field label="Services" htmlFor="services" hint="One per line">
          <Textarea
            id="services"
            rows={3}
            value={form.services}
            onChange={(e) => set("services", e.target.value)}
          />
        </Field>
        <CheckboxRow
          label="Published"
          description="Visible on the website."
          checked={form.published}
          onChange={(c) => set("published", c)}
        />
      </div>

      <SubmitBar
        pending={pending}
        label={doctor ? "Save changes" : "Create doctor"}
        onCancel={() => router.push("/admin/doctors")}
      />
    </form>
  );
}

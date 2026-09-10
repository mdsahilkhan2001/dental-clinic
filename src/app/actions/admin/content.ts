"use server";

import { revalidatePath } from "next/cache";

import {
  clinicHoursSchema,
  faqSchema,
  siteContentSchema,
  testimonialSchema,
  gallerySchema,
  dentalSpecialtySchema,
} from "@/lib/validations/admin";
import { ActionResult, dbError, ensureAdmin, zodFieldErrors } from "./_helpers";

/* -------------------------------------------------------------- Site content */

export async function saveSiteContentAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;

  const parsed = siteContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }
  const c = parsed.data;
  const rows = [
    { key: "hero", value: c.hero },
    { key: "about", value: c.about },
    { key: "why_choose_us", value: { items: c.whyChooseUs } },
    { key: "cta", value: c.cta },
    { key: "footer", value: { note: c.footerNote } },
    { key: "social", value: c.social },
  ];
  const { error } = await guard.supabase
    .from("site_content")
    .upsert(rows, { onConflict: "key" });
  if (error) return dbError();

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");
  return { ok: true };
}

/* -------------------------------------------------------------- Clinic hours */

export async function saveClinicHoursAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;

  const parsed = clinicHoursSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the opening hours you entered." };
  }
  const { error } = await guard.supabase
    .from("clinic_hours")
    .upsert(parsed.data.days, { onConflict: "day_of_week" });
  if (error) return dbError();

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/appointment");
  revalidatePath("/admin/settings");
  return { ok: true };
}

/* -------------------------------------------------------------------- FAQs */

function revalidateFaqRoutes() {
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/services/dental");
  revalidatePath("/services/skin");
  revalidatePath("/services/hair");
  revalidatePath("/services/aesthetic");
  revalidatePath("/admin/faqs");
}

export async function saveFaqAction(input: unknown): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }
  const { id, ...values } = parsed.data;
  const { error } = id
    ? await guard.supabase.from("faqs").update(values).eq("id", id)
    : await guard.supabase.from("faqs").insert(values);
  if (error) return dbError();
  revalidateFaqRoutes();
  return { ok: true };
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase.from("faqs").delete().eq("id", id);
  if (error) return dbError("Could not delete this FAQ.");
  revalidateFaqRoutes();
  return { ok: true };
}

/* ------------------------------------------------------------- Testimonials */

export async function saveTestimonialAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }
  const { id, ...values } = parsed.data;
  const { error } = id
    ? await guard.supabase.from("testimonials").update(values).eq("id", id)
    : await guard.supabase.from("testimonials").insert(values);
  if (error) return dbError();
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

export async function deleteTestimonialAction(
  id: string,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase
    .from("testimonials")
    .delete()
    .eq("id", id);
  if (error) return dbError("Could not delete this testimonial.");
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

/* ----------------------------------------------------------------- Gallery */

function revalidateGalleryRoutes() {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function saveGalleryImageAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }
  const { id, ...values } = parsed.data;
  const { error } = id
    ? await guard.supabase.from("gallery_images").update(values).eq("id", id)
    : await guard.supabase.from("gallery_images").insert(values);
  if (error) return dbError();
  revalidateGalleryRoutes();
  return { ok: true };
}

export async function deleteGalleryImageAction(
  id: string,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { data: row } = await guard.supabase
    .from("gallery_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  const { error } = await guard.supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);
  if (error) return dbError("Could not delete this image.");
  if (row?.storage_path) {
    await guard.supabase.storage.from("gallery").remove([row.storage_path]);
  }
  revalidateGalleryRoutes();
  return { ok: true };
}

/* ----------------------------------------------------- Dental specialties */

export async function saveSpecialtyAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const parsed = dentalSpecialtySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }
  const { id, ...values } = parsed.data;
  const { error } = id
    ? await guard.supabase
        .from("dental_specialties")
        .update(values)
        .eq("id", id)
    : await guard.supabase.from("dental_specialties").insert(values);
  if (error) return dbError();
  revalidatePath("/");
  revalidatePath("/admin/content");
  return { ok: true };
}

export async function deleteSpecialtyAction(id: string): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase
    .from("dental_specialties")
    .delete()
    .eq("id", id);
  if (error) return dbError("Could not delete this specialty.");
  revalidatePath("/");
  revalidatePath("/admin/content");
  return { ok: true };
}

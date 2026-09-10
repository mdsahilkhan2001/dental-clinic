"use server";

import { revalidatePath } from "next/cache";

import { serviceSchema } from "@/lib/validations/admin";
import { ActionResult, dbError, ensureAdmin, zodFieldErrors } from "./_helpers";

function revalidateServiceRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/services/dental");
  revalidatePath("/services/skin");
  revalidatePath("/services/hair");
  revalidatePath("/services/aesthetic");
  revalidatePath("/admin/services");
  revalidatePath("/appointment");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function saveServiceAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;

  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }

  const { id, ...values } = parsed.data;
  const payload = {
    ...values,
    faqs: values.faqs ?? [],
  };

  try {
    if (id) {
      const { error } = await guard.supabase
        .from("services")
        .update(payload)
        .eq("id", id);
      if (error) {
        if (error.code === "23505")
          return { ok: false, error: "That slug is already in use." };
        return dbError();
      }
      revalidateServiceRoutes(values.slug);
      return { ok: true, data: { id } };
    }

    const { data, error } = await guard.supabase
      .from("services")
      .insert(payload)
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505")
        return { ok: false, error: "That slug is already in use." };
      return dbError();
    }
    revalidateServiceRoutes(values.slug);
    return { ok: true, data: { id: data!.id } };
  } catch {
    return dbError();
  }
}

export async function toggleServicePublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase
    .from("services")
    .update({ published })
    .eq("id", id);
  if (error) return dbError();
  revalidateServiceRoutes();
  return { ok: true };
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase.from("services").delete().eq("id", id);
  if (error) return dbError("Could not delete this service.");
  revalidateServiceRoutes();
  return { ok: true };
}

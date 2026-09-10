"use server";

import { revalidatePath } from "next/cache";

import { doctorSchema } from "@/lib/validations/admin";
import { ActionResult, dbError, ensureAdmin, zodFieldErrors } from "./_helpers";

function revalidateDoctorRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/doctor");
  revalidatePath("/admin/doctors");
  revalidatePath("/appointment");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/doctor/${slug}`);
}

export async function saveDoctorAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;

  const parsed = doctorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error.issues),
    };
  }

  const { id, ...values } = parsed.data;

  try {
    if (id) {
      const { error } = await guard.supabase
        .from("doctors")
        .update(values)
        .eq("id", id);
      if (error) {
        if (error.code === "23505")
          return { ok: false, error: "That slug is already in use." };
        return dbError();
      }
      revalidateDoctorRoutes(values.slug);
      return { ok: true, data: { id } };
    }
    const { data, error } = await guard.supabase
      .from("doctors")
      .insert(values)
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505")
        return { ok: false, error: "That slug is already in use." };
      return dbError();
    }
    revalidateDoctorRoutes(values.slug);
    return { ok: true, data: { id: data!.id } };
  } catch {
    return dbError();
  }
}

export async function toggleDoctorPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase
    .from("doctors")
    .update({ published })
    .eq("id", id);
  if (error) return dbError();
  revalidateDoctorRoutes();
  return { ok: true };
}

export async function deleteDoctorAction(id: string): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase.from("doctors").delete().eq("id", id);
  if (error) return dbError("Could not delete this doctor.");
  revalidateDoctorRoutes();
  return { ok: true };
}

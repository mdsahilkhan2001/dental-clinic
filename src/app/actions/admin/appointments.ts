"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { appointmentStatusSchema } from "@/lib/validations/shared";
import { ActionResult, dbError, ensureAdmin } from "./_helpers";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: appointmentStatusSchema,
});

export async function updateAppointmentStatusAction(
  input: unknown,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  // When confirming, guard against a slot clash with another active appointment.
  if (parsed.data.status === "confirmed") {
    const { data: current } = await guard.supabase
      .from("appointments")
      .select("appointment_date, appointment_time")
      .eq("id", parsed.data.id)
      .single();
    if (current) {
      const { data: clash } = await guard.supabase
        .from("appointments")
        .select("id")
        .eq("appointment_date", current.appointment_date)
        .eq("appointment_time", current.appointment_time)
        .in("status", ["confirmed"])
        .neq("id", parsed.data.id);
      if (clash && clash.length > 0) {
        return {
          ok: false,
          error:
            "Another appointment is already confirmed for that date and time.",
        };
      }
    }
  }

  const { error } = await guard.supabase
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "That date and time already has an active appointment.",
      };
    }
    return dbError("Could not update the appointment.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  return { ok: true };
}

export async function deleteAppointmentAction(
  id: string,
): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard;
  const { error } = await guard.supabase
    .from("appointments")
    .delete()
    .eq("id", id);
  if (error) return dbError("Could not delete the appointment.");
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  return { ok: true };
}

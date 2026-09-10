"use server";

import { revalidatePath } from "next/cache";

import { appointmentFormSchema } from "@/lib/validations/appointment";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDoctors, getServices } from "@/lib/data";
import { isSlotFree } from "@/lib/appointments";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { buildAppointmentReference } from "@/lib/utils";

export interface AppointmentActionResult {
  ok: boolean;
  persisted?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  appointment?: {
    reference: string;
    patient_name: string;
    service_label: string;
    doctor_label: string | null;
    appointment_date: string;
    appointment_time: string;
  };
}

export async function createAppointmentAction(
  input: unknown,
): Promise<AppointmentActionResult> {
  const parsed = appointmentFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return {
      ok: false,
      error: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot — silently accept but do nothing.
  if (data.company) {
    return {
      ok: true,
      persisted: false,
      appointment: {
        reference: "JDA-000000",
        patient_name: data.patient_name,
        service_label: "",
        doctor_label: null,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
      },
    };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`appointment:${ip}`, { limit: 5, windowMs: 600_000 });
  if (!limited.success) {
    return {
      ok: false,
      error: `Too many requests. Please try again in ${Math.ceil(
        limited.retryAfter / 60,
      )} minute(s), or contact us on WhatsApp.`,
    };
  }

  const [services, doctors] = await Promise.all([getServices(), getDoctors()]);
  const service = services.find((s) => s.slug === data.service_slug);
  if (!service) {
    return {
      ok: false,
      error: "That service is no longer available. Please choose another.",
      fieldErrors: { service_slug: "Please choose a valid service" },
    };
  }
  const doctor = data.doctor_slug
    ? doctors.find((d) => d.slug === data.doctor_slug) ?? null
    : null;

  // Server-side slot validation (never trust the client).
  const slotFree = await isSlotFree(data.appointment_date, data.appointment_time);
  if (!slotFree) {
    return {
      ok: false,
      error:
        "Sorry, that time is no longer available. Please pick another slot.",
      fieldErrors: { appointment_time: "This slot is no longer available" },
    };
  }

  const base = {
    reference: "",
    patient_name: data.patient_name,
    service_label: service.title,
    doctor_label: doctor?.name ?? null,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
  };

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      persisted: false,
      appointment: {
        ...base,
        reference: buildAppointmentReference(
          `${data.appointment_date}${data.appointment_time}${Date.now()}`,
        ),
      },
    };
  }

  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: data.patient_name,
        phone: data.phone,
        email: data.email,
        service_id: service.id.length === 36 ? service.id : null,
        service_label: service.title,
        doctor_id: doctor && doctor.id.length === 36 ? doctor.id : null,
        doctor_label: doctor?.name ?? null,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        message: data.message,
        consent: data.consent,
        status: "pending",
        source: "website",
      })
      .select("id, reference")
      .single();

    if (error) {
      // 23505 = unique_violation → slot taken between check and insert.
      if (error.code === "23505") {
        return {
          ok: false,
          error:
            "That time was just booked by someone else. Please choose another slot.",
          fieldErrors: { appointment_time: "This slot is no longer available" },
        };
      }
      return {
        ok: false,
        error:
          "We couldn't save your request just now. Please try again or contact us on WhatsApp.",
      };
    }

    revalidatePath("/appointment");
    revalidatePath("/admin/appointments");

    return {
      ok: true,
      persisted: true,
      appointment: {
        ...base,
        reference:
          inserted?.reference ?? buildAppointmentReference(inserted?.id ?? ""),
      },
    };
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong. Please try again, or contact us on WhatsApp.",
    };
  }
}

"use server";

import { contactFormSchema } from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export interface ContactActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  persisted?: boolean;
}

export async function submitContactAction(
  input: unknown,
): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { ok: false, error: "Please check the form.", fieldErrors };
  }

  const data = parsed.data;
  if (data.company) return { ok: true, persisted: false };

  const ip = await getClientIp();
  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 600_000 });
  if (!limited.success) {
    return {
      ok: false,
      error: "Too many messages. Please try again later or call the clinic.",
    };
  }

  if (!isSupabaseConfigured) {
    return { ok: true, persisted: false };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      message: data.message,
      consent: data.consent,
      status: "new",
      source: "contact_form",
    });
    if (error) {
      return {
        ok: false,
        error:
          "We couldn't send your message. Please try again or contact us on WhatsApp.",
      };
    }
    return { ok: true, persisted: true };
  } catch {
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

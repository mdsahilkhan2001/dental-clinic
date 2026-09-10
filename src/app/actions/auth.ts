"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/lib/validations/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

export async function signInAction(
  input: unknown,
  redirectTo = "/admin",
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error:
        "Authentication is not configured. Add your Supabase environment variables to enable the admin area.",
    };
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email and password." };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`login:${ip}`, { limit: 8, windowMs: 900_000 });
  if (!limited.success) {
    return {
      ok: false,
      error: `Too many attempts. Please wait ${Math.ceil(
        limited.retryAfter / 60,
      )} minute(s) and try again.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, error: "Incorrect email or password." };
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "This account is not authorised for the admin area.",
    };
  }

  const safePath = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safePath);
}

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

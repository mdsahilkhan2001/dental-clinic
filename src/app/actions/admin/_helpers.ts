import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole } from "@/lib/supabase/config";
import { getAdminSession } from "@/lib/auth";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

type AdminGuard =
  | { ok: true; supabase: SupabaseClient<Database>; userId: string }
  | { ok: false; error: string };

/**
 * Authorises the caller as a clinic admin and returns a service-role client
 * for the write. Every admin action must call this first.
 */
export async function ensureAdmin(): Promise<AdminGuard> {
  if (!hasServiceRole) {
    return {
      ok: false,
      error:
        "Supabase is not fully configured. Set SUPABASE_SERVICE_ROLE_KEY to enable admin changes.",
    };
  }
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }
  return { ok: true, supabase: createAdminClient(), userId: session.userId };
}

export function zodFieldErrors(
  issues: { path: (string | number)[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export function dbError(message = "Could not save your changes. Please try again."): {
  ok: false;
  error: string;
} {
  return { ok: false, error: message };
}

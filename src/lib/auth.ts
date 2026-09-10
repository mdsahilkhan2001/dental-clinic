import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AdminUserRow } from "@/types/database";

export type AdminSession = {
  userId: string;
  email: string;
  admin: AdminUserRow;
};

/** Returns the signed-in admin, or null. Never throws. */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: admin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!admin) return null;
    return { userId: user.id, email: user.email ?? admin.email, admin };
  } catch {
    return null;
  }
}

/**
 * Guard for admin pages / layouts. Redirects to the login screen when the
 * visitor is not an authorised admin. This is the authoritative server-side
 * check (the proxy is only a first gate).
 */
export async function requireAdmin(redirectTo = "/admin"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect(`/admin/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
  return session;
}

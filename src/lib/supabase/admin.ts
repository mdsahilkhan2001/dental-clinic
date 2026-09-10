import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  hasServiceRole,
} from "./config";

/**
 * Service-role client. NEVER import this into client components — it is
 * guarded by `server-only`. Used for admin write paths and storage uploads
 * that must bypass RLS after an explicit server-side authorization check.
 */
export function createAdminClient() {
  if (!hasServiceRole) {
    throw new Error(
      "Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

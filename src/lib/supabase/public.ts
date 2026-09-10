import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Cookie-less anon client for reading PUBLIC content in server components.
 * Because it never touches `cookies()`, pages that only use this stay
 * statically renderable / ISR-cacheable. RLS "public read" policies apply.
 */
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function getPublicClient() {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

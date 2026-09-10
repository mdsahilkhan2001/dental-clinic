/**
 * Supabase credentials. Both the legacy names and Supabase's newer API-key
 * names are accepted, so either style of `.env` works:
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY       | NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *   SUPABASE_SERVICE_ROLE_KEY           | SUPABASE_SECRET_KEY
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  "";

/**
 * Whether public Supabase credentials are present. The marketing site is
 * designed to render fully from bundled default content when this is false,
 * so the project builds and previews without a configured backend.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export const GALLERY_BUCKET = "gallery";
export const DOCTORS_BUCKET = "doctors";
export const SERVICES_BUCKET = "services";
export const CONTENT_BUCKET = "content";

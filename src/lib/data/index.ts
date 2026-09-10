import "server-only";

import { getPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  BeforeAfterRow,
  BlogPostRow,
  ClinicHourRow,
  DentalSpecialtyRow,
  DoctorRow,
  FaqCategory,
  FaqRow,
  GalleryImageRow,
  ServiceCategory,
  ServiceRow,
  TestimonialRow,
} from "@/types/database";
import {
  defaultBeforeAfter,
  defaultBlogPosts,
  defaultClinicHours,
  defaultDentalSpecialties,
  defaultDoctors,
  defaultFaqs,
  defaultGallery,
  defaultSiteContent,
  defaultServices,
  defaultTestimonials,
  type SiteContent,
} from "@/lib/content/defaults";

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

async function safeQuery<T>(
  run: () => Promise<{ data: T[] | null; error: unknown }>,
  fallback: T[],
): Promise<T[]> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await run();
    if (error || !data) return fallback;
    return data.length ? data : fallback;
  } catch {
    return fallback;
  }
}

/* --------------------------------------------------------------- Services */

export async function getServices(options?: {
  category?: ServiceCategory;
  includeUnpublished?: boolean;
}): Promise<ServiceRow[]> {
  const fallback = defaultServices
    .filter((s) => (options?.category ? s.category === options.category : true))
    .filter((s) => (options?.includeUnpublished ? true : s.published));

  return safeQuery<ServiceRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true })
      .order("title", { ascending: true });
    if (options?.category) query = query.eq("category", options.category);
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
}

export async function getFeaturedServices(limit = 8): Promise<ServiceRow[]> {
  const services = await getServices();
  const featured = services.filter((s) => s.featured);
  return (featured.length ? featured : services).slice(0, limit);
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceRow | null> {
  if (!isSupabaseConfigured) {
    return defaultServices.find((s) => s.slug === slug && s.published) ?? null;
  }
  try {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) {
      return defaultServices.find((s) => s.slug === slug && s.published) ?? null;
    }
    return data;
  } catch {
    return defaultServices.find((s) => s.slug === slug && s.published) ?? null;
  }
}

export async function getRelatedServices(
  service: Pick<ServiceRow, "id" | "category">,
  limit = 3,
): Promise<ServiceRow[]> {
  const all = await getServices({ category: service.category });
  return all.filter((s) => s.id !== service.id).slice(0, limit);
}

/* ---------------------------------------------------------------- Doctors */

export async function getDoctors(options?: {
  includeUnpublished?: boolean;
}): Promise<DoctorRow[]> {
  const fallback = defaultDoctors.filter((d) =>
    options?.includeUnpublished ? true : d.published,
  );
  return safeQuery<DoctorRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("doctors")
      .select("*")
      .order("display_order", { ascending: true });
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
}

export async function getDoctorBySlug(slug: string): Promise<DoctorRow | null> {
  const doctors = await getDoctors();
  return doctors.find((d) => d.slug === slug) ?? null;
}

/* ---------------------------------------------------------------- Gallery */

export async function getGallery(options?: {
  includeUnpublished?: boolean;
}): Promise<GalleryImageRow[]> {
  const fallback = defaultGallery.filter((g) =>
    options?.includeUnpublished ? true : g.published,
  );
  return safeQuery<GalleryImageRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
}

/* ----------------------------------------------------- Dental specialties */

export async function getDentalSpecialties(options?: {
  includeUnpublished?: boolean;
}): Promise<DentalSpecialtyRow[]> {
  const fallback = defaultDentalSpecialties.filter((s) =>
    options?.includeUnpublished ? true : s.published,
  );
  return safeQuery<DentalSpecialtyRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("dental_specialties")
      .select("*")
      .order("display_order", { ascending: true });
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
}

/* ------------------------------------------------------------ Before/after */

export async function getBeforeAfter(options?: {
  includeUnpublished?: boolean;
}): Promise<BeforeAfterRow[]> {
  const fallback = defaultBeforeAfter.filter((b) =>
    options?.includeUnpublished ? true : b.published && b.consent_obtained,
  );
  return safeQuery<BeforeAfterRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("before_after")
      .select("*")
      .order("display_order", { ascending: true });
    if (!options?.includeUnpublished) {
      query = query.eq("published", true).eq("consent_obtained", true);
    }
    return query;
  }, fallback);
}

/* ------------------------------------------------------------ Testimonials */

export async function getTestimonials(options?: {
  includeUnpublished?: boolean;
  limit?: number;
}): Promise<TestimonialRow[]> {
  const fallback = defaultTestimonials.filter((t) =>
    options?.includeUnpublished ? true : t.published,
  );
  const rows = await safeQuery<TestimonialRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
  return options?.limit ? rows.slice(0, options.limit) : rows;
}

/* --------------------------------------------------------------------- FAQ */

export async function getFaqs(options?: {
  category?: FaqCategory;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
}): Promise<FaqRow[]> {
  const fallback = defaultFaqs
    .filter((f) => (options?.category ? f.category === options.category : true))
    .filter((f) => (options?.featuredOnly ? f.featured : true))
    .filter((f) => (options?.includeUnpublished ? true : f.published));

  return safeQuery<FaqRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });
    if (options?.category) query = query.eq("category", options.category);
    if (options?.featuredOnly) query = query.eq("featured", true);
    if (!options?.includeUnpublished) query = query.eq("published", true);
    return query;
  }, fallback);
}

/* ------------------------------------------------------------ Clinic hours */

export interface NormalizedDayHours extends ClinicHourRow {
  label: string;
  /** e.g. "9:00 AM – 2:00 PM, 4:00 PM – 8:00 PM" or "Closed" */
  summary: string;
}

function formatHour(value: string | null) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${(m ?? "00").padStart(2, "0")} ${period}`;
}

function summariseDay(row: ClinicHourRow): string {
  if (!row.is_open) return "Closed";
  const parts: string[] = [];
  if (row.morning_start && row.morning_end) {
    parts.push(`${formatHour(row.morning_start)} – ${formatHour(row.morning_end)}`);
  }
  if (row.evening_start && row.evening_end) {
    parts.push(`${formatHour(row.evening_start)} – ${formatHour(row.evening_end)}`);
  }
  return parts.length ? parts.join(", ") : "Open — call for hours";
}

export async function getClinicHours(): Promise<NormalizedDayHours[]> {
  const rows = await safeQuery<ClinicHourRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    return supabase
      .from("clinic_hours")
      .select("*")
      .order("day_of_week", { ascending: true });
  }, defaultClinicHours);

  const byDay = new Map(rows.map((r) => [r.day_of_week, r]));
  // Present Monday-first for readability.
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const row =
      byDay.get(day) ??
      defaultClinicHours.find((d) => d.day_of_week === day)!;
    return { ...row, label: DAY_LABELS[day], summary: summariseDay(row) };
  });
}

/** Is the clinic open right now? Derived from `clinic_hours` + current time. */
export function getOpenStatus(
  hours: NormalizedDayHours[],
  now: Date = new Date(),
): { open: boolean; label: string; todaySummary: string } {
  const today = hours.find((h) => h.day_of_week === now.getDay());
  if (!today || !today.is_open) {
    return { open: false, label: "Closed today", todaySummary: "Closed" };
  }
  const toMin = (t: string | null) =>
    t ? Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) : null;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const windows = (
    [
      [toMin(today.morning_start), toMin(today.morning_end)],
      [toMin(today.evening_start), toMin(today.evening_end)],
    ] as const
  ).filter((w): w is [number, number] => w[0] != null && w[1] != null);

  for (const [start, end] of windows) {
    if (nowMin >= start && nowMin < end) {
      return { open: true, label: "Open now", todaySummary: today.summary };
    }
  }
  const upcoming = windows
    .map(([start]) => start)
    .filter((start) => start > nowMin)
    .sort((a, b) => a - b)[0];
  return {
    open: false,
    label:
      upcoming != null
        ? `Opens ${formatHour(
            `${String(Math.floor(upcoming / 60)).padStart(2, "0")}:${String(
              upcoming % 60,
            ).padStart(2, "0")}`,
          )}`
        : "Closed now",
    todaySummary: today.summary,
  };
}

/* ------------------------------------------------------------ Site content */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return defaultSiteContent;
  try {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    const { data, error } = await supabase.from("site_content").select("*");
    if (error || !data) return defaultSiteContent;

    const map = new Map(data.map((row) => [row.key, row.value]));
    const heroOverride = map.get("hero");
    const aboutOverride = map.get("about");
    const whyOverride = map.get("why_choose_us");
    const ctaOverride = map.get("cta");
    const footerOverride = map.get("footer");
    const socialOverride = map.get("social");

    return {
      hero: {
        ...defaultSiteContent.hero,
        ...(isRecord(heroOverride) ? heroOverride : {}),
      },
      about: {
        ...defaultSiteContent.about,
        ...(isRecord(aboutOverride) ? aboutOverride : {}),
      },
      whyChooseUs:
        isRecord(whyOverride) && Array.isArray(whyOverride.items)
          ? (whyOverride.items as SiteContent["whyChooseUs"])
          : defaultSiteContent.whyChooseUs,
      cta: {
        ...defaultSiteContent.cta,
        ...(isRecord(ctaOverride) ? ctaOverride : {}),
      },
      footerNote:
        isRecord(footerOverride) && typeof footerOverride.note === "string"
          ? footerOverride.note
          : defaultSiteContent.footerNote,
      social: {
        ...defaultSiteContent.social,
        ...(isRecord(socialOverride) ? socialOverride : {}),
      },
    };
  } catch {
    return defaultSiteContent;
  }
}

/* -------------------------------------------------------------------- Blog */

export async function getBlogPosts(options?: {
  includeDrafts?: boolean;
}): Promise<BlogPostRow[]> {
  const fallback = defaultBlogPosts.filter((p) =>
    options?.includeDrafts ? true : p.status === "published",
  );
  return safeQuery<BlogPostRow>(async () => {
    const supabase = getPublicClient();
    if (!supabase) throw new Error("no client");
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (!options?.includeDrafts) query = query.eq("status", "published");
    return query;
  }, fallback);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRow | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

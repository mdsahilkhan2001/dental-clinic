import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole } from "@/lib/supabase/config";
import type {
  AppointmentRow,
  BeforeAfterRow,
  BlogPostRow,
  Database,
  DentalSpecialtyRow,
  DoctorRow,
  EnquiryRow,
  FaqRow,
  GalleryImageRow,
  ServiceRow,
  TestimonialRow,
} from "@/types/database";

/**
 * Admin-side reads use the service-role client (bypasses RLS) so unpublished
 * rows are visible in the dashboard. Every caller sits behind `requireAdmin()`.
 */

type TableName = keyof Database["public"]["Tables"];

async function adminList<T>(
  table: TableName,
  order: { column: string; ascending?: boolean }[],
): Promise<T[]> {
  if (!hasServiceRole) return [];
  const supabase = createAdminClient();
  // The column names are dynamic here; cast to keep the generic helper simple.
  let query = supabase.from(table).select("*") as unknown as {
    order: (c: string, o: { ascending: boolean }) => typeof query;
    then: PromiseLike<{ data: T[] | null; error: unknown }>["then"];
  };
  for (const o of order) {
    query = query.order(o.column, { ascending: o.ascending ?? true });
  }
  const { data, error } = await (query as unknown as Promise<{
    data: T[] | null;
    error: unknown;
  }>);
  if (error || !data) return [];
  return data;
}

export const adminGetServices = () =>
  adminList<ServiceRow>("services", [
    { column: "category" },
    { column: "display_order" },
  ]);

export const adminGetDoctors = () =>
  adminList<DoctorRow>("doctors", [{ column: "display_order" }]);

export const adminGetGallery = () =>
  adminList<GalleryImageRow>("gallery_images", [
    { column: "display_order" },
    { column: "created_at", ascending: false },
  ]);

export const adminGetSpecialties = () =>
  adminList<DentalSpecialtyRow>("dental_specialties", [
    { column: "display_order" },
  ]);

export const adminGetBeforeAfter = () =>
  adminList<BeforeAfterRow>("before_after", [{ column: "display_order" }]);

export const adminGetTestimonials = () =>
  adminList<TestimonialRow>("testimonials", [
    { column: "display_order" },
    { column: "created_at", ascending: false },
  ]);

export const adminGetFaqs = () =>
  adminList<FaqRow>("faqs", [{ column: "display_order" }]);

export const adminGetBlogPosts = () =>
  adminList<BlogPostRow>("blog_posts", [
    { column: "created_at", ascending: false },
  ]);

export const adminGetAppointments = () =>
  adminList<AppointmentRow>("appointments", [
    { column: "appointment_date", ascending: false },
    { column: "appointment_time", ascending: false },
  ]);

export const adminGetEnquiries = () =>
  adminList<EnquiryRow>("enquiries", [
    { column: "created_at", ascending: false },
  ]);

export async function adminGetServiceById(
  id: string,
): Promise<ServiceRow | null> {
  if (!hasServiceRole) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as ServiceRow) ?? null;
}

export async function adminGetDoctorById(id: string): Promise<DoctorRow | null> {
  if (!hasServiceRole) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as DoctorRow) ?? null;
}

export interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
  today: AppointmentRow[];
  upcoming: AppointmentRow[];
  recentEnquiries: EnquiryRow[];
}

export async function adminGetDashboard(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
    today: [],
    upcoming: [],
    recentEnquiries: [],
  };
  if (!hasServiceRole) return empty;

  const [appointments, enquiries] = await Promise.all([
    adminGetAppointments(),
    adminGetEnquiries(),
  ]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const counts = { ...empty, total: appointments.length };
  for (const a of appointments) {
    if (a.status in counts) {
      (counts as unknown as Record<string, number>)[a.status] += 1;
    }
  }

  return {
    ...counts,
    today: appointments
      .filter((a) => a.appointment_date === todayStr)
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)),
    upcoming: appointments
      .filter(
        (a) =>
          a.appointment_date >= todayStr &&
          ["pending", "confirmed"].includes(a.status),
      )
      .sort(
        (a, b) =>
          a.appointment_date.localeCompare(b.appointment_date) ||
          a.appointment_time.localeCompare(b.appointment_time),
      )
      .slice(0, 8),
    recentEnquiries: enquiries.slice(0, 6),
  };
}

/**
 * Hand-maintained types for the Supabase schema
 * (see `supabase/migrations/0001_init.sql`).
 * Regenerate with `supabase gen types typescript` once the CLI is linked.
 *
 * NOTE: these are `type` aliases, not `interface`s, on purpose — Supabase's
 * `GenericSchema` constraint requires an implicit index signature, which
 * object-literal type aliases have and interfaces do not.
 */

export type ServiceCategory = "dental" | "skin" | "hair" | "aesthetic";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AdminRole = "admin" | "super_admin" | "editor" | "receptionist";

export type BlogStatus = "draft" | "published";

export type GalleryCategory =
  | "clinic"
  | "dental"
  | "skin"
  | "hair"
  | "aesthetic"
  | "team"
  | "results";

export type FaqCategory =
  | "dental"
  | "skin"
  | "hair"
  | "aesthetic"
  | "appointments"
  | "general";

export type EnquiryStatus = "new" | "in_progress" | "resolved";

export type QAItem = {
  question: string;
  answer: string;
};

export type DayHours = {
  is_open: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
};

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
};

export type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  short_description: string;
  description: string | null;
  suitable_for: string[];
  procedure_steps: string[];
  benefits: string[];
  faqs: QAItem[];
  image_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type DoctorRow = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  qualification: string | null;
  specialization: string | null;
  experience: string | null;
  bio: string | null;
  image_url: string | null;
  languages: string[];
  services: string[];
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRow = {
  id: string;
  image_url: string;
  storage_path: string | null;
  title: string | null;
  category: GalleryCategory;
  alt_text: string;
  display_order: number;
  published: boolean;
  created_at: string;
};

export type DentalSpecialtyRow = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  href: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
};

export type BeforeAfterRow = {
  id: string;
  treatment: string;
  description: string | null;
  before_url: string;
  after_url: string;
  consent_obtained: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
};

export type TestimonialRow = {
  id: string;
  patient_name: string;
  rating: number;
  review: string;
  service: string | null;
  photo_url: string | null;
  display_date: string | null;
  published: boolean;
  display_order: number;
  created_at: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AppointmentRow = {
  id: string;
  reference: string;
  patient_name: string;
  phone: string;
  email: string | null;
  service_id: string | null;
  service_label: string | null;
  doctor_id: string | null;
  doctor_label: string | null;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status: AppointmentStatus;
  consent: boolean;
  source: string;
  created_at: string;
  updated_at: string;
};

export type EnquiryRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  consent: boolean;
  status: EnquiryStatus;
  source: string;
  created_at: string;
};

export type ClinicHourRow = {
  day_of_week: number; // 0 = Sunday … 6 = Saturday
  is_open: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
};

export type SiteContentRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  excerpt: string | null;
  content: string;
  author: string | null;
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type TableShape<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: TableShape<AdminUserRow>;
      services: TableShape<ServiceRow>;
      doctors: TableShape<DoctorRow>;
      gallery_images: TableShape<GalleryImageRow>;
      dental_specialties: TableShape<DentalSpecialtyRow>;
      before_after: TableShape<BeforeAfterRow>;
      testimonials: TableShape<TestimonialRow>;
      faqs: TableShape<FaqRow>;
      appointments: TableShape<AppointmentRow>;
      enquiries: TableShape<EnquiryRow>;
      clinic_hours: TableShape<ClinicHourRow>;
      site_content: TableShape<SiteContentRow>;
      blog_posts: TableShape<BlogPostRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      service_category: ServiceCategory;
      appointment_status: AppointmentStatus;
      admin_role: AdminRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

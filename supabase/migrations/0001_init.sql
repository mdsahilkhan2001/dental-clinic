-- =============================================================================
-- Jeevan Dental & Aesthetic Clinic — initial schema
-- Run with the Supabase SQL editor or `supabase db push`.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.service_category as enum ('dental', 'skin', 'hair', 'aesthetic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appointment_status as enum
    ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enquiry_status as enum ('new', 'in_progress', 'resolved');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_role as enum
    ('admin', 'super_admin', 'editor', 'receptionist');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gallery_category as enum
    ('clinic', 'dental', 'skin', 'hair', 'aesthetic', 'team', 'results');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.faq_category as enum
    ('dental', 'skin', 'hair', 'aesthetic', 'appointments', 'general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Shared helpers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ----------------------------------------------------------------------------
-- admin_users — links an auth.users row to a clinic role
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       public.admin_role not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  category          public.service_category not null,
  short_description text not null,
  description       text,
  suitable_for      text[] not null default '{}',
  procedure_steps   text[] not null default '{}',
  benefits          text[] not null default '{}',
  faqs              jsonb  not null default '[]',
  image_url         text,
  featured          boolean not null default false,
  published         boolean not null default true,
  display_order     integer not null default 0,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists services_category_idx on public.services (category, display_order);
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- doctors
-- ----------------------------------------------------------------------------
create table if not exists public.doctors (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  title          text,
  qualification  text,
  specialization text,
  experience     text,
  bio            text,
  image_url      text,
  languages      text[] not null default '{}',
  services       text[] not null default '{}',
  published      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- gallery_images
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  storage_path  text,
  title         text,
  category      public.gallery_category not null default 'clinic',
  alt_text      text not null,
  display_order integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists gallery_category_idx on public.gallery_images (category, display_order);

-- ----------------------------------------------------------------------------
-- dental_specialties
-- ----------------------------------------------------------------------------
create table if not exists public.dental_specialties (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  subtitle      text,
  image_url     text,
  href          text,
  display_order integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- before_after
-- ----------------------------------------------------------------------------
create table if not exists public.before_after (
  id               uuid primary key default gen_random_uuid(),
  treatment        text not null,
  description      text,
  before_url       text not null,
  after_url        text not null,
  consent_obtained boolean not null default false,
  published        boolean not null default false,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- testimonials
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  patient_name  text not null,
  rating        smallint not null default 5 check (rating between 1 and 5),
  review        text not null,
  service       text,
  photo_url     text,
  display_date  date,
  published     boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- faqs
-- ----------------------------------------------------------------------------
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  category      public.faq_category not null default 'general',
  featured      boolean not null default false,
  display_order integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger faqs_set_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- appointments
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  patient_name     text not null,
  phone            text not null,
  email            text,
  service_id       uuid references public.services (id) on delete set null,
  service_label    text,
  doctor_id        uuid references public.doctors (id) on delete set null,
  doctor_label     text,
  appointment_date date not null,
  appointment_time time not null,
  message          text,
  status           public.appointment_status not null default 'pending',
  consent          boolean not null default false,
  source           text not null default 'website',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Prevent double booking: only one active appointment per date + time slot.
create unique index if not exists appointments_active_slot_idx
  on public.appointments (appointment_date, appointment_time)
  where status in ('pending', 'confirmed');

create index if not exists appointments_date_idx on public.appointments (appointment_date);
create index if not exists appointments_status_idx on public.appointments (status);

create or replace function public.set_appointment_reference()
returns trigger language plpgsql as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'JDA-' || upper(substr(replace(new.id::text, '-', ''), 1, 6));
  end if;
  return new;
end $$;

create trigger appointments_set_reference before insert on public.appointments
  for each row execute function public.set_appointment_reference();
create trigger appointments_set_updated_at before update on public.appointments
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- enquiries (contact form)
-- ----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  subject    text,
  message    text not null,
  consent    boolean not null default false,
  status     public.enquiry_status not null default 'new',
  source     text not null default 'contact_form',
  created_at timestamptz not null default now()
);
create index if not exists enquiries_status_idx on public.enquiries (status, created_at desc);

-- ----------------------------------------------------------------------------
-- clinic_hours (one row per weekday, 0 = Sunday)
-- ----------------------------------------------------------------------------
create table if not exists public.clinic_hours (
  day_of_week   smallint primary key check (day_of_week between 0 and 6),
  is_open       boolean not null default true,
  morning_start time,
  morning_end   time,
  evening_start time,
  evening_end   time
);

-- ----------------------------------------------------------------------------
-- site_content (key/value blocks for editable homepage content)
-- ----------------------------------------------------------------------------
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create trigger site_content_set_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- blog_posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  cover_image_url text,
  excerpt         text,
  content         text not null,
  author          text,
  category        text,
  seo_title       text,
  seo_description text,
  status          public.blog_status not null default 'draft',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger blog_posts_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.admin_users        enable row level security;
alter table public.services           enable row level security;
alter table public.doctors            enable row level security;
alter table public.gallery_images     enable row level security;
alter table public.dental_specialties enable row level security;
alter table public.before_after       enable row level security;
alter table public.testimonials       enable row level security;
alter table public.faqs               enable row level security;
alter table public.appointments       enable row level security;
alter table public.enquiries          enable row level security;
alter table public.clinic_hours       enable row level security;
alter table public.site_content       enable row level security;
alter table public.blog_posts         enable row level security;

-- admin_users: a user may read their own row; admins may read all.
create policy admin_users_self_read on public.admin_users
  for select using (id = auth.uid() or public.is_admin());

-- Public read of published content ------------------------------------------------
create policy services_public_read on public.services
  for select using (published = true or public.is_admin());
create policy doctors_public_read on public.doctors
  for select using (published = true or public.is_admin());
create policy gallery_public_read on public.gallery_images
  for select using (published = true or public.is_admin());
create policy specialties_public_read on public.dental_specialties
  for select using (published = true or public.is_admin());
create policy before_after_public_read on public.before_after
  for select using ((published = true and consent_obtained = true) or public.is_admin());
create policy testimonials_public_read on public.testimonials
  for select using (published = true or public.is_admin());
create policy faqs_public_read on public.faqs
  for select using (published = true or public.is_admin());
create policy blog_public_read on public.blog_posts
  for select using (status = 'published' or public.is_admin());
create policy hours_public_read on public.clinic_hours
  for select using (true);
create policy content_public_read on public.site_content
  for select using (true);

-- Admin full control on content tables -----------------------------------------
create policy services_admin_all on public.services
  for all using (public.is_admin()) with check (public.is_admin());
create policy doctors_admin_all on public.doctors
  for all using (public.is_admin()) with check (public.is_admin());
create policy gallery_admin_all on public.gallery_images
  for all using (public.is_admin()) with check (public.is_admin());
create policy specialties_admin_all on public.dental_specialties
  for all using (public.is_admin()) with check (public.is_admin());
create policy before_after_admin_all on public.before_after
  for all using (public.is_admin()) with check (public.is_admin());
create policy testimonials_admin_all on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());
create policy faqs_admin_all on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());
create policy blog_admin_all on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());
create policy hours_admin_write on public.clinic_hours
  for all using (public.is_admin()) with check (public.is_admin());
create policy content_admin_write on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- Appointments: anyone may create a request; only admins may read / manage.
create policy appointments_public_insert on public.appointments
  for insert with check (
    consent = true
    and status = 'pending'
    and appointment_date >= current_date
  );
create policy appointments_admin_read on public.appointments
  for select using (public.is_admin());
create policy appointments_admin_update on public.appointments
  for update using (public.is_admin()) with check (public.is_admin());
create policy appointments_admin_delete on public.appointments
  for delete using (public.is_admin());

-- Enquiries: anyone may create; only admins may read / manage.
create policy enquiries_public_insert on public.enquiries
  for insert with check (consent = true);
create policy enquiries_admin_read on public.enquiries
  for select using (public.is_admin());
create policy enquiries_admin_update on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());
create policy enquiries_admin_delete on public.enquiries
  for delete using (public.is_admin());

-- admin_users writes are performed with the service role key only (bypasses RLS).

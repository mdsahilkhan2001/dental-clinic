# PROJECT_CONTEXT.md

> **Living state / handoff document for `jeevan-dental-aesthetic-clinic`.**
> Future Claude Code sessions: read this file **and** `README.md` first, then
> verify against the actual code before making changes. Keep this file current
> (see [§29](#29-instructions-for-future-claude-code-sessions) and the
> Maintenance Rule at the end).
>
> Last verified against the repository: **2026-09-10** (commit `0f5e14c`).
> Nothing in this file is a secret. Environment variable **names** appear here;
> their **values** do not.

---

## 1. Project Overview

- **What:** A production-oriented marketing website **plus** a lightweight
  clinic-management/admin system for a single dental & aesthetic clinic.
- **Who it is for:**
  - **Prospective / existing patients** — browse services, read FAQs, see the
    clinic, and request an appointment online or via WhatsApp/phone.
  - **Clinic staff (admins)** — manage appointment requests, services, doctors,
    gallery, testimonials, FAQs, homepage content and opening hours from a
    password-protected dashboard.
- **Business purpose:** Local-SEO-friendly web presence for a clinic in a small
  town (Mahuadanr, Latehar, Jharkhand), with appointment-request capture as the
  primary conversion. It is **not** a full EMR/PMS — no clinical records, no
  billing.
- **Main user types:** anonymous website visitor; authenticated clinic admin
  (`admin_users` row, role currently always full-access).
- **Public website purpose:** trust + information + appointment conversion.
- **Admin/dashboard purpose:** triage appointment requests and keep site content
  accurate without touching code.

---

## 2. Current Project Status

Legend: ✅ COMPLETE · 🟡 PARTIAL · 🔴 BROKEN · ⏳ PLANNED · ⚠️ NEEDS REVIEW

| Area | Status | Notes |
|---|---|---|
| **Overall** | 🟡 PARTIAL | Feature-complete and building; not deployed; no email/notification layer; stock placeholder images remain. |
| Frontend (public site) | ✅ COMPLETE | All routes render; static + ISR (1h). Verified via dev server smoke test. |
| Backend (server actions / API) | ✅ COMPLETE | Appointment, contact, auth, and admin CRUD actions implemented. |
| Database | ✅ COMPLETE | 13 tables + enums + triggers + RLS applied to the connected Supabase project; seed data loaded. |
| Authentication | ✅ COMPLETE | Supabase Auth + `admin_users` gate + proxy + `requireAdmin()`. 1 admin user exists. |
| Storage | ✅ COMPLETE (unused so far) | 4 public-read buckets created; upload/delete wired; no objects uploaded yet. |
| Appointment system | ✅ COMPLETE | 5-step booking, availability API, server-side slot check, DB unique index, admin status management. No test bookings made yet. |
| Admin dashboard | ✅ COMPLETE | Dashboard + Appointments + Services + Doctors + Gallery + Testimonials + FAQs + Content + Settings + Profile. |
| SEO | ✅ COMPLETE | Metadata, canonical, OG/Twitter, JSON-LD (LocalBusiness/Dentist/MedicalClinic, WebSite, Breadcrumb, MedicalProcedure, FAQPage, Physician, Article), sitemap, robots, dynamic OG image. |
| Mobile / responsive | ✅ COMPLETE | Mobile drawer nav, sticky mobile bottom bar, floating WhatsApp, responsive grids. Visual QA on real devices ⚠️ NOT done. |
| Deployment | 🔴 NOT DEPLOYED | Local git only, **no GitHub remote**, **not on Vercel**, `NEXT_PUBLIC_SITE_URL` still `http://localhost:3000`. |
| Testing | ⏳ PLANNED | No test framework installed. Verification is manual (`lint`, `build`, curl smoke test). |
| Lint | ✅ 0 errors | 2 benign warnings (`react-hooks/incompatible-library` on RHF `watch()`). |
| Build | ✅ PASSES | `npm run build` green; 55 static pages prerendered (incl. 31 service detail pages + 1 doctor); admin routes render dynamically. |

---

## 3. Technology Stack

Versions are the **resolved installed** versions from `package-lock.json`
(`package.json` ranges in parentheses where they differ).

| Concern | Tech | Version | Where / how used |
|---|---|---|---|
| Framework | **Next.js** (App Router, Turbopack) | `16.3.4` | `src/app/**`; route groups `(website)` and `admin/(dashboard)`; Server Components default. |
| UI runtime | **React / React DOM** | `19.2.8` | Server + Client Components. |
| Language | **TypeScript** | `5.9.3` (`^5`) | Strict mode; path alias `@/* -> ./src/*` (`tsconfig.json`). |
| Styling | **Tailwind CSS v4** + `@tailwindcss/postcss` | `4.3.3` (`^4`) | `src/app/globals.css` with `@theme` tokens; `postcss.config.mjs`. No `tailwind.config.*`. |
| Animation utils | **tw-animate-css** | `1.4.0` | Imported in `globals.css` for accordion/dialog animation classes. |
| UI primitives | **Radix UI** packages + shadcn-style wrappers | accordion `1.2.20`, avatar `1.2.6`, checkbox `1.3.11`, dialog `1.1.23`, dropdown-menu `2.1.24`, label `2.1.15`, select `2.3.7`, separator `1.1.15`, slot `1.3.3`, tabs `1.1.21` | `src/components/ui/*`. `components.json` declares style `new-york`, `rsc: true`, base color `slate`. |
| Variants / classnames | **class-variance-authority** `0.7.1`, **clsx** `2.1.1`, **tailwind-merge** `3.6.0` | `cn()` in `src/lib/utils.ts`; `cva` in `button.tsx`, `badge.tsx`. |
| Icons | **lucide-react** | `1.44.0` | Throughout. Brand icons (Instagram/Facebook/YouTube/Google) are **custom inline SVGs** in `src/components/website/social-icons.tsx` (lucide 1.x dropped brand icons). |
| Toasts | **sonner** | `2.0.8` | `src/components/ui/sonner.tsx` `<Toaster>` mounted in root layout; `toast.*` in forms/admin. |
| Date picker | **react-day-picker** | `10.0.1` | `src/components/forms/appointment-form.tsx` (step 3). Its stylesheet is imported in that file. |
| Backend platform | **Supabase** (Postgres + Auth + Storage) | — | See §10–§12. |
| Supabase SDKs | **@supabase/supabase-js** `2.116.0`, **@supabase/ssr** `0.12.7` | — | `src/lib/supabase/*`. |
| Forms | **react-hook-form** `7.87.0` | — | `appointment-form.tsx`, `contact-form.tsx`, `login-form.tsx` use RHF with its **built-in** validation rules (`register(..., { required, pattern, … })`). Admin dialog forms use plain `useState`. `@hookform/resolvers` `5.9.1` is installed but **not imported anywhere** (no `zodResolver`); server actions do the Zod validation. |
| Validation | **Zod** | `3.25.76` | `src/lib/validations/*`; every server action re-validates input. |
| Server Actions | Next.js `"use server"` | — | `src/app/actions/**`. |
| API routes | Next.js Route Handlers | — | `src/app/api/availability/route.ts` only. |
| SEO | Next Metadata API + `next/og` | — | `src/lib/seo/*`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`. |
| Lint | **ESLint** `9.39.5` + **eslint-config-next** `16.3.4` | — | Flat config `eslint.config.mjs`. `npm run lint` = `eslint`. |
| Deployment target | **Vercel** | — | No `vercel.json`; standard Next preset. Not yet deployed. |
| Tests | none | — | No jest/vitest/playwright installed. |

**Not used / not installed:** no CSS-in-JS, no state manager (Redux/Zustand), no
`next-themes`, no ORM (raw Supabase client), no email SDK, no analytics SDK.

---

## 4. Architecture

### 4.1 Next.js App Router structure

```
src/app/
  layout.tsx              Root layout: <html>, next/font (Manrope + Fraunces),
                          global metadata + viewport, <Toaster/>.
  globals.css            Tailwind v4 @theme design tokens + base + components layers.
  not-found.tsx          Root 404 (in-root-layout).
  global-error.tsx       Top-level error boundary (own <html>).
  icon.svg               Favicon (SVG).
  opengraph-image.tsx    Dynamic 1200x630 OG PNG (next/og).
  sitemap.ts             Static + dynamic (services/doctors/blog) sitemap.
  robots.ts              Allow /, disallow /admin + /api, sitemap ref.

  (website)/             PUBLIC SITE — route group (no URL segment)
    layout.tsx           Header + Footer + MobileBottomBar + FloatingWhatsApp;
                         renders WebSite + LocalBusiness JSON-LD;
                         `export const revalidate = 3600` (ISR).
    error.tsx            Public error boundary.
    loading.tsx          Skeleton.
    page.tsx             Homepage.
    about/ services/ services/[slug]/ services/{dental,skin,hair,aesthetic}/
    doctor/ doctor/[slug]/ gallery/ testimonials/ faq/ contact/ appointment/
    blog/ blog/[slug]/ privacy-policy/ terms/

  admin/
    layout.tsx           Metadata only (noindex). NO auth guard here.
    login/page.tsx       `/admin/login` — unguarded.
    (dashboard)/         GUARDED route group
      layout.tsx         `requireAdmin()` + <AdminSidebar/>;
                         `export const dynamic = "force-dynamic"`.
      error.tsx  loading.tsx
      page.tsx           Dashboard.
      appointments/ services/(+new,[id]) doctors/(+new,[id])
      gallery/ testimonials/ faqs/ content/ settings/ profile/

  api/availability/route.ts   GET slot availability (force-dynamic, no-store).

  actions/
    appointments.ts      createAppointmentAction (public booking).
    contact.ts           submitContactAction (public enquiry).
    auth.ts              signInAction, signOutAction.
    admin/_helpers.ts    ensureAdmin(), zodFieldErrors(), dbError(), ActionResult.
    admin/appointments.ts  updateAppointmentStatusAction, deleteAppointmentAction.
    admin/services.ts    saveServiceAction, toggleServicePublishedAction, deleteServiceAction.
    admin/doctors.ts     saveDoctorAction, toggleDoctorPublishedAction, deleteDoctorAction.
    admin/content.ts     saveSiteContentAction, saveClinicHoursAction, save/deleteFaqAction,
                         save/deleteTestimonialAction, save/deleteGalleryImageAction,
                         save/deleteSpecialtyAction.
    admin/upload.ts      uploadImageAction (Supabase Storage).
```

### 4.2 Server / client boundaries

- **Server Components by default.** Client Components are explicitly
  `"use client"`: header, mobile-bottom-bar, floating-whatsapp, reveal,
  gallery-grid, faq-accordion, before-after-slider, all `components/forms/*`,
  all `components/admin/*` that hold state, and the Radix wrappers in
  `components/ui/*` that need it.
- **Server Components never pass function props to Client Components.**
  `RowActions` (client) receives an `id` string + **bare Server Action
  references** (`toggleServicePublishedAction`, `deleteServiceAction`), never
  inline closures. (This was a build break, fixed in `0f5e14c`.)

### 4.3 Supabase clients (`src/lib/supabase/`)

| File | Client | Key | Used by | Notes |
|---|---|---|---|---|
| `config.ts` | — | reads env | everything | `SUPABASE_ANON_KEY` = `NEXT_PUBLIC_SUPABASE_ANON_KEY` ?? `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `SUPABASE_SERVICE_ROLE_KEY` = `SUPABASE_SERVICE_ROLE_KEY` ?? `SUPABASE_SECRET_KEY`. Exposes `isSupabaseConfigured`, `hasServiceRole`, bucket name constants. |
| `client.ts` | `createBrowserClient` (`@supabase/ssr`) | anon/publishable | `"use client"` code | currently only referenced type-wise; browser rarely talks to Supabase directly. |
| `server.ts` | `createServerClient` (cookie-bound) | anon/publishable | server components / route handlers / server actions needing the **user session** | `createClient()` (async, reads `cookies()`). Used by `getAdminSession()` and public write actions. |
| `public.ts` | plain `createClient` (**cookie-less**) | anon/publishable | `src/lib/data/index.ts` public reads | `getPublicClient()` — keeps public pages statically renderable / ISR. Returns `null` when unconfigured. |
| `admin.ts` | plain `createClient` (`server-only`) | **service/secret** | `src/lib/data/admin.ts`, `ensureAdmin()` | `createAdminClient()` — bypasses RLS. Throws if `hasServiceRole` is false. |
| `middleware.ts` | `createServerClient` on the request | anon/publishable | `src/proxy.ts` | `updateSession()` — refreshes cookie, first-gate redirect for `/admin/*`. |

### 4.4 Authentication flow

1. `src/proxy.ts` (Next 16 **proxy** convention; matcher excludes `_next/*`,
   images, common static extensions) → `updateSession(request)`:
   - If Supabase unconfigured and route is `/admin/*` (not `/admin/login`) →
     redirect to `/admin/login`.
   - Else refresh Supabase session cookie; if `/admin/*` and no user →
     redirect to `/admin/login?redirect=<path>`; if `/admin/login` and user →
     redirect to `/admin`.
2. `src/app/admin/(dashboard)/layout.tsx` → `requireAdmin(redirectTo)`
   (`src/lib/auth.ts`):
   - `getAdminSession()` → `supabase.auth.getUser()` + `admin_users` row lookup
     by `id`. Returns `{ userId, email, admin }` or `null` (never throws).
   - If `null` → `redirect("/admin/login?redirect=…")`.
3. Login: `src/components/admin/login-form.tsx` → `signInAction(input, redirect)`
   (`src/app/actions/auth.ts`) → zod `loginSchema` → rate limit → Supabase
   `signInWithPassword` → verify `admin_users` row exists (else `signOut` +
   error) → `redirect(safePath)` (only `/admin*` allowed).
4. Logout: `signOutAction()` → `supabase.auth.signOut()` → redirect to
   `/admin/login`. Wired to `<form action={signOutAction}>` in sidebar + profile.

### 4.5 Database access pattern

- **Public reads:** `src/lib/data/index.ts` — one function per resource
  (`getServices`, `getServiceBySlug`, `getFeaturedServices`,
  `getRelatedServices`, `getDoctors`, `getDoctorBySlug`, `getGallery`,
  `getDentalSpecialties`, `getBeforeAfter`, `getTestimonials`, `getFaqs`,
  `getClinicHours`, `getSiteContent`, `getBlogPosts`, `getBlogPostBySlug`).
  Wrapper `safeQuery()` returns bundled defaults if `!isSupabaseConfigured` or
  the query errors/returns empty. `getClinicHours()` normalises to 7 rows,
  Monday-first, with `label` + human `summary`. `getSiteContent()` deep-merges
  DB `site_content` rows over `defaultSiteContent`.
- **Admin reads:** `src/lib/data/admin.ts` — `adminGet*` functions use
  `createAdminClient()` (service key, bypasses RLS → sees unpublished).
  `adminGetDashboard()` computes status counts + today/upcoming/recent-enquiries.
- **Admin writes:** `src/app/actions/admin/*` — each action calls `ensureAdmin()`
  (`hasServiceRole` check + `getAdminSession()` + returns a service-role client),
  re-validates with a Zod schema, mutates, then `revalidatePath(...)` for the
  affected public + admin routes.
- **Public writes:** `createAppointmentAction`, `submitContactAction` — Zod
  parse → honeypot check → in-memory rate limit → (appointments only)
  `isSlotFree()` server check → insert via the **cookie-bound** `server.ts`
  client (RLS `*_public_insert` policy). When Supabase is unconfigured, they
  return `ok:true, persisted:false` so the UX (reference id + WhatsApp deep
  link) still works.

### 4.6 Fallback content architecture

`src/lib/content/defaults.ts` holds fully-typed default data for every
public resource. The site renders 100% from these when Supabase is not
configured, and `supabase/seed/seed.sql` mirrors the same content into the DB.
`src/lib/site.ts` is the single source of truth for NAP + navigation +
service-category metadata + disclaimer strings + `whatsappLink()`.

### 4.7 Validation architecture

`src/lib/validations/`:
- `shared.ts` — `normalizeIndianPhone()`, `indianPhoneSchema` (→ `+91XXXXXXXXXX`),
  `optionalEmailSchema`, `slugSchema`, `serviceCategorySchema`,
  `galleryCategorySchema`, `faqCategorySchema`, `appointmentStatusSchema`.
- `appointment.ts` — `appointmentFormSchema` (incl. `consent: literal(true)` and
  `company` honeypot), `appointmentStatusUpdateSchema`, `availabilityQuerySchema`.
- `contact.ts` — `contactFormSchema`.
- `admin.ts` — `loginSchema`, `serviceSchema`, `doctorSchema`, `gallerySchema`,
  `dentalSpecialtySchema`, `beforeAfterSchema`, `testimonialSchema`, `faqSchema`,
  `clinicHoursSchema` (7-element array), `siteContentSchema`, `blogPostSchema`.

---

## 5. Public Website

Route group `(website)` — shared `Header` / `Footer` / `MobileBottomBar` /
`FloatingWhatsApp`; ISR `revalidate = 3600`. All statuses **✅ COMPLETE** unless
noted.

| Route | Purpose | Key components | Data source |
|---|---|---|---|
| `/` | Homepage (see §6) | `Hero`, `QuickActionBar`, `TrustStrip`, `ServiceGrid`, `DentalSpecialties`, `WhyChooseUs`, `DoctorCard`, `GalleryGrid`, `BeforeAfterGallery`, `TestimonialCard`, `FaqAccordion`, `CTASection`, `OpeningHours`, `ContactCard` | `getSiteContent`, `getFeaturedServices`, `getServices` (skin/hair/aesthetic), `getDentalSpecialties`, `getDoctors`, `getGallery`, `getBeforeAfter`, `getTestimonials`, `getFaqs({featuredOnly})`, `getClinicHours` |
| `/about` | Clinic story, approach, service areas | `PageHero`, `WhyChooseUs`, `MedicalDisclaimer`, `OpeningHours`, `ContactCard` | `getSiteContent`, `getClinicHours` |
| `/services` | All services grouped by category + category cards | `ServiceGrid`, `CTASection`, `MedicalDisclaimer` | `getServices()` |
| `/services/dental` `/services/skin` `/services/hair` `/services/aesthetic` | Category landing (thin wrappers around `<ServiceCategoryView>`) | `ServiceCategoryView`, `ServiceGrid`, `FaqAccordion` | `getServices({category})`, `getFaqs({category})` |
| `/services/[slug]` | Individual service detail: hero image, overview, "suitable for", steps, benefits, service FAQs, related, sticky booking rail, disclaimer | `PageHero`, `ServiceGrid`, `FaqAccordion`, `WhatsAppButton` | `getServiceBySlug`, `getRelatedServices`; `generateStaticParams` from `getServices()`; `generateMetadata` per service; `dynamicParams = true` |
| `/doctor` | Team list (or empty-state) | `DoctorCard`, `MedicalDisclaimer`, `CTASection` | `getDoctors()` |
| `/doctor/[slug]` | Doctor profile: photo, qualification/specialization/experience/languages, bio, services, booking CTAs, `Physician` JSON-LD | `PageHero`, `WhatsAppButton` | `getDoctorBySlug`; `generateStaticParams`; `generateMetadata` |
| `/gallery` | Filterable masonry gallery + lightbox; optional before/after slider section | `GalleryGrid` (client, category tabs + keyboard lightbox), `BeforeAfterGallery` | `getGallery()`, `getBeforeAfter()` |
| `/testimonials` | Published reviews or empty-state | `TestimonialCard`, `CTASection` | `getTestimonials()` — **0 rows; empty-state shown** |
| `/faq` | Accordion grouped by category + FAQPage JSON-LD | `FaqAccordion` | `getFaqs()` |
| `/contact` | NAP, hours, action buttons, contact form, Google Maps `output=embed` iframe | `ContactForm`, `OpeningHours`, `ContactCard`, action buttons, `MedicalDisclaimer` | `getClinicHours()` |
| `/appointment` | 5-step booking flow + sidebar (call/WhatsApp, hours, privacy note) | `AppointmentForm` (client), `OpeningHours` | `getServices`, `getDoctors`, `getClinicHours`; reads `?service=` / `?doctor=` |
| `/blog` | Article index or empty-state | inline cards | `getBlogPosts()` — **0 rows; empty-state shown** |
| `/blog/[slug]` | Article + Article JSON-LD + disclaimer | `PageHero`, `MedicalDisclaimer` | `getBlogPostBySlug`; `generateStaticParams` |
| `/privacy-policy` | Static legal copy (data collection explained) | `PageHero` | static |
| `/terms` | Static legal copy + medical disclaimer | `PageHero` | static |

Also: root `not-found.tsx`, `(website)/error.tsx`, `(website)/loading.tsx`,
`global-error.tsx`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`,
`/icon.svg`.

---

## 6. Homepage Features

Verified section order in `src/app/(website)/page.tsx` (top → bottom):

1. **Header** (`components/website/header.tsx`, client) — logo + clinic name,
   desktop nav (Home/About/Services▾/Doctors/Gallery/Testimonials/FAQ/Contact),
   Services hover dropdown (4 categories + "View all"), phone + WhatsApp icon
   buttons, gold **Book Appointment** button. Becomes translucent/blurred +
   bordered after `scrollY > 12`. Mobile: hamburger drawer, closes on link click
   (state adjusted via `onClick`, not an effect).
2. **Hero** (`hero.tsx`) — eyebrow, headline, supporting text (all from
   `site_content.hero`), **Book an Appointment** (gold) / **WhatsApp Us** /
   **Get Directions** buttons, address line, right-side clinic photo
   (`/images/clinic/operatory-wide.jpg`) with a floating "Hygienic, modern care"
   badge. `bg-surface` with decorative blurred blobs. `slide-up` entrance.
3. **QuickActionBar** (`quick-action-bar.tsx`) — 4-up card that overlaps the
   hero's bottom padding (`-mt-7 md:-mt-9`, `z-10`, elevated shadow):
   **Call Now**, **WhatsApp**, **Book Appointment**, **Get Directions**.
4. **TrustStrip** (`trust-strip.tsx`) — Dental / Skin / Hair / Aesthetic Care
   links in a bordered 4-up (2-up on mobile) row. *(Extracted from the hero in
   `0f5e14c` to fix an overlap bug.)*
5. **About** — eyebrow, `site_content.about.heading` + paragraphs, 4 check
   items, "Learn More About Us" outline button, 2 clinic photos. Uses `Reveal`.
6. **Services overview** — 4 category cards + "Popular treatments"
   `ServiceGrid` (featured services, `showCategory`) + "View all services".
7. **DentalSpecialties** (`dental-specialties.tsx`) — dark navy section, 4 large
   image cards with gold translucent labels, hover zoom, `Reveal` stagger.
8. **Skin & Hair Care** — two columns, 4 services each + "All … services".
   `MedicalDisclaimer variant="suitability"`.
9. **Aesthetic Care** — `ServiceGrid` of aesthetic services (4-up).
10. **WhyChooseUs** (`why-choose-us.tsx`) — 6 items from
    `site_content.why_choose_us.items`, lucide icons, `Reveal`.
11. **Doctors** — first 3 `DoctorCard`s + "View all doctors" (rendered only if
    `doctors.length > 0`).
12. **Gallery** — first 6 images via `GalleryGrid` + "Open full gallery"
    (only if gallery non-empty).
13. **Before & After** — `BeforeAfterGallery` (only if rows with consent +
    published exist; currently none → section hidden).
14. **Testimonials** — grid + "See more reviews" (only if rows exist; currently
    none → section hidden).
15. **FAQ** — `SectionHeading` + `FaqAccordion` of featured FAQs (max 6) +
    "All FAQs". FAQPage JSON-LD emitted.
16. **Appointment CTA** (`CTASection`, navy) — heading/body from
    `site_content.cta`, gold **Book Appointment** + **WhatsApp Us**.
17. **Location / Contact** (`id="location"`) — Google Maps embed iframe +
    `ContactCard` + `OpeningHours`.
18. **Footer** (`footer.tsx`) — logo + note, Explore nav, Services nav, Visit-us
    (NAP + phone + WhatsApp + email), Opening hours (live), social icon links
    (only rendered when a URL is set — currently none), bottom bar with
    ©, Privacy / Terms / FAQ links and a pill **🔒 Admin Login** button
    (`/admin/login`). *(Button styling added in `7fd0583`.)*

**CTA / contact mechanisms (all real links, no fake buttons):**
- Phone: `tel:+919430740698` (from `siteConfig.phone.tel`).
- WhatsApp: `https://wa.me/919430740698` + optional prefilled `?text=` message
  (`whatsappLink()` in `site.ts`).
- Directions: `https://www.google.com/maps/dir/?api=1&destination=<encoded NAP>`
  (`siteConfig.maps.directions`) — **no lat/long invented**.
- Book: `/appointment` (+ `?service=<slug>` / `?doctor=<slug>` deep links from
  service/doctor pages and cards).
- `MobileBottomBar` (fixed, `<lg`, hidden on `/admin`) — Call / WhatsApp /
  Appointment.
- `FloatingWhatsApp` (fixed, hidden on `/admin`).

**Animation:** `slide-up` hero entrance; `Reveal` (IntersectionObserver
fade + translate) on about / specialties / why-choose-us; hover elevation +
image zoom on cards; smooth scroll. All disabled under
`prefers-reduced-motion` (global media query in `globals.css`).

---

## 7. Services System

- **Categories** (`serviceCategories` in `site.ts` + `service_category` enum):
  `dental`, `skin`, `hair`, `aesthetic`.
- **Table `services`** (see §11) — arrays `suitable_for`, `procedure_steps`,
  `benefits` (`text[]`); `faqs` (`jsonb` array of `{question, answer}`);
  `featured` + `published` booleans; `display_order` int; `meta_title` +
  `meta_description` (SEO). `slug` unique. `updated_at` trigger.
- **Public rendering:** `getServices({category?, includeUnpublished?})`,
  `getFeaturedServices(limit)` (featured-first), `getServiceBySlug`,
  `getRelatedServices` (same category, excludes self).
- **Detail page** `/services/[slug]`: hero image (service `image_url` or
  category fallback), Overview (`description` || `short_description`),
  "Who it may be suitable for", "What the treatment involves" (numbered),
  Benefits (2-up chips), service FAQs (`FaqAccordion`), Related services,
  sticky booking rail (Book + WhatsApp with prefilled message),
  `MedicalDisclaimer variant="suitability"`. `generateStaticParams` +
  `generateMetadata` (uses `meta_title`/`meta_description` when set).
  `serviceJsonLd` (`MedicalProcedure`) + `faqJsonLd` + `breadcrumbJsonLd`.
- **Admin CRUD:** `/admin/services` (list, publish toggle, delete),
  `/admin/services/new`, `/admin/services/[id]` (edit). Form
  (`service-form.tsx`): title (auto-slug), slug, category, display order,
  short description, full description, image (upload → `services` bucket),
  suitable-for / steps / benefits (one per line → `text[]`), repeatable
  service-FAQ rows, SEO title + description, featured + published checkboxes.
  Server action `saveServiceAction` (Zod `serviceSchema`, `23505` → "slug in
  use"), `toggleServicePublishedAction`, `deleteServiceAction`; all
  `revalidatePath` the homepage, `/services`, category pages, the slug page,
  `/appointment`, `/sitemap.xml`.
- **Filters / search:** category grouping on `/services`; no free-text search on
  the public site. Admin services page has no search (small list).

---

## 8. Appointment System

### 8.1 Public booking flow — `src/components/forms/appointment-form.tsx` (client)

5 steps: **Service → Doctor → Date → Time → Your details**, then a
**confirmation** view.

- **Step 1 Service:** radio list grouped by category (from `getServices()`).
  Pre-selected from `?service=` if valid.
- **Step 2 Doctor:** "No preference" + one radio per published doctor.
  Pre-selected from `?doctor=`.
- **Step 3 Date:** `react-day-picker` single mode, `weekStartsOn={1}`,
  `disabled={{ before: today, after: today + BOOKING_WINDOW_DAYS }}`
  (`BOOKING_WINDOW_DAYS = 45`, `src/lib/appointments.constants.ts`).
- **Step 4 Time:** `GET /api/availability?date=YYYY-MM-DD` → grid of 30-min
  slots; unavailable slots disabled + struck through; message when closed / all
  booked.
- **Step 5 Details:** `patient_name*`, `phone*` (regex
  `/^(?:\+?91[-\s]?)?[6-9]\d{9}$/`), `email` (optional), `message` (optional),
  `consent*` checkbox ("I agree to be contacted regarding this appointment"),
  hidden `company` honeypot. Live summary of the chosen service/clinician/
  date/time.

### 8.2 Submit — `createAppointmentAction` (`src/app/actions/appointments.ts`)

1. Zod `appointmentFormSchema.safeParse` (phone normalised to `+91XXXXXXXXXX`;
   `consent` must be literal `true`).
2. Honeypot: if `company` non-empty → return a fake success, do nothing.
3. Rate limit: `rateLimit("appointment:<ip>", { limit: 5, windowMs: 600_000 })`
   (in-memory).
4. Resolve `service_slug` → service row (title + id), `doctor_slug` → doctor.
5. `isSlotFree(date, time)` server check (`src/lib/appointments.ts`).
6. If `!isSupabaseConfigured` → return `ok:true, persisted:false` with a
   generated `JDA-…` reference.
7. Insert into `appointments` (status `pending`, `source "website"`,
   `service_id`/`doctor_id` only if they look like UUIDs). `23505` (unique
   violation on the active-slot index) → "that time was just booked".
8. `revalidatePath("/appointment")` + `revalidatePath("/admin/appointments")`.

### 8.3 Confirmation view

Shows: **Appointment ID** (`reference`, e.g. `JDA-AB12CD`), name, service,
clinician, date, time. Buttons: **WhatsApp Clinic** (prefilled message with all
details, exactly per the original spec wording) and **Call Clinic** (`tel:`).
No email is sent.

### 8.4 Availability / slot generation — `src/lib/appointments.ts`

- `getAvailability(dateStr)`:
  - validates date; rejects past dates and dates > `BOOKING_WINDOW_DAYS` ahead.
  - reads `clinic_hours` for that weekday (`getClinicHours()`); if closed →
    `{ isOpen:false }`.
  - `slotsForDay(row)` = 30-min steps across `morning_start→morning_end` **and**
    `evening_start→evening_end` (`SLOT_MINUTES = 30`).
  - if the date is today → drops slots before `now + MIN_LEAD_MINUTES` (90).
  - queries `appointments` for that date where `status in ('pending','confirmed')`
    → marks those times unavailable.
- `isSlotFree(date, time)` → re-runs `getAvailability` and checks the slot.
- `GET /api/availability` (`src/app/api/availability/route.ts`,
  `force-dynamic`, `Cache-Control: no-store`).

### 8.5 Statuses & admin management

- `appointment_status` enum: `pending`, `confirmed`, `completed`, `cancelled`,
  `no_show`.
- **Double-booking prevention:** partial unique index
  `appointments_active_slot_idx` on `(appointment_date, appointment_time)`
  `WHERE status in ('pending','confirmed')` **plus** the server-side
  `isSlotFree` check **plus** a clash re-check inside
  `updateAppointmentStatusAction` when moving to `confirmed`.
- **Admin** `/admin/appointments` (`components/admin/appointments-table.tsx`,
  client): search (name / phone / reference / email), filter by status + by
  service, detail dialog, per-row actions **Confirm / Complete / Cancel** +
  **Delete** (+ "call patient"). Actions call
  `updateAppointmentStatusAction` / `deleteAppointmentAction`
  (`src/app/actions/admin/appointments.ts`) then `router.refresh()`.
- **Email / SMS:** none. WhatsApp is deep-link only.

### 8.6 Contact form (separate table)

`/contact` `ContactForm` → `submitContactAction` → inserts into **`enquiries`**
(`status "new"`, `source "contact_form"`). Rate-limited + honeypot. Shown in the
dashboard "Recent enquiries". No admin CRUD page for enquiries beyond the
dashboard list (⚠️ see §22/§24).

---

## 9. Admin Dashboard

All under `/admin/(dashboard)/*`, guarded by `requireAdmin()` +
`dynamic = "force-dynamic"`. Every page shows a "add `SUPABASE_SERVICE_ROLE_KEY`"
notice instead of data when `hasServiceRole` is false.

| Route | Capabilities | Status |
|---|---|---|
| `/admin/login` | Email + password sign-in (`signInAction`). Shows a config warning if Supabase env is missing. | ✅ |
| `/admin` (Dashboard) | Status count cards (Total / Pending / Confirmed / Completed / Cancelled / No-show, each links to a filtered list), Today's appointments table, Upcoming list (pending/confirmed, next 8), Recent enquiries (6). Read-only. | ✅ |
| `/admin/appointments` | See §8.5 — search, filter, view, confirm/complete/cancel/no-show, delete. | ✅ |
| `/admin/services` (+`/new`, `/[id]`) | Full CRUD, publish toggle, display order, featured flag, per-service FAQs, SEO fields, image upload. | ✅ |
| `/admin/doctors` (+`/new`, `/[id]`) | Full CRUD, publish toggle, photo upload, languages/services lists, display order. | ✅ |
| `/admin/gallery` | `GalleryManager` (client dialog): add/edit/delete image, upload to `gallery` bucket, title, **alt text (required)**, category, display order, published toggle. Delete also removes the storage object (via `storage_path`). | ✅ |
| `/admin/testimonials` | `TestimonialsManager`: add/edit/delete, rating (1–5), review, service, display date, display order, **published toggle** (default unpublished). UI warns against fabricated reviews. | ✅ |
| `/admin/faqs` | `FaqsManager`: add/edit/delete, category, "show on homepage" (featured) flag, display order, published toggle. | ✅ |
| `/admin/content` | `ContentForm`: edit `site_content` blocks — hero (eyebrow/headline/subheadline/2 CTA labels), about (heading + body lines), why-choose-us (repeatable list), CTA (heading/body), footer note, social URLs (instagram/facebook/youtube/googleBusiness). "Preview site" opens `/` in a new tab. | ✅ (no separate draft/preview mode) |
| `/admin/settings` | `HoursForm`: per-day `is_open` + morning + evening time ranges → `clinic_hours` (drives booking slots). Also a read-only panel explaining NAP lives in `src/lib/site.ts`. | ✅ |
| `/admin/profile` | Shows name / email / role / member-since; sign-out; note on password reset + adding admins. | ✅ |

**Dental specialties** (homepage section) have `saveSpecialtyAction` /
`deleteSpecialtyAction` server actions and a Zod schema, **but no admin UI page
yet** — 🟡 PARTIAL (managed via SQL / seed for now).

**Before/After** has a table, RLS, Zod `beforeAfterSchema`, a public
`BeforeAfterGallery` slider, and a `consent_obtained` gate — **but no admin UI
page and no server actions** — 🟡 PARTIAL.

**Blog** has table + RLS + Zod `blogPostSchema` + public `/blog` & `/blog/[slug]`
+ Article JSON-LD — **but no admin UI and no server actions** — 🟡 PARTIAL.

**Permissions:** every authenticated `admin_users` member has full access to all
of the above. Role values exist but are not enforced.

---

## 10. Authentication & Authorization

- **Provider:** Supabase Auth (email + password), via `@supabase/ssr` cookie
  sessions.
- **Admin identity table:** `public.admin_users` — `id` (PK, FK →
  `auth.users.id` `on delete cascade`), `email`, `full_name`, `role`
  (`admin_role` enum), `created_at`.
- **`admin_role` enum:** `admin`, `super_admin`, `editor`, `receptionist`.
  Only `admin` / `super_admin` are used by tooling; **no role-based route or
  action gating is implemented** — membership in `admin_users` = full access.
- **`public.is_admin()`** — `SECURITY DEFINER`, `stable`, `search_path = public`
  → `exists (select 1 from admin_users where id = auth.uid())`. Used by every
  RLS policy for privileged access.
- **`requireAdmin()`** (`src/lib/auth.ts`) — server-side gate used by the
  dashboard layout and `/admin/profile`. `getAdminSession()` is the safe
  non-throwing variant used elsewhere.
- **`src/proxy.ts`** — Next 16 proxy (formerly middleware). First-gate redirect
  + session refresh.
- **Server-side authorization for writes:** `ensureAdmin()`
  (`src/app/actions/admin/_helpers.ts`) — `hasServiceRole` + `getAdminSession()`;
  returns a **service-role** client. Public write actions rely on RLS
  `*_public_insert` policies instead.
- **RLS:** enabled on all 13 public tables (see §11).
- **Known limitation:** `getAdminSession()` wraps `cookies()` access in
  `try/catch { return null }`, which could swallow a Next dynamic-render
  bail-out — mitigated by `dynamic = "force-dynamic"` on the admin layout.

**No credentials are stored in the repo.** New admins are created with
`npm run create-admin` (§16) or via the Supabase dashboard + a manual
`admin_users` insert (README §3).

---

## 11. Database

Source of truth: `supabase/migrations/0001_init.sql` (schema + RLS),
`supabase/migrations/0002_storage.sql` (buckets), `supabase/seed/seed.sql`
(data), `supabase/setup.sql` (all three concatenated for one-paste setup).
Hand-maintained TS types: `src/types/database.ts`.

### 11.1 Tables (13)

| Table | Key columns (abridged) | Notes |
|---|---|---|
| `admin_users` | `id uuid PK → auth.users`, `email`, `full_name`, `role admin_role`, `created_at` | RLS: self or `is_admin()` may read; writes via service role only. |
| `services` | `id uuid PK`, `title`, `slug unique`, `category service_category`, `short_description`, `description`, `suitable_for text[]`, `procedure_steps text[]`, `benefits text[]`, `faqs jsonb`, `image_url`, `featured bool`, `published bool`, `display_order int`, `meta_title`, `meta_description`, `created_at`, `updated_at` | idx `(category, display_order)`; `updated_at` trigger. |
| `doctors` | `id`, `name`, `slug unique`, `title`, `qualification`, `specialization`, `experience`, `bio`, `image_url`, `languages text[]`, `services text[]`, `published`, `display_order`, timestamps | `updated_at` trigger. |
| `gallery_images` | `id`, `image_url`, `storage_path`, `title`, `category gallery_category` (default `clinic`), `alt_text` (NOT NULL), `display_order`, `published`, `created_at` | idx `(category, display_order)`. |
| `dental_specialties` | `id`, `title`, `subtitle`, `image_url`, `href`, `display_order`, `published`, `created_at` | homepage section. |
| `before_after` | `id`, `treatment`, `description`, `before_url`, `after_url`, `consent_obtained bool` (default false), `published bool` (default false), `display_order`, `created_at` | public read requires `published AND consent_obtained`. |
| `testimonials` | `id`, `patient_name`, `rating smallint` (1–5 check, default 5), `review`, `service`, `photo_url`, `display_date date`, `published` (default false), `display_order`, `created_at` | |
| `faqs` | `id`, `question`, `answer`, `category faq_category` (default `general`), `featured bool`, `display_order`, `published bool` (default true), timestamps | `updated_at` trigger. |
| `appointments` | `id`, `reference text unique`, `patient_name`, `phone`, `email`, `service_id → services (on delete set null)`, `service_label`, `doctor_id → doctors (on delete set null)`, `doctor_label`, `appointment_date date`, `appointment_time time`, `message`, `status appointment_status` (default `pending`), `consent bool`, `source text` (default `website`), timestamps | **partial unique** `(appointment_date, appointment_time) WHERE status in ('pending','confirmed')`; idx on `appointment_date` and `status`; `set_appointment_reference()` BEFORE INSERT trigger (`JDA-` + first 6 hex of the uuid); `updated_at` trigger. |
| `enquiries` | `id`, `name`, `phone`, `email`, `subject`, `message`, `consent bool`, `status enquiry_status` (default `new`), `source text` (default `contact_form`), `created_at` | idx `(status, created_at desc)`. |
| `clinic_hours` | `day_of_week smallint PK` (0–6 check, 0 = Sunday), `is_open bool` (default true), `morning_start time`, `morning_end time`, `evening_start time`, `evening_end time` | seeded 7 rows, open every day 09:00–14:00 & 16:00–20:00. |
| `site_content` | `key text PK`, `value jsonb` (default `{}`), `updated_at` | keys in use: `hero`, `about`, `why_choose_us`, `cta`, `footer`, `social`. `updated_at` trigger. |
| `blog_posts` | `id`, `title`, `slug unique`, `cover_image_url`, `excerpt`, `content`, `author`, `category`, `seo_title`, `seo_description`, `status blog_status` (default `draft`), `published_at`, timestamps | `updated_at` trigger. |

### 11.2 Enums

`service_category` (dental/skin/hair/aesthetic) ·
`appointment_status` (pending/confirmed/completed/cancelled/no_show) ·
`enquiry_status` (new/in_progress/resolved) ·
`admin_role` (admin/super_admin/editor/receptionist) ·
`gallery_category` (clinic/dental/skin/hair/aesthetic/team/results) ·
`faq_category` (dental/skin/hair/aesthetic/appointments/general) ·
`blog_status` (draft/published).

### 11.3 Functions & triggers

- `public.set_updated_at()` → BEFORE UPDATE on services, doctors, faqs,
  appointments, site_content, blog_posts.
- `public.set_appointment_reference()` → BEFORE INSERT on appointments.
- `public.is_admin()` → used by all privileged RLS policies.

### 11.4 RLS policies (summary)

RLS **enabled on all 13 tables.**

- **Public SELECT** where `published = true` (or equivalent) OR `is_admin()`:
  `services`, `doctors`, `gallery_images`, `dental_specialties`,
  `testimonials`, `faqs`, `blog_posts` (`status='published'`),
  `before_after` (`published AND consent_obtained`).
- **Public SELECT unconditionally:** `clinic_hours`, `site_content`.
- **`admin_users` SELECT:** `id = auth.uid() OR is_admin()`.
- **Admin (`is_admin()`) FOR ALL:** services, doctors, gallery_images,
  dental_specialties, before_after, testimonials, faqs, blog_posts,
  clinic_hours, site_content.
- **`appointments`:** public INSERT `WITH CHECK (consent = true AND status =
  'pending' AND appointment_date >= current_date)`; admin SELECT/UPDATE/DELETE.
- **`enquiries`:** public INSERT `WITH CHECK (consent = true)`; admin
  SELECT/UPDATE/DELETE.
- The **service/secret key bypasses RLS** and is what admin server actions use
  after `ensureAdmin()`.

### 11.5 Relationships

- `admin_users.id` → `auth.users.id` (cascade delete).
- `appointments.service_id` → `services.id` (set null on delete).
- `appointments.doctor_id` → `doctors.id` (set null on delete).
- Everything else is denormalised (e.g. `appointments.service_label`,
  `doctor_label` are copied at insert time so history survives edits/deletes).

---

## 12. Supabase Storage

| Bucket | Public? | Purpose | Admin section |
|---|---|---|---|
| `gallery` | ✅ public read | Gallery photos | `/admin/gallery` |
| `doctors` | ✅ public read | Doctor portraits | `/admin/doctors` (form image field) |
| `services` | ✅ public read | Service hero/card images | `/admin/services` (form image field) |
| `content` | ✅ public read | Generic content images (fallback bucket for `ImageField`) | — |

- **Policies** (`0002_storage.sql`): `SELECT` public for all four buckets;
  `INSERT` / `UPDATE` / `DELETE` require `to authenticated` **and**
  `public.is_admin()`.
- **Upload flow:** `components/admin/form-kit.tsx` `<ImageField>` →
  `FormData` → `uploadImageAction(formData)` (`src/app/actions/admin/upload.ts`)
  → `ensureAdmin()` → type check (jpeg/png/webp/avif) + size check (≤ 6 MB) →
  `supabase.storage.from(bucket).upload("<year>/<slug>-<ts>.<ext>")` →
  returns `{ url: publicUrl, path }`. The path is stored (e.g.
  `gallery_images.storage_path`) so deletes can remove the object.
- **Delete flow:** `deleteGalleryImageAction` fetches `storage_path`, deletes
  the row, then `storage.from('gallery').remove([path])`.
- **`next.config.ts`** allows `next/image` from
  `<project>.supabase.co/storage/v1/object/public/**` and `*.supabase.co/...`.
- **Current state:** buckets exist; **no objects uploaded yet** (all images are
  local `/public/images/*` paths from the seed).

---

## 13. Content Management

- **Database-driven, with code fallback.** Public reads (`src/lib/data/index.ts`)
  return DB rows when Supabase is configured and the query succeeds; otherwise
  they return values from **`src/lib/content/defaults.ts`**.
- **Homepage content blocks:** `site_content` table, keys `hero`, `about`,
  `why_choose_us`, `cta`, `footer`, `social`. Edited at `/admin/content`
  (`saveSiteContentAction` upserts all six keys). `getSiteContent()` merges DB
  over `defaultSiteContent`.
- **Opening hours:** `clinic_hours` (7 rows). Edited at `/admin/settings`
  (`saveClinicHoursAction`). Feeds the footer, `/contact`, `/about`, the
  `OpeningHours` component, booking slot generation, and
  `openingHoursSpecification` in JSON-LD.
- **Services / Doctors / Gallery / Testimonials / FAQs:** DB tables with admin
  CRUD (see §9), fallbacks in `defaults.ts`.
- **Doctor:** one placeholder row ("Clinical Team") in seed + `defaults.ts` —
  clearly marked as placeholder, no fabricated credentials.
- **Social links:** `site_content.social` (instagram / facebook / youtube /
  googleBusiness). Footer renders an icon **only when a URL is set** — currently
  all blank, so no social icons show.
- **NAP + navigation + disclaimers:** hard-coded in `src/lib/site.ts` (single
  source of truth; intentionally **not** DB-editable to guarantee consistency).

---

## 14. SEO

**Implemented (✅):**

- **Root metadata** (`src/app/layout.tsx`): `metadataBase` from
  `siteConfig.url`, title default + `%s` template, description, keywords,
  authors/creator/publisher, `formatDetection`, canonical `/`, icons
  (`/icon.svg` + apple `/images/logo.jpg`), Open Graph, Twitter
  `summary_large_image`, `robots: index/follow`. `viewport` themeColor
  `#0f2544`, `colorScheme: light`.
- **Per-page metadata** via `buildMetadata()` (`src/lib/seo/metadata.ts`):
  title, description, canonical URL, robots, OG, Twitter, optional `keywords`
  and OG images. Used on about, `/services`, the 4 category pages,
  `/services/[slug]` (`generateMetadata`, honours `meta_title`/`meta_description`),
  `/doctor`, `/doctor/[slug]`, `/gallery`, `/testimonials`, `/faq`, `/contact`,
  `/appointment`, `/blog`, `/blog/[slug]`, `/privacy-policy`, `/terms`.
- **JSON-LD** (`src/lib/seo/structured-data.tsx`, rendered via `<JsonLd>`):
  - `localBusinessJsonLd` — `@type: ["Dentist","MedicalClinic","LocalBusiness"]`,
    `@id .../#clinic`, name/description/url/telephone/email/image/logo,
    `priceRange "₹₹"`, `PostalAddress`, `areaServed` (Place list),
    `medicalSpecialty`, `availableService` (Dental/Skin/Hair/Aesthetic),
    `openingHoursSpecification` built from `clinic_hours`, `sameAs` (only if
    social URLs set). **No `geo` / latitude / longitude** (none provided).
  - `websiteJsonLd` — `WebSite`.
  - Both emitted from `(website)/layout.tsx` (site-wide).
  - `breadcrumbJsonLd` — on about, services, category, service detail, doctor,
    doctor detail, gallery, testimonials, faq, contact, appointment, blog,
    blog detail.
  - `serviceJsonLd` — `MedicalProcedure` on `/services/[slug]`.
  - `faqJsonLd` — `FAQPage` on the homepage (featured), `/faq`, category pages
    with FAQs, and service detail pages with FAQs.
  - Inline `Physician` on `/doctor/[slug]`; inline `Article` on `/blog/[slug]`.
- **`src/app/sitemap.ts`** — 16 static routes + dynamic `/services/[slug]`,
  `/doctor/[slug]`, `/blog/[slug]` (from the data layer), with `lastModified` /
  `changeFrequency` / `priority`.
- **`src/app/robots.ts`** — `allow: "/"`, `disallow: ["/admin", "/admin/",
  "/api/"]`, `sitemap` + `host`.
- **`src/app/opengraph-image.tsx`** — branded 1200×630 PNG via `next/og`.
- **Semantic HTML / headings:** single `<h1>` per page (`PageHero` /
  `SectionHeading as="h1"`), `<main id="main">`, nav landmarks, `aria-label`s.
- **Image alt text:** required field in the gallery admin; descriptive alts on
  seeded images; decorative images use `alt=""`.
- **NAP consistency:** every surface pulls from `src/lib/site.ts`.
- **Security headers** (`next.config.ts`): `X-Content-Type-Options`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`.

**Planned / not done (⏳):** submitting the sitemap to Search Console; real OG
images per service; verifying Rich Results; `NEXT_PUBLIC_SITE_URL` still
`localhost` so all absolute URLs are placeholders until deployment.

---

## 15. Environment Variables

**Names only — never commit or print values.** `.env*` is git-ignored **except
`.env.example`** (a committed placeholder template; `!.env.example` in
`.gitignore`).

| Name | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public (browser) | prod: **yes** (local: optional) | Canonical base URL (no trailing slash) for metadata, canonical tags, sitemap, robots, JSON-LD, OG. Falls back to a placeholder domain if unset. |
| `NEXT_PUBLIC_SUPABASE_URL` | public | for any backend feature | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` **or** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | for any backend feature | Browser Supabase key. Code accepts **either** name (`config.ts`). |
| `SUPABASE_SERVICE_ROLE_KEY` **or** `SUPABASE_SECRET_KEY` | **server-only** | for the admin dashboard + Storage uploads + `create-admin` | Privileged key; bypasses RLS. Code accepts **either** name. **Never expose to the browser.** |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | public | no (unused) | Reserved; the site uses a **keyless** Google Maps `output=embed` iframe, so this is not needed. |

- **Local (`.env.local`, git-ignored):** currently set →
  `NEXT_PUBLIC_SITE_URL` (localhost), `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
- **Vercel (when deploying):** set all of `NEXT_PUBLIC_SITE_URL` (real domain),
  `NEXT_PUBLIC_SUPABASE_URL`, a browser key var, and a secret key var — for
  Production **and** Preview. Mark the secret key as sensitive.
- **Public vs server-only:** anything prefixed `NEXT_PUBLIC_` is embedded in the
  client bundle; the secret/service-role key is only read in `server-only`
  modules (`src/lib/supabase/admin.ts`, action helpers, `scripts/create-admin.mjs`).

---

## 16. Commands

From `package.json` (`scripts`):

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node ≥ 20; developed on Node 24). |
| `npm run dev` | `next dev` — local dev server (`http://localhost:3000`). |
| `npm run build` | `next build` — production build (runs TypeScript check). |
| `npm run start` | `next start` — serve the production build. |
| `npm run lint` | `eslint` (flat config). |
| `npm run create-admin "<email>" ["<password>"] ["Full Name"]` | `node scripts/create-admin.mjs` — parses `.env.local`, uses the secret/service key to create (or, if the auth user exists, password-reset) a Supabase Auth user and upsert an `admin_users` row with role `super_admin`. Omit the password to be prompted for it (hidden input, needs a TTY). Requires the migrations to have been run. |

**No test command.** Database/schema is applied manually via the Supabase SQL
Editor (`supabase/setup.sql`) or the Supabase CLI (`supabase db push` +
`psql -f supabase/seed/seed.sql`) — see README §2. No deploy script (Vercel
builds from git).

---

## 17. Current Data State

Verified against the connected Supabase project on **2026-09-10**:

| Table / resource | Count |
|---|---|
| `services` | **31** (16 dental, 6 skin, 5 hair, 4 aesthetic) |
| `doctors` | **1** (placeholder "Clinical Team") |
| `gallery_images` | **7** (all category `clinic`, local `/images/clinic/*` paths) |
| `dental_specialties` | **4** |
| `faqs` | **9** (6 featured for the homepage) |
| `clinic_hours` | **7** (open every day, 09:00–14:00 & 16:00–20:00) |
| `site_content` | **6** keys: `hero`, `about`, `why_choose_us`, `cta`, `footer`, `social` |
| `before_after` | **0** |
| `testimonials` | **0** (intentionally not fabricated) |
| `blog_posts` | **0** |
| `appointments` | **0** |
| `enquiries` | **0** |
| `admin_users` | **1** — `admin@jeevandental.in`, role `super_admin` |
| Auth users | **1** — `admin@jeevandental.in` (email confirmed) |
| Storage buckets | **4** — `gallery`, `doctors`, `services`, `content` (0 objects) |

---

## 18. Real Assets

Location conventions: `public/images/` (served), `images/` (original uploads,
kept for reference).

| Asset | Path | Type |
|---|---|---|
| Clinic logo | `public/images/logo.jpg` | **REAL** |
| Clinic interior / operatory (×7) | `public/images/clinic/operatory-{unit,wide,workstation,light,certificates,room,chair}.jpg` | **REAL** (opening-day photos of the treatment room) |
| Original uploads (×15, incl. duplicates) | `images/IMG-20260910-WA00*.jpg`, `images/dental-*.jpg`, `images/faq-lft.webp`, `images/logo.jpg` | **REAL** source files |
| Service / specialty images (×5) | `public/images/dental/{clear-aligners,dental-checkup,pediatric-dentistry,smile-designing,teeth-cleaning}.{jpg,webp}` | **PLACEHOLDER** — generic stock dental close-ups; **replace with real clinic photos** |
| Doctor photo | — | **MISSING** — placeholder profile has no image |
| Leftover framework SVGs | `public/{file,globe,next,vercel,window}.svg` | **UNUSED** — safe to delete |

**Needs replacement before launch:** the 5 stock dental images, a real doctor
photo (+ real doctor name/qualification/registration), and any before/after
imagery (only with written patient consent).

---

## 19. Business Information (verified, non-secret — from `src/lib/site.ts`)

| Field | Value |
|---|---|
| Business name | **Jeevan Dental & Aesthetic Clinic** |
| Tagline | "Complete Dental, Skin, Hair & Aesthetic Care" |
| Address line 1 | Near Petrol Pump, Main Road |
| Locality / Town | Mahuadanr |
| District | Latehar |
| State | Jharkhand |
| PIN | 822119 |
| Country | India (`IN`) |
| Full (one-line) | Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119, India |
| Phone (display) | +91 94307 40698 |
| Phone (E.164 / tel) | +919430740698 |
| WhatsApp | https://wa.me/919430740698 (same number) |
| Email | jeevandentalclinic@gmail.com |
| Services | Dental Care · Skin Care · Hair Care · Aesthetic Care |
| Service areas (`site.ts`) | Mahuadanr, Latehar, Netarhat, Garu, Barwadih, Chhipadohar |
| Hours | Open all 7 days; 09:00–14:00 and 16:00–20:00 (editable in `/admin/settings`) |
| Google Maps | Keyless links/embed built from the address string; **no verified Place ID / coordinates / GBP URL** in the codebase |
| Social profiles | None configured (all `site_content.social` values blank) |

---

## 20. Design System

Implemented in `src/app/globals.css` (Tailwind v4 `@theme`) + `components/ui/*`.

- **Direction:** premium, medical, elegant, warm — deep navy + elegant teal +
  warm champagne/gold accent on off-white/beige neutrals. Minimal gradients,
  subtle motion.
- **Colour scales (tokens):** `navy` 50–950, `teal` 50–900, `gold` 50–900,
  plus `cream #faf8f4`, `beige #f1eadd`, `mist #eef2f6`.
- **Semantic tokens:** `--color-background #fff`, `--color-surface #faf8f4`,
  `--color-surface-muted #f1eadd`, `--color-foreground #14202e`,
  `--color-muted-foreground #566475`, `--color-primary #0f2544` (navy-800),
  `--color-accent #156b66` (teal), `--color-gold #bd8f45`,
  `--color-border #e4e0d6`, `--color-ring #156b66`, `--color-success/warning/danger`.
- **Typography:** body **Manrope** (`--font-manrope`), headings **Fraunces**
  serif (`--font-fraunces`, weights 400/500/600) — both via `next/font/google`
  in the root layout. `h1–h4` styled in the base layer (Fraunces, weight 500,
  balanced wrap, primary colour).
- **Radius:** `--radius .625rem`, `--radius-lg 1rem`, `--radius-xl 1.5rem`.
- **Shadows:** `--shadow-card`, `--shadow-elevated` (soft, navy-tinted).
- **Layout utilities:** `.container-page` (`max-width: 80rem`, responsive
  padding), `.section` (`py 4rem` → `6rem` at `md`), `.eyebrow` (uppercase,
  tracked, teal), `.prose-clinic` (article typography without the Tailwind
  typography plugin).
- **Motion:** `@keyframes fade-in`, `slide-up`, `accordion-down/up`; `--animate-*`
  tokens; `Reveal` component (IntersectionObserver). A global
  `prefers-reduced-motion` block disables all of it.
- **Buttons** (`ui/button.tsx`, `cva`): variants `default` (navy), `accent`
  (teal), `gold`, `outline`, `ghost`, `subtle`, `link`, `whatsapp` (#1FA855),
  `destructive`; sizes `default`, `sm`, `lg`, `icon`. Hover lift + active nudge.
- **Cards:** `ui/card.tsx`; service/doctor cards use border + `--shadow-card`,
  hover `-translate-y-1` + `--shadow-elevated` + image zoom.
- **Forms:** `ui/{input,textarea,label,select,checkbox}.tsx`; focus ring
  (`--color-ring`), `aria-[invalid=true]` red styling; admin form helpers in
  `components/admin/form-kit.tsx` (`Field`, `SubmitBar`, `CheckboxRow`,
  `ImageField`).
- **Breakpoints:** Tailwind defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`,
  `2xl 1536`). Mobile-first; nav collapses `<lg`; `MobileBottomBar` shows `<lg`.
- **Reusable UI components** — `ui/`: accordion, avatar, badge, button, card,
  checkbox, dialog, dropdown-menu, input, label, select, separator, skeleton,
  sonner (Toaster), table, tabs, textarea. `website/`: 26 components (header,
  footer, hero, trust-strip, quick-action-bar, section-heading, page-hero,
  service-card/grid/category-view, dental-specialties, why-choose-us,
  doctor-card, testimonial-card, gallery-grid, before-after-slider,
  faq-accordion, cta-section, opening-hours, contact-card, action-buttons,
  social-icons, disclaimer, reveal, mobile-bottom-bar, floating-whatsapp).
  `admin/`: 17 components. `forms/`: appointment-form, contact-form.

---

## 21. Important Technical Decisions

| Decision | Choice | Reason (verified from code / README) |
|---|---|---|
| Framework | Next.js 16 App Router (Turbopack) | Full-stack: SSR/ISR public site + Server Actions for the admin, one deploy target. |
| Backend | Supabase (Postgres + Auth + Storage) | Single provider for DB, auth and file storage; RLS for security. |
| Rendering — public | Static + `revalidate = 3600` (ISR) | Public reads use a **cookie-less** Supabase client (`public.ts`) so pages don't opt into dynamic rendering; admin actions `revalidatePath` for freshness. |
| Rendering — admin | `dynamic = "force-dynamic"` | Always per-request (auth + live data); also avoids a prerender bail-out being swallowed by `getAdminSession`'s try/catch. |
| Fallback content | `src/lib/content/defaults.ts` | Site builds and previews with **zero backend**; seed mirrors the same data. |
| NAP source of truth | `src/lib/site.ts` (code, not DB) | Guarantees identical name/address/phone across header, footer, contact, JSON-LD (local SEO). |
| Auth model | Supabase Auth + `admin_users` table + `is_admin()` | Membership = access; role column reserved for future granularity. |
| Admin writes | Service-role client **after** `ensureAdmin()` | Simple, predictable; RLS still protects the anon/public path. |
| Double-booking | Partial unique index + server `isSlotFree` + confirm-time re-check | Defence in depth; DB is the final arbiter (`23505` handled). |
| Validation | Zod on client (shape) **and** re-validated server-side in every action | "Never trust the client." |
| Forms | React Hook Form (public/login) + plain `useState` (admin dialogs) | RHF for multi-field UX; admin managers are small dialogs. |
| Icons | lucide-react + custom brand SVGs | lucide 1.x removed brand icons; `social-icons.tsx` fills the gap. |
| Maps | Keyless Google Maps `output=embed` iframe | Avoids exposing / needing an API key. |
| Rate limiting | In-memory fixed-window (`src/lib/rate-limit.ts`) | Adequate for a single small clinic; documented for scale. |
| Middleware | `src/proxy.ts` (Next 16 "proxy" convention) | Next 16 deprecates the `middleware` filename. |
| DB types | Hand-maintained **type aliases** in `src/types/database.ts` | Supabase's `GenericSchema` constraint needs the implicit index signature that `type` (not `interface`) provides. Regenerate with `supabase gen types` when the CLI is linked. |

---

## 22. Known Bugs / Issues

| Bug / Issue | Severity | Location | Status | Notes |
|---|---|---|---|---|
| ESLint `react-hooks/incompatible-library` warnings (×2) | Low | `components/forms/appointment-form.tsx:112`, `components/forms/contact-form.tsx:50` | Open (accepted) | RHF `watch()` can't be memoised by the React Compiler. Runtime behaviour is correct; `npm run lint` still exits 0. |
| `getAdminSession()` try/catch can swallow a Next dynamic-render bail-out | Low | `src/lib/auth.ts` | Mitigated | Admin layout is `force-dynamic`, so it doesn't trigger in practice. |
| Leftover framework SVGs in `public/` | Cosmetic | `public/{file,globe,next,vercel,window}.svg` | Open | Unused; safe to delete. |
| Duplicate original images | Cosmetic | `images/IMG-20260910-WA0041 (1).jpg`, `…WA0043 (1).jpg` | Open | Harmless; source folder only. |
| Stock/placeholder service images | Content | `public/images/dental/*` | Open | Must be replaced with real clinic photos. |
| Placeholder doctor profile | Content | seed + `defaults.ts` "Clinical Team" | Open (by design) | No fabricated credentials; replace with the real clinician. |
| `NEXT_PUBLIC_SITE_URL` = `http://localhost:3000` | Blocker for SEO/deploy | `.env.local` | Open | All absolute URLs (canonical/OG/sitemap/JSON-LD) are placeholders until set to the real domain. |
| No admin UI for `dental_specialties`, `before_after`, `blog_posts` | Medium | — | PARTIAL | Tables + RLS + public rendering exist; specialties also have server actions. Manage via SQL for now. |
| No CRUD page for `enquiries` (only dashboard list) | Medium | `/admin` | PARTIAL | Can't mark an enquiry `in_progress`/`resolved` from the UI yet. |
| Rate limiter is per-instance | Medium (at scale) | `src/lib/rate-limit.ts` | Open (accepted) | Move to a shared store (e.g. Upstash) if traffic/instances grow. |
| Secret key was shared in a chat session during setup | Security hygiene | — | Recommend rotate | Rotate the Supabase secret key, update `.env.local` + Vercel. |

**No `TODO`/`FIXME`/`HACK`/`@ts-ignore` comments exist in `src/`.**
**No TypeScript errors. `npm run build` passes.**

---

## 23. Known Limitations (intentional / not implemented)

- **No email notifications** (appointment received / confirmed, enquiry
  received). WhatsApp deep links + phone only.
- **No WhatsApp Business API / automation** — only `wa.me` links with prefilled
  text.
- **No payments / online deposits.**
- **No role-based permissions** — every `admin_users` member has full access.
- **No analytics** (no GA / Plausible / Vercel Analytics).
- **No clinical records / patient portal / login for patients.**
- **No i18n** — English (en-IN) only.
- **No automated tests.**
- **No CI** (no `.github/workflows`).
- **Blog, before/after, and dental-specialties** have no admin editing UI yet.
- **Google Business Profile** is not linked (no Place ID / GBP URL / `sameAs`).

---

## 24. Pending Features / Roadmap

### Next (high priority)
- Create a GitHub repo + push; deploy to Vercel with real env vars; set
  `NEXT_PUBLIC_SITE_URL` to the production domain.
- Replace placeholder service images and the placeholder doctor with real
  assets + real clinician details (name, qualification, registration).
- Admin **enquiries** page (list + status `new`/`in_progress`/`resolved` + delete).
- Admin UI for **dental specialties** (server actions already exist).
- Rotate the Supabase secret key.
- Real-device responsive QA at 360 / 390 / 414 / 768 / 1024 / 1280 / 1440 / 1920.
- End-to-end verification: submit a real appointment + enquiry, confirm the slot
  becomes unavailable, run an admin CRUD + gallery upload round-trip.

### Later (medium priority)
- Email notifications (e.g. Resend / Supabase Edge Function) for appointments +
  enquiries, with an opening-hours-aware auto-reply.
- Admin UI for **blog** (draft/publish) + **before/after** (with the
  `consent_obtained` gate enforced in the UI).
- Google Business Profile: add verified Place ID / coordinates / GBP URL and a
  real embedded map; wire `sameAs`.
- Role-based access (`super_admin` vs `editor` vs `receptionist`).
- Move rate limiting to a shared store.
- Submit sitemap to Search Console; validate Rich Results.
- Basic analytics.

### Future (optional)
- Automated tests (Vitest for lib + Playwright for the booking flow) + CI.
- Regenerate `src/types/database.ts` via `supabase gen types typescript`.
- Appointment reminder messages; ICS calendar attachment.
- Multi-language (Hindi).
- Image optimisation pipeline / CDN for Storage.

---

## 25. Current TODO (prioritised checklist)

- **P0** Point `NEXT_PUBLIC_SITE_URL` at the real domain (blocks correct
  SEO/OG/sitemap).
- **P0** Create GitHub repo, push, deploy to Vercel (set all env vars for
  Production + Preview; secret key marked sensitive).
- **P0** Replace placeholder dental images + placeholder doctor with real
  assets/details; remove `public/{file,globe,next,vercel,window}.svg`.
- **P0** Rotate the Supabase secret key; update `.env.local` + Vercel.
- **P1** Manual E2E test: appointment booking + double-booking block + admin
  status flow + gallery upload + content edit → verify `revalidatePath` works.
- **P1** Build the admin **enquiries** page.
- **P1** Real-device / breakpoint responsive QA.
- **P2** Admin UI for dental specialties (+ before/after, blog).
- **P2** Email notifications for appointments + enquiries.
- **P2** Add Google Business Profile data (Place ID / coordinates) + real map.
- **P3** Add tests + CI; regenerate DB types from Supabase.
- **P3** Analytics; role-based permissions; shared rate limiter.

---

## 26. Deployment Status

| Item | Status |
|---|---|
| Local development | ✅ Working — `npm run dev` / `npm run start` against the connected Supabase project; all routes smoke-tested (public `200`, `/admin` → `307` to login, availability API returns slots, `404` page works). |
| Git | ✅ Initialised. Branch `main` (tracks `origin/main`). Commits: `a53a7d8` → `7fd0583` → `e740f8f` → `3636066` → `0f5e14c` → `d40986d`. `.env.local` is **not** tracked. **`.gitignore` is intentionally not tracked** (removed in `d40986d`; kept locally via `.git/info/exclude`; its ignore rules still apply to the working tree). |
| GitHub | ✅ Pushed to **https://github.com/mdsahilkhan2001/dental-clinic** (`main`). `origin` uses the **HTTPS** URL (this machine has no SSH key registered with GitHub — the SSH push failed with `Permission denied (publickey)`; HTTPS auth via Git Credential Manager). Repo is private/public per the GitHub account setting. No secrets on the remote (verified: only `.env.example` placeholder; no `.env.local`, `.gitignore`, or `node_modules`). |
| Vercel | 🔴 Not deployed. No project, no `vercel.json` (not needed — standard Next preset). |
| Env vars in Vercel | 🔴 Not set (see §15). |
| Custom domain | 🔴 None. |
| Supabase (production) | ✅ Project connected. Migrations `0001` + `0002` applied, `seed.sql` loaded, 4 storage buckets created, 1 admin user (`admin@jeevandental.in`) linked. Auth redirect URLs for a prod domain: not yet added. |
| Deployment blockers | Vercel project + env vars + real `NEXT_PUBLIC_SITE_URL`. No code blockers — `npm run build` passes. |

### 26.1 `.gitignore` — NOT tracked (contents recorded here)

The `.gitignore` file exists in the working tree and is honoured by Git, but it
is **deliberately not tracked / not pushed** (removed in commit `d40986d`, listed
in `.git/info/exclude`). On a fresh `git clone` this file will be **missing** —
recreate it verbatim so `node_modules`, `.env.local`, `.next`, etc. stay
ignored:

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files — keep the template, ignore everything with real values
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

> ⚠️ **Because `.gitignore` is not in the repo, a cloner has no ignore rules
> until they recreate the file above.** Never run `git add -A` on a fresh clone
> before restoring it, or `node_modules` / `.env.local` could be staged.
> If you (re)create the file locally and don't want it to show as untracked,
> keep the `/.gitignore` line in `.git/info/exclude`.

---

## 27. Verification Checklist (for future sessions)

Tick only what **you** re-verify.

- [x] `npm install` completes (deps resolved; `package-lock.json` present)
- [x] `npm run lint` → 0 errors (2 known warnings)
- [x] `npm run build` → succeeds (55 static pages prerendered; admin dynamic)
- [x] Homepage renders (hero, specialties, NAP, WhatsApp link, JSON-LD present)
- [x] Public routes respond `200` (`/`, `/about`, `/services`,
      `/services/dental`, `/services/<slug>`, `/doctor`, `/gallery`, `/faq`,
      `/contact`, `/appointment`, `/testimonials`, `/blog`, `/privacy-policy`,
      `/terms`)
- [x] `/admin` redirects (`307`) to `/admin/login`; `/admin/login` renders
- [x] `/api/availability?date=YYYY-MM-DD` returns generated slots
- [x] `/sitemap.xml` and `/robots.txt` respond `200`
- [x] Custom `404` renders
- [x] LocalBusiness/Dentist/MedicalClinic + WebSite + FAQPage JSON-LD in HTML
- [x] Migrations + seed applied; DB counts match §17
- [x] Storage buckets exist (`gallery`, `doctors`, `services`, `content`)
- [x] 1 `admin_users` row exists (`admin@jeevandental.in`, `super_admin`)
- [x] No secrets committed (`.env.local` git-ignored; `.env.example` is placeholders)
- [ ] Admin login succeeds end-to-end (needs the admin's password — not tested here)
- [ ] Admin dashboard loads with live data
- [ ] Admin CRUD round-trip (create/edit/publish/delete a service, doctor, FAQ,
      testimonial) + `revalidatePath` reflected on the public site
- [ ] Gallery image upload to Supabase Storage works and renders
- [ ] Real appointment submitted → row in `appointments` → same slot then
      unavailable in the form
- [ ] Contact form submitted → row in `enquiries` → shows in dashboard
- [ ] Mobile layout verified on real devices / all breakpoints
- [ ] Deployed to Vercel with correct env vars

---

## 28. Change Log

### 2026-09-10 — Initial documented state
> All 5 commits landed on this date; treat the split below as logical, not
> strictly chronological beyond commit order.

#### Added
- Next.js 16 App Router + TypeScript + Tailwind v4 project scaffold.
- Full public website: homepage (18 sections) + about, services (index + 4
  category pages + dynamic `[slug]`), doctor (index + `[slug]`), gallery,
  testimonials, faq, contact, appointment, blog (index + `[slug]`),
  privacy-policy, terms; `not-found`, `error`, `loading`, `global-error`.
- Design system in `globals.css` (navy/teal/champagne tokens, Manrope +
  Fraunces, motion tokens, `Reveal`).
- ~26 website components, 17 shadcn-style UI primitives, 17 admin components,
  2 form components.
- Supabase clients: browser, cookie-bound server, cookie-less public,
  service-role admin, proxy session refresher; `src/proxy.ts` gate.
- Multi-step appointment booking (`AppointmentForm`) + `/api/availability`
  route + slot generation (`src/lib/appointments.ts`) + `createAppointmentAction`
  + confirmation view with prefilled WhatsApp/phone.
- Contact form + `submitContactAction` → `enquiries`.
- Admin dashboard: login, dashboard, appointments, services (+new/[id]),
  doctors (+new/[id]), gallery, testimonials, faqs, content, settings, profile;
  server actions for each + Storage `uploadImageAction`.
- Auth: `src/lib/auth.ts` (`getAdminSession`, `requireAdmin`), `signInAction` /
  `signOutAction`.
- SEO: `buildMetadata`, JSON-LD helpers (LocalBusiness/Dentist/MedicalClinic,
  WebSite, Breadcrumb, MedicalProcedure, FAQPage, Physician, Article),
  `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`.
- Fallback content (`src/lib/content/defaults.ts`), Zod schemas
  (`src/lib/validations/*`), in-memory rate limiter.
- `scripts/create-admin.mjs` + `npm run create-admin` (later: hidden-input
  password prompt).
- `README.md`, `.env.example` (placeholder template), `.gitattributes`,
  `next.config.ts` (security headers + Supabase image `remotePatterns`).
- Footer **Admin Login** pill button (`7fd0583`).
- `supabase/setup.sql` — one-paste concat of both migrations + seed (`e740f8f`).
- `src/components/website/trust-strip.tsx` (`0f5e14c`).

#### Changed
- Public data layer switched from the cookie-bound server client to the
  cookie-less `getPublicClient()` so public pages stay static + ISR
  (`revalidate = 3600` on `(website)/layout.tsx`).
- Renamed `src/middleware.ts` → `src/proxy.ts` (Next 16 convention).
- Homepage: extracted the Dental/Skin/Hair/Aesthetic strip from `<Hero>` into
  `<TrustStrip>` rendered after `<QuickActionBar>` (fixed an overlap) (`0f5e14c`).
- `RowActions` now takes a serializable `id` + bare Server Action references
  instead of inline closures (`0f5e14c`).
- Admin `(dashboard)` layout set to `dynamic = "force-dynamic"` (`0f5e14c`).
- `supabase/config.ts` accepts both legacy and new Supabase key env-var names.

#### Fixed
- `src/types/database.ts`: `interface` → `type` aliases so the Supabase
  `GenericSchema` constraint is satisfied (previously all `.from()` calls
  resolved to `never`).
- lucide brand icons removed → custom SVGs in `social-icons.tsx`.
- `sitemap.ts` `changeFrequency` typing.
- `react-hooks/set-state-in-effect` lint errors (header, admin sidebar,
  appointments table, reveal) refactored to `onClick` handlers /
  `requestAnimationFrame` / `router.refresh()`.
- Build break: Server → Client function props on `/admin/doctors` &
  `/admin/services` (`0f5e14c`).

#### Database
- Applied `0001_init.sql` (13 tables, 7 enums, 3 functions, triggers, RLS on all
  tables), `0002_storage.sql` (4 public-read buckets + admin-only write
  policies), `seed.sql` (see §17 counts).
- Linked existing auth user `admin@jeevandental.in` into `admin_users` as
  `super_admin`.

#### Deployment
- `git init` + commits `a53a7d8`…`0f5e14c`; then `d40986d` added this doc and
  **untracked `.gitignore`** (kept locally via `.git/info/exclude` per request).
- Pushed to **https://github.com/mdsahilkhan2001/dental-clinic** (`main`).
  `origin` is the HTTPS URL — SSH push failed (no SSH key on this machine
  registered with GitHub); HTTPS worked via Git Credential Manager.
- `.gitignore` contents recorded in §26.1 (file is untracked, so a fresh clone
  must recreate it).
- **Not** deployed to Vercel.
- `.env.local` created with the clinic's Supabase URL + publishable key +
  secret key (git-ignored, never pushed).

#### Notes
- No fabricated reviews, credentials, patient results, or unsupported claims.
- Medical disclaimer strings live in `src/lib/site.ts` and appear on service /
  category / doctor / blog pages and the booking sidebar.
- `PROJECT_CONTEXT.md` (this file) created.

---

## 29. Instructions for Future Claude Code Sessions

1. **Read `PROJECT_CONTEXT.md` (this file) first**, then `README.md`.
2. **Inspect the actual code** before assuming anything — routes from
   `src/app/**`, schema from `supabase/migrations/*` + `src/types/database.ts`,
   admin behaviour from `src/app/actions/admin/*` + `src/components/admin/*`.
3. **Never claim a feature is implemented without verifying it in the codebase.**
   Use the status legend honestly (✅ / 🟡 / 🔴 / ⏳ / ⚠️).
4. **Understand existing patterns before changing architecture** — the
   public/admin client split (`public.ts` vs `server.ts` vs `admin.ts`), the
   `ensureAdmin()` write path, the fallback-content model, `revalidatePath`
   after mutations, NAP in `src/lib/site.ts`.
5. **Preserve existing functionality** unless the user explicitly asks to change
   it. Prefer extending the current system over building a parallel one.
6. **Do not expose secrets.** Never print values from `.env.local`, tokens, or
   keys. Document variable **names** only.
7. **Do not run destructive operations** on the shared Supabase project or git
   history without explicit confirmation (no dropping tables, no
   `push --force`, no deleting storage objects that are referenced).
8. **Run `npm run lint` and `npm run build` after meaningful changes**; keep the
   build green and don't introduce new lint errors.
9. **Update this file after significant work** — the relevant section(s), §2
   Current Status, §22 Known Bugs, §24/§25 Roadmap & TODO, and add a §28 Change
   Log entry (dated). Record important architectural decisions in §21.
10. **Add newly discovered bugs/issues to §22** with severity + location.
11. **No fake medical claims, fake reviews, fake credentials, fake patient
    results, or unsupported clinic claims.** Keep skin/hair/aesthetic copy
    consultation-led and generic unless the clinic confirms specifics.
12. **Never replace real clinic information** (`src/lib/site.ts`, real photos)
    with invented data.
13. Keep the medical disclaimer present but **not excessive** (service/category/
    doctor/blog pages + booking sidebar).
14. If you change dependencies, update §3 with the **resolved** versions from
    `package-lock.json`, not guesses.
15. If DB state changes (new rows, new tables), re-verify §11 and §17 against
    the live project.

---

## 30. How to Continue From Here

**If a new Claude session opens this project tomorrow, do this first:**

1. **Read** `PROJECT_CONTEXT.md` (this file) top-to-bottom, then `README.md`.
2. **Check git:** `git log --oneline` and `git status` — confirm the last
   commit is still `0f5e14c` (or later) and note any uncommitted work.
3. **Confirm the toolchain builds:** `npm install` (if needed) →
   `npm run lint` → `npm run build`. All must pass before you change anything.
4. **Locate the task area** in the tree (§4.1) and **read the actual files**
   involved — don't rely solely on this document for specifics.
5. **Verify current behaviour** (run `npm run dev`, hit the relevant routes;
   for backend work, check `.env.local` is present and the Supabase project
   still has the schema — §11/§17).
6. **Review §22 Known Bugs and §25 TODO** so you don't re-break something or
   duplicate planned work.
7. **Implement the requested change**, following existing patterns (§21) and the
   rules in §29.
8. **Re-run `npm run lint` + `npm run build`**; smoke-test the affected routes.
9. **Update `PROJECT_CONTEXT.md`**: the relevant section, §2 status, §22 bugs
   (add/resolve), §24–§25 roadmap/TODO, and a new dated §28 Change Log entry.
10. Commit with a clear message. Do **not** push or deploy unless the user asks.

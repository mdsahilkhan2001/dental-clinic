# Jeevan Dental &amp; Aesthetic Clinic

Production-ready website and lightweight clinic-management system for **Jeevan
Dental &amp; Aesthetic Clinic**, Near Petrol Pump, Main Road, Mahuadanr, Latehar,
Jharkhand&nbsp;822119, India.

Dental · Skin · Hair · Aesthetic care — with online appointment requests, a
manageable content layer and a secure admin dashboard.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, custom design tokens |
| UI primitives | Radix UI + shadcn-style components, Lucide icons |
| Backend | Supabase — Postgres, Auth, Storage |
| Forms | React Hook Form + Zod (client and server validation) |
| Data mutations | Server Actions |
| SEO | Metadata API, JSON-LD, `sitemap.xml`, `robots.txt`, OG image |
| Hosting | Vercel-ready |

The marketing site renders **entirely from bundled fallback content** when
Supabase is not configured, so you can preview it immediately with
`npm run dev`.

---

## 1. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Environment
cp .env.example .env.local
#   Fill in the Supabase values (see section 2). You can run the site
#   without them — only the admin area and data persistence need Supabase.

# 3. Develop
npm run dev            # http://localhost:3000

# 4. Quality gates
npm run lint
npm run build
```

Node 20+ is required (the repo is developed on Node 24).

> **Note:** `.gitignore` is intentionally **not tracked** in this repo. On a
> fresh clone it will be missing — recreate it before running `git add -A`.
> Its contents are recorded in
> [`PROJECT_CONTEXT.md` §26.1](./PROJECT_CONTEXT.md#261-gitignore--not-tracked-contents-recorded-here).

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes for prod | Canonical base URL, no trailing slash |
| `NEXT_PUBLIC_SUPABASE_URL` | for backend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for backend | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | for admin writes | **Server only** — never exposed to the browser |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | optional | Not needed; the site uses a keyless Maps embed |

`.env*` is git-ignored. Never commit real keys.

---

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API** — copy the URL, `anon` key and `service_role`
   key into `.env.local`.
3. **SQL Editor** — run the migrations in order:
   - `supabase/migrations/0001_init.sql` — schema, enums, triggers, RLS
   - `supabase/migrations/0002_storage.sql` — storage buckets + policies
4. **SQL Editor** — run `supabase/seed/seed.sql` for demo content
   (services, FAQs, opening hours, editable homepage blocks, the real clinic
   photos as gallery rows, and a clearly-marked placeholder doctor profile).
   It contains **no fabricated reviews, credentials or patient results**.

Using the Supabase CLI instead:

```bash
supabase link --project-ref <your-ref>
supabase db push                 # applies supabase/migrations/*
psql "$DATABASE_URL" -f supabase/seed/seed.sql
```

### Row Level Security summary

- Published content (services, doctors, gallery, FAQs, testimonials, hours,
  site content, blog) is **publicly readable**.
- `appointments` and `enquiries` allow **insert only** for the public
  (with a consent check); reads/updates require an admin.
- All content writes require `public.is_admin()` — true only for a user whose
  `auth.uid()` exists in `admin_users`.
- The `service_role` key bypasses RLS and is used **only** by server-side admin
  actions after `requireAdmin()` has authorised the caller.
- Double booking is prevented by a partial unique index on
  `(appointment_date, appointment_time)` for `pending`/`confirmed` rows, plus a
  server-side slot check before insert.

---

## 3. Admin setup

The admin area lives at `/admin` and is protected by:

1. `src/proxy.ts` (Next 16 proxy / middleware) — refreshes the session and
   redirects unauthenticated `/admin/*` traffic to `/admin/login`.
2. `requireAdmin()` in `src/app/admin/(dashboard)/layout.tsx` — the
   authoritative server-side check (session **and** `admin_users` membership).

### Create the first admin

1. **Supabase → Authentication → Users → Add user** — set an email + password
   (enable "Auto Confirm User").
2. Copy that user's UUID, then in the **SQL Editor**:

   ```sql
   insert into public.admin_users (id, email, full_name, role)
   values ('<user-uuid>', 'admin@example.com', 'Clinic Admin', 'admin');
   ```

3. Visit `/admin/login` and sign in.

To add more staff later, repeat the two steps. Roles are `admin`,
`super_admin`, `editor`, `receptionist` (all currently have full access; the
column is in place for future granularity).

### What the admin can do

- **Dashboard** — appointment totals by status, today's list, upcoming, recent
  enquiries.
- **Appointments** — search (name/phone/ID), filter (status/service), view
  details, confirm / complete / cancel / mark no-show, delete. Confirming
  re-checks for slot clashes.
- **Services** — full CRUD, categories, arrays (suitable-for / steps /
  benefits), per-service FAQs, SEO fields, featured + published toggles,
  display order.
- **Doctors** — full CRUD, photo upload, languages, services, publish toggle.
- **Gallery** — upload to Supabase Storage, category, alt text, order,
  show/hide, delete (also removes the storage object).
- **Testimonials** — CRUD + publish/unpublish (guidance against fabricated
  reviews is shown in the UI).
- **FAQs** — CRUD, category, "show on homepage" flag, publish toggle.
- **Content** — edit hero, about, why-choose-us, CTA, footer and social links.
  Fallback copy stays in `src/lib/content/defaults.ts`.
- **Clinic Settings** — opening hours per day (morning + evening shifts) which
  drive the bookable appointment slots.
- **Profile** — account details and sign out.

---

## 4. Project structure

```
src/
  app/
    (website)/            # public site — layout with header/footer/mobile bar
      page.tsx            # homepage
      about, services, services/[slug], services/{dental,skin,hair,aesthetic}
      doctor, doctor/[slug], gallery, testimonials, faq, contact
      appointment, blog, blog/[slug], privacy-policy, terms
    admin/
      login/              # unguarded
      (dashboard)/        # guarded by requireAdmin() in its layout
        page.tsx, appointments, services(+new,[id]), doctors(+new,[id]),
        gallery, testimonials, faqs, content, settings, profile
    actions/              # server actions (appointments, contact, auth, admin/*)
    api/availability/     # slot availability route handler
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  components/{ui,website,admin,forms}/
  lib/
    site.ts               # single source of truth for NAP + nav
    supabase/{client,server,admin,middleware,config}.ts
    data/{index,admin}.ts  # reads (public fall back to defaults; admin uses service role)
    content/defaults.ts    # bundled fallback content
    validations/*.ts       # Zod schemas
    seo/*                  # metadata + JSON-LD helpers
    appointments.ts        # slot generation + availability
    auth.ts, rate-limit.ts, utils.ts
  types/database.ts        # hand-maintained Supabase types
  proxy.ts                 # session refresh + /admin gate
supabase/migrations/*.sql
supabase/seed/seed.sql
public/images/{clinic,dental}/   # real clinic photos + placeholders
```

---

## 5. Vercel deployment

1. Push the repo to GitHub/GitLab and **Import** it in Vercel.
2. **Settings → Environment Variables** — add all variables from
   `.env.example` for **Production** (and Preview):
   - `NEXT_PUBLIC_SITE_URL=https://your-domain`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark it as sensitive; it is server-only)
3. Framework preset **Next.js** — build `npm run build`, output handled
   automatically. No `vercel.json` needed.
4. Deploy. Then, in Supabase **Authentication → URL Configuration**, add your
   production domain to the allowed redirect URLs.
5. Point your custom domain at Vercel and update `NEXT_PUBLIC_SITE_URL`.

---

## 6. Production checklist

- [ ] `npm run lint` and `npm run build` pass with no errors
- [ ] `.env` values set in Vercel (Prod + Preview); `SUPABASE_SERVICE_ROLE_KEY`
      is **not** in any `NEXT_PUBLIC_` variable
- [ ] Migrations `0001` + `0002` applied; `seed.sql` run
- [ ] At least one row in `admin_users`; `/admin/login` works
- [ ] Storage buckets `gallery`, `doctors`, `services`, `content` exist and are
      public-read; an image upload from the admin works
- [ ] Submit a test appointment → row appears in `admin/appointments`;
      the same slot is then unavailable in the booking form
- [ ] Contact form submits → row appears in `enquiries` / dashboard
- [ ] `Call`, `WhatsApp`, `Get Directions` links work on mobile and desktop
- [ ] `/sitemap.xml`, `/robots.txt`, JSON-LD (Rich Results Test) validate
- [ ] Opening hours edited in admin are reflected on the site and in slots
- [ ] Lighthouse: performance / accessibility / SEO / best-practices reviewed
- [ ] 404 and error states render correctly
- [ ] NAP (name, address, phone) identical in header, footer, contact page,
      JSON-LD and `src/lib/site.ts`

---

## Notes on content & claims

- No "#1 / best / guaranteed" language is used anywhere.
- Service copy is general and consultation-led; skin/hair/aesthetic pages avoid
  naming specific devices or treatments the clinic has not confirmed.
- A medical-information disclaimer appears on service pages, category pages,
  doctor pages, blog posts and the booking sidebar (not excessively).
- Before/after entries are hidden unless `consent_obtained = true` **and**
  `published = true`.
- Replace the placeholder doctor profile and the stock dental close-up images
  in `public/images/dental/` with real clinic assets when available. The
  original uploads are kept in `/images/` for reference.
```

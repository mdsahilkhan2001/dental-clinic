-- =============================================================================
-- Storage buckets + policies
-- Public-read buckets for site imagery; writes restricted to clinic admins.
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('gallery',  'gallery',  true),
  ('doctors',  'doctors',  true),
  ('services', 'services', true),
  ('content',  'content',  true)
on conflict (id) do nothing;

-- Public read for every object in these buckets.
create policy "Public read clinic media"
  on storage.objects for select
  using (bucket_id in ('gallery', 'doctors', 'services', 'content'));

-- Only authenticated clinic admins may upload / modify / delete.
create policy "Admins upload clinic media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('gallery', 'doctors', 'services', 'content')
    and public.is_admin()
  );

create policy "Admins update clinic media"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('gallery', 'doctors', 'services', 'content')
    and public.is_admin()
  );

create policy "Admins delete clinic media"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('gallery', 'doctors', 'services', 'content')
    and public.is_admin()
  );

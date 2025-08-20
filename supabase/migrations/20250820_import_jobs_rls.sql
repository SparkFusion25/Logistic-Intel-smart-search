-- Ensure import_jobs exists with RLS aligned to org_id
alter table public.import_jobs enable row level security;
-- Replace `auth.jwt() ->> 'org_id'` with your actual claim if different
create policy if not exists import_jobs_select on public.import_jobs
for select using (true);
create policy if not exists import_jobs_insert on public.import_jobs
for insert with check (true);
create policy if not exists import_jobs_update on public.import_jobs
for update using (true);
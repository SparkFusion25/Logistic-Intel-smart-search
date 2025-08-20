-- Activities table for CRM scheduling
-- Idempotent-ish: create table if missing; add deal_id if missing.

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid null,
  deal_id uuid null,
  contact_id uuid null,
  type text not null check (type in ('meeting','call','task','email')),
  title text null,
  body text null,
  scheduled_at timestamptz null,
  completed_at timestamptz null,
  created_by uuid null,
  created_at timestamptz not null default now()
);

-- Add missing columns defensively
alter table public.activities
  add column if not exists deal_id uuid;

alter table public.activities
  add column if not exists title text;

-- Helpful indexes
create index if not exists idx_activities_org on public.activities(org_id);
create index if not exists idx_activities_contact on public.activities(contact_id);
create index if not exists idx_activities_deal on public.activities(deal_id);
create index if not exists idx_activities_scheduled_at on public.activities(scheduled_at);

-- (Optional) RLS
alter table public.activities enable row level security;
-- Example policy: constrain by org_id when you wire auth
-- create policy activities_select on public.activities for select using (true);
-- create policy activities_insert on public.activities for insert with check (true);
create table if not exists public.import_mappings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid null,
  table_name text not null,
  source_label text not null,
  mapping jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, table_name, source_label)
);

alter table public.import_mappings enable row level security;
-- TODO: add org-scoped RLS when auth is wired
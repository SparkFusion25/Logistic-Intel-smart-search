-- Create import_mappings table for saving header mapping presets
CREATE TABLE IF NOT EXISTS public.import_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NULL,
  table_name TEXT NOT NULL,
  source_label TEXT NOT NULL,
  mapping JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, table_name, source_label)
);

-- Enable RLS
ALTER TABLE public.import_mappings ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development
DROP POLICY IF EXISTS import_mappings_all ON public.import_mappings;
CREATE POLICY import_mappings_all ON public.import_mappings
FOR ALL USING (true) WITH CHECK (true);
-- Create unified views for search functionality
CREATE OR REPLACE VIEW public.unified_shipments AS
SELECT
  us.id,
  us.org_id,
  CASE 
    WHEN LOWER(COALESCE(us.mode, 'ocean')) LIKE '%air%' THEN 'air'::text 
    ELSE 'ocean'::text 
  END as mode,
  COALESCE(us.unified_company_name, us.shipper_name, us.consignee_name) as unified_company_name,
  us.hs_code,
  us.origin_country,
  us.destination_country,
  us.destination_city,
  COALESCE(us.unified_carrier, us.carrier) as unified_carrier,
  COALESCE(us.unified_date, us.shipment_date, us.arrival_date)::date as unified_date,
  us.commodity_description as description,
  us.bol_number,
  us.vessel_name,
  us.gross_weight_kg,
  us.value_usd,
  us.container_count,
  us.created_at,
  -- Add tsvector for full text search
  to_tsvector('english', 
    COALESCE(us.unified_company_name, '') || ' ' ||
    COALESCE(us.commodity_description, '') || ' ' ||
    COALESCE(us.hs_code, '') || ' ' ||
    COALESCE(us.unified_carrier, '')
  ) as ts_all
FROM public.unified_shipments us;

-- Create search companies view with aggregated data
CREATE OR REPLACE VIEW public.search_companies AS
WITH ship_stats AS (
  SELECT
    us.unified_company_name as company_name,
    COUNT(*)::int as shipments_count,
    MAX(us.unified_date) as last_shipment_date,
    ARRAY_AGG(DISTINCT us.mode) FILTER (WHERE us.mode IS NOT NULL) as modes,
    ARRAY_AGG(DISTINCT us.destination_country) FILTER (WHERE us.destination_country IS NOT NULL) as dest_countries,
    ARRAY_AGG(DISTINCT us.hs_code) FILTER (WHERE us.hs_code IS NOT NULL) as top_commodities
  FROM public.unified_shipments us
  WHERE us.unified_company_name IS NOT NULL
  GROUP BY us.unified_company_name
),
contact_stats AS (
  SELECT 
    cc.company_name, 
    COUNT(*)::int as contacts_count
  FROM public.crm_contacts cc
  WHERE cc.company_name IS NOT NULL
  GROUP BY cc.company_name
)
SELECT
  COALESCE(c.company_name, ship_stats.company_name, contact_stats.company_name) as company_name,
  c.id as company_id,
  COALESCE(contact_stats.contacts_count, 0) as contacts_count,
  COALESCE(ship_stats.shipments_count, 0) as shipments_count,
  ship_stats.last_shipment_date,
  COALESCE(ship_stats.modes, ARRAY[]::text[]) as modes,
  COALESCE(ship_stats.dest_countries, ARRAY[]::text[]) as dest_countries,
  COALESCE(ship_stats.top_commodities, ARRAY[]::text[]) as top_commodities,
  c.website,
  c.country,
  c.industry
FROM public.companies c
FULL OUTER JOIN ship_stats ON LOWER(TRIM(ship_stats.company_name)) = LOWER(TRIM(c.company_name))
FULL OUTER JOIN contact_stats ON LOWER(TRIM(contact_stats.company_name)) = LOWER(TRIM(COALESCE(c.company_name, ship_stats.company_name)))
WHERE COALESCE(c.company_name, ship_stats.company_name, contact_stats.company_name) IS NOT NULL;

-- Update RLS policies for base tables
ALTER TABLE public.unified_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (tighten later)
DROP POLICY IF EXISTS unified_shipments_select ON public.unified_shipments;
CREATE POLICY unified_shipments_select ON public.unified_shipments
FOR SELECT USING (true);

DROP POLICY IF EXISTS companies_select ON public.companies;
CREATE POLICY companies_select ON public.companies
FOR SELECT USING (true);

DROP POLICY IF EXISTS crm_contacts_select ON public.crm_contacts;
CREATE POLICY crm_contacts_select ON public.crm_contacts
FOR SELECT USING (true);

-- Create import_jobs table for bulk import tracking
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NULL,
  source_bucket TEXT NULL,
  object_path TEXT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'success', 'error')),
  total_rows INTEGER NULL,
  ok_rows INTEGER NULL,
  error_rows INTEGER NULL,
  processing_metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ NULL
);

-- Enable RLS for import_jobs
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for import_jobs
DROP POLICY IF EXISTS import_jobs_all ON public.import_jobs;
CREATE POLICY import_jobs_all ON public.import_jobs
FOR ALL USING (true) WITH CHECK (true);

-- Add indexes for search performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_company_name ON public.unified_shipments USING gin(unified_company_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_ts_all ON public.unified_shipments USING gin(ts_all);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_date ON public.unified_shipments(unified_date DESC);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_mode ON public.unified_shipments(mode);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_name ON public.crm_contacts USING gin(company_name gin_trgm_ops);
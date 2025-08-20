-- Core platform tables for Logistic Intel

-- Organizations
CREATE TABLE IF NOT EXISTS public.orgs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  seats INTEGER NOT NULL DEFAULT 1,
  billing_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  plan_cache TEXT DEFAULT 'free',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unified shipments (core freight data)
CREATE TABLE IF NOT EXISTS public.unified_shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unified_id TEXT,
  mode TEXT CHECK (mode IN ('air', 'ocean')),
  shipment_type TEXT,
  transport_mode TEXT,
  shipment_mode TEXT,
  unified_company_name TEXT,
  unified_destination TEXT,
  unified_value NUMERIC,
  unified_weight NUMERIC,
  unified_date DATE,
  unified_carrier TEXT,
  hs_code TEXT,
  description TEXT,
  hs_description TEXT,
  commodity_description TEXT,
  bol_number TEXT,
  vessel_name TEXT,
  shipper_name TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  container_count INTEGER,
  gross_weight_kg NUMERIC,
  origin_country TEXT,
  destination_country TEXT,
  destination_city TEXT,
  is_likely_air_shipper BOOLEAN DEFAULT false,
  air_confidence_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quote storage
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  company_name TEXT,
  origin TEXT,
  destination TEXT,
  mode TEXT CHECK (mode IN ('air', 'ocean')),
  hs_code TEXT,
  commodity TEXT,
  price_usd NUMERIC,
  output_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tariff cache
CREATE TABLE IF NOT EXISTS public.tariff_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hs_code TEXT NOT NULL,
  country TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('avalara', 'flexport')),
  rate NUMERIC,
  payload JSONB,
  refreshed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hs_code, country, provider)
);

-- Market benchmark cache (NEW)
CREATE TABLE IF NOT EXISTS public.market_benchmark_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lane_hash TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('air', 'ocean')),
  hs_code TEXT,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'container', 'shipment')),
  p25 NUMERIC,
  p50 NUMERIC,
  p75 NUMERIC,
  sample_size INTEGER,
  last_computed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_breakdown JSONB
);

-- OAuth tokens
CREATE TABLE IF NOT EXISTS public.oauth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Search logs for analytics
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  query JSONB,
  results_count INTEGER,
  avg_confidence NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Organization feature flags
CREATE TABLE IF NOT EXISTS public.org_feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, key)
);

-- Enable RLS on all tables
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_benchmark_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for org-based access
CREATE POLICY "orgs_select" ON public.orgs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.users WHERE org_id = orgs.id));

CREATE POLICY "users_all" ON public.users FOR ALL
  USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM public.users WHERE org_id = users.org_id AND is_admin = true));

CREATE POLICY "unified_shipments_select" ON public.unified_shipments FOR SELECT
  USING (true); -- Publicly accessible for search

CREATE POLICY "quotes_all" ON public.quotes FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.users WHERE org_id = quotes.org_id));

CREATE POLICY "tariff_cache_select" ON public.tariff_cache FOR SELECT
  USING (true); -- Publicly accessible

CREATE POLICY "market_benchmark_cache_select" ON public.market_benchmark_cache FOR SELECT
  USING (true); -- Publicly accessible

CREATE POLICY "oauth_tokens_all" ON public.oauth_tokens FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.users WHERE org_id = oauth_tokens.org_id));

CREATE POLICY "search_logs_all" ON public.search_logs FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.users WHERE org_id = search_logs.org_id));

CREATE POLICY "org_feature_flags_all" ON public.org_feature_flags FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.users WHERE org_id = org_feature_flags.org_id));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_company ON public.unified_shipments(unified_company_name);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_hs_code ON public.unified_shipments(hs_code);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_date ON public.unified_shipments(unified_date);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_mode ON public.unified_shipments(mode);
CREATE INDEX IF NOT EXISTS idx_market_benchmark_lane_hash ON public.market_benchmark_cache(lane_hash);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON public.crm_contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_contacts_panjiva ON public.crm_contacts(panjiva_id) WHERE panjiva_id IS NOT NULL;
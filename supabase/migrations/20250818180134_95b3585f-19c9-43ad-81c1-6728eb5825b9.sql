-- Create bulk import system for trade data processing
-- 1. Bulk imports tracking table
CREATE TABLE IF NOT EXISTS public.bulk_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('xlsx', 'csv', 'xml', 'bts', 'census', 'iata')),
  file_size BIGINT,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'parsed', 'deduplicating', 'enriching', 'completed', 'error')),
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  duplicate_records INTEGER DEFAULT 0,
  error_records INTEGER DEFAULT 0,
  processing_metadata JSONB DEFAULT '{}',
  error_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. Trade shipments data (from BTS/Census style data)
CREATE TABLE IF NOT EXISTS public.trade_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id UUID REFERENCES public.bulk_imports(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  
  -- Core shipment data
  shipment_reference TEXT,
  origin_country TEXT,
  origin_state TEXT,
  origin_city TEXT,
  origin_port TEXT,
  destination_country TEXT,
  destination_state TEXT,
  destination_city TEXT,
  destination_port TEXT,
  
  -- Company information (probabilistic matching)
  shipper_name TEXT,
  consignee_name TEXT,
  inferred_company_name TEXT, -- Our best guess at company
  confidence_score INTEGER DEFAULT 0, -- 0-100 matching confidence
  
  -- Cargo details
  commodity_code TEXT, -- HS Code, SCTG, etc.
  commodity_description TEXT,
  transportation_mode TEXT, -- air, ocean, truck, rail
  vessel_name TEXT,
  shipment_date DATE,
  arrival_date DATE,
  
  -- Values
  weight_kg NUMERIC,
  value_usd NUMERIC,
  freight_charges NUMERIC,
  
  -- Enrichment status
  enrichment_status TEXT DEFAULT 'pending',
  enriched_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Company intelligence profiles (aggregated from shipments)
CREATE TABLE IF NOT EXISTS public.company_trade_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  
  -- Trade activity aggregates
  total_shipments INTEGER DEFAULT 0,
  total_air_shipments INTEGER DEFAULT 0,
  total_ocean_shipments INTEGER DEFAULT 0,
  total_ground_shipments INTEGER DEFAULT 0,
  
  -- Value aggregates
  total_trade_value_usd NUMERIC DEFAULT 0,
  avg_shipment_value_usd NUMERIC DEFAULT 0,
  
  -- Geographic patterns
  top_origin_countries TEXT[],
  top_destination_countries TEXT[],
  top_ports TEXT[],
  
  -- Commodity patterns
  top_commodities TEXT[],
  commodity_categories TEXT[],
  
  -- Recent activity
  last_shipment_date DATE,
  first_shipment_date DATE,
  activity_frequency TEXT, -- daily, weekly, monthly, quarterly
  
  -- Company enrichment data
  enriched_company_data JSONB DEFAULT '{}',
  contact_enrichment_status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. File processing queue for background tasks
CREATE TABLE IF NOT EXISTS public.file_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id UUID REFERENCES public.bulk_imports(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  processing_step TEXT NOT NULL CHECK (processing_step IN ('parse', 'deduplicate', 'enrich', 'aggregate')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bulk_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_trade_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_processing_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their org bulk imports" ON public.bulk_imports
  FOR ALL USING (org_id = auth.uid());

CREATE POLICY "Users can manage their org trade shipments" ON public.trade_shipments
  FOR ALL USING (org_id = auth.uid());

CREATE POLICY "Users can manage their org company profiles" ON public.company_trade_profiles
  FOR ALL USING (org_id = auth.uid());

CREATE POLICY "Users can view their org processing queue" ON public.file_processing_queue
  FOR SELECT USING (org_id = auth.uid());

-- Service role policies for background processing
CREATE POLICY "Service role can manage all bulk imports" ON public.bulk_imports
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all trade shipments" ON public.trade_shipments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all company profiles" ON public.company_trade_profiles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all processing queue" ON public.file_processing_queue
  FOR ALL USING (auth.role() = 'service_role');

-- Create storage bucket for imports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bulk-imports', 'bulk-imports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload to their org folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bulk-imports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bulk-imports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trade_shipments_org_id ON public.trade_shipments(org_id);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_company ON public.trade_shipments(inferred_company_name);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_date ON public.trade_shipments(shipment_date);
CREATE INDEX IF NOT EXISTS idx_company_profiles_org_id ON public.company_trade_profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_name ON public.company_trade_profiles(company_name);

-- Function to update company profiles from shipments
CREATE OR REPLACE FUNCTION public.update_company_trade_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.company_trade_profiles (
    org_id, company_name, total_shipments, total_trade_value_usd,
    last_shipment_date, first_shipment_date
  )
  VALUES (
    NEW.org_id, NEW.inferred_company_name, 1, COALESCE(NEW.value_usd, 0),
    NEW.shipment_date, NEW.shipment_date
  )
  ON CONFLICT (org_id, company_name) DO UPDATE SET
    total_shipments = company_trade_profiles.total_shipments + 1,
    total_trade_value_usd = company_trade_profiles.total_trade_value_usd + COALESCE(NEW.value_usd, 0),
    last_shipment_date = GREATEST(company_trade_profiles.last_shipment_date, NEW.shipment_date),
    first_shipment_date = LEAST(company_trade_profiles.first_shipment_date, NEW.shipment_date),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update company profiles
CREATE TRIGGER update_company_profile_trigger
  AFTER INSERT ON public.trade_shipments
  FOR EACH ROW
  WHEN (NEW.inferred_company_name IS NOT NULL)
  EXECUTE FUNCTION public.update_company_trade_profile();

-- Add unique constraint for company profiles
ALTER TABLE public.company_trade_profiles 
ADD CONSTRAINT unique_org_company_name UNIQUE (org_id, company_name);
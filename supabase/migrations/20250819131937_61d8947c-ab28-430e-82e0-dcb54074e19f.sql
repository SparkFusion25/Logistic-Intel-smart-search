-- Create unified_shipments table with standardized columns matching all shipment tables
CREATE TABLE public.unified_shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid DEFAULT 'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid,
  
  -- Core shipment identifiers
  shipment_id text,
  bol_number text,
  
  -- Company information
  unified_company_name text,
  shipper_name text,
  consignee_name text,
  
  -- Location data
  origin_country text,
  destination_country text,
  origin_city text,
  destination_city text,
  destination_state text,
  port_of_loading text,
  port_of_discharge text,
  
  -- Shipment details
  mode text DEFAULT 'ocean', -- air, ocean
  hs_code text,
  commodity_description text,
  unified_date date,
  unified_value numeric,
  weight_kg numeric,
  quantity integer,
  
  -- Transport details
  carrier_name text,
  vessel_name text,
  transport_method text,
  
  -- Contact information
  shipper_email text,
  shipper_phone text,
  consignee_email text,
  consignee_phone text,
  
  -- Industry classification
  shipper_industry text,
  consignee_industry text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  raw_xml_filename text,
  source_file text
);

-- Enable RLS
ALTER TABLE public.unified_shipments ENABLE ROW LEVEL SECURITY;

-- Create policies - No restrictions except for XML files
CREATE POLICY "unified_shipments_read_all" 
ON public.unified_shipments 
FOR SELECT 
USING (true);

CREATE POLICY "unified_shipments_insert_authenticated" 
ON public.unified_shipments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "unified_shipments_update_own_org" 
ON public.unified_shipments 
FOR UPDATE 
USING (org_id = auth.uid() OR auth.role() = 'service_role');

-- Restrict XML file operations to service role only
CREATE POLICY "unified_shipments_xml_service_only" 
ON public.unified_shipments 
FOR ALL 
USING (
  CASE 
    WHEN raw_xml_filename IS NOT NULL THEN auth.role() = 'service_role'
    ELSE true
  END
);

-- Populate with sample data from airfreight_shipments
INSERT INTO public.unified_shipments (
  shipment_id, unified_company_name, shipper_name, consignee_name,
  origin_country, destination_country, mode, hs_code, commodity_description,
  unified_date, unified_value, weight_kg, carrier_name, vessel_name,
  raw_xml_filename, created_at
)
SELECT 
  shipment_id,
  COALESCE(shipper_name, consignee_name, 'Unknown Company') as unified_company_name,
  shipper_name,
  consignee_name,
  shipper_country as origin_country,
  consignee_country as destination_country,
  'air' as mode,
  hs_code,
  COALESCE(commodity_description, description, goods_description) as commodity_description,
  COALESCE(shipment_date, arrival_date) as unified_date,
  value_usd as unified_value,
  weight_kg,
  COALESCE(vessel, 'Unknown Carrier') as carrier_name,
  vessel_name,
  raw_xml_filename,
  created_at
FROM public.airfreight_shipments 
WHERE shipper_name IS NOT NULL OR consignee_name IS NOT NULL
LIMIT 1000;

-- Add indexes for performance
CREATE INDEX idx_unified_shipments_company_name ON public.unified_shipments (unified_company_name);
CREATE INDEX idx_unified_shipments_date ON public.unified_shipments (unified_date);
CREATE INDEX idx_unified_shipments_mode ON public.unified_shipments (mode);
CREATE INDEX idx_unified_shipments_hs_code ON public.unified_shipments (hs_code);
CREATE INDEX idx_unified_shipments_origin_dest ON public.unified_shipments (origin_country, destination_country);
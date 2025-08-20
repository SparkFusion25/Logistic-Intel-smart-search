-- Add missing Revenue Vessel columns to unified_shipments table
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS importer_id text,
ADD COLUMN IF NOT EXISTS importer_name text,
ADD COLUMN IF NOT EXISTS consignee_address text,
ADD COLUMN IF NOT EXISTS shipper_address text,
ADD COLUMN IF NOT EXISTS carrier_code text,
ADD COLUMN IF NOT EXISTS carrier_name text,
ADD COLUMN IF NOT EXISTS forwarder_scac_code text,
ADD COLUMN IF NOT EXISTS forwarder_name text,
ADD COLUMN IF NOT EXISTS notify_party text,
ADD COLUMN IF NOT EXISTS container_number text,
ADD COLUMN IF NOT EXISTS port_of_unlading_id text,
ADD COLUMN IF NOT EXISTS port_of_unlading_name text,
ADD COLUMN IF NOT EXISTS master_bol_number text,
ADD COLUMN IF NOT EXISTS house_bol_number text,
ADD COLUMN IF NOT EXISTS port_of_lading_id text,
ADD COLUMN IF NOT EXISTS port_of_lading_name text,
ADD COLUMN IF NOT EXISTS container_types text,
ADD COLUMN IF NOT EXISTS container_type_descriptions text,
ADD COLUMN IF NOT EXISTS is_lcl boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS vessel_name text,
ADD COLUMN IF NOT EXISTS voyage_number text;

-- Add same columns to airfreight_shipments table
ALTER TABLE public.airfreight_shipments 
ADD COLUMN IF NOT EXISTS importer_id text,
ADD COLUMN IF NOT EXISTS importer_name text,
ADD COLUMN IF NOT EXISTS carrier_code text,
ADD COLUMN IF NOT EXISTS carrier_name text,
ADD COLUMN IF NOT EXISTS forwarder_scac_code text,
ADD COLUMN IF NOT EXISTS forwarder_name text,
ADD COLUMN IF NOT EXISTS notify_party text,
ADD COLUMN IF NOT EXISTS container_number text,
ADD COLUMN IF NOT EXISTS port_of_unlading_id text,
ADD COLUMN IF NOT EXISTS port_of_unlading_name text,
ADD COLUMN IF NOT EXISTS master_bol_number text,
ADD COLUMN IF NOT EXISTS house_bol_number text,
ADD COLUMN IF NOT EXISTS port_of_lading_id text,
ADD COLUMN IF NOT EXISTS port_of_lading_name text,
ADD COLUMN IF NOT EXISTS container_types text,
ADD COLUMN IF NOT EXISTS container_type_descriptions text,
ADD COLUMN IF NOT EXISTS is_lcl boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS voyage_number text;

-- Add same columns to ocean_shipments table
ALTER TABLE public.ocean_shipments 
ADD COLUMN IF NOT EXISTS importer_id text,
ADD COLUMN IF NOT EXISTS importer_name text,
ADD COLUMN IF NOT EXISTS carrier_code text,
ADD COLUMN IF NOT EXISTS carrier_name text,
ADD COLUMN IF NOT EXISTS forwarder_scac_code text,
ADD COLUMN IF NOT EXISTS forwarder_name text,
ADD COLUMN IF NOT EXISTS notify_party text,
ADD COLUMN IF NOT EXISTS container_number text,
ADD COLUMN IF NOT EXISTS port_of_unlading_id text,
ADD COLUMN IF NOT EXISTS port_of_unlading_name text,
ADD COLUMN IF NOT EXISTS master_bol_number text,
ADD COLUMN IF NOT EXISTS house_bol_number text,
ADD COLUMN IF NOT EXISTS port_of_lading_id text,
ADD COLUMN IF NOT EXISTS port_of_lading_name text,
ADD COLUMN IF NOT EXISTS container_types text,
ADD COLUMN IF NOT EXISTS container_type_descriptions text,
ADD COLUMN IF NOT EXISTS is_lcl boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS voyage_number text;

-- Add indexes for better search performance on new filterable columns
CREATE INDEX IF NOT EXISTS idx_unified_shipments_importer_name ON public.unified_shipments USING gin(to_tsvector('english', importer_name));
CREATE INDEX IF NOT EXISTS idx_unified_shipments_carrier_name ON public.unified_shipments USING gin(to_tsvector('english', carrier_name));
CREATE INDEX IF NOT EXISTS idx_unified_shipments_forwarder_name ON public.unified_shipments USING gin(to_tsvector('english', forwarder_name));
CREATE INDEX IF NOT EXISTS idx_unified_shipments_notify_party ON public.unified_shipments USING gin(to_tsvector('english', notify_party));
CREATE INDEX IF NOT EXISTS idx_unified_shipments_master_bol ON public.unified_shipments(master_bol_number);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_house_bol ON public.unified_shipments(house_bol_number);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_container_number ON public.unified_shipments(container_number);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_vessel_name ON public.unified_shipments USING gin(to_tsvector('english', vessel_name));

-- Fix RLS policies to ensure CSV/XLSX processing works without restrictions
-- Remove restrictive policies that might block bulk imports
DROP POLICY IF EXISTS "airfreight_authenticated_insert" ON public.airfreight_shipments;
DROP POLICY IF EXISTS "ocean_authenticated_insert" ON public.ocean_shipments;
DROP POLICY IF EXISTS "unified_authenticated_insert" ON public.unified_shipments;

-- Create permissive policies for CSV/XLSX processing
CREATE POLICY "Allow CSV/XLSX bulk imports for airfreight" ON public.airfreight_shipments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow CSV/XLSX bulk imports for ocean" ON public.ocean_shipments  
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow CSV/XLSX bulk imports for unified" ON public.unified_shipments
FOR INSERT WITH CHECK (true);

-- Ensure service role has full access for bulk processing
CREATE POLICY "Service role full access airfreight" ON public.airfreight_shipments
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access ocean" ON public.ocean_shipments
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access unified" ON public.unified_shipments
FOR ALL USING (auth.role() = 'service_role');
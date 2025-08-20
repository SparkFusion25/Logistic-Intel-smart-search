-- PHASE 1: Standardize all shipment tables with unified column structure

-- First, check if ocean_shipments and trade_shipments need data
-- Update airfreight_shipments policies to match unified_shipments
ALTER TABLE public.airfreight_shipments ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policy and add consistent ones
DROP POLICY IF EXISTS "airfreight_shipments_select" ON airfreight_shipments;

CREATE POLICY "airfreight_public_read" 
ON public.airfreight_shipments 
FOR SELECT 
USING (true);

CREATE POLICY "airfreight_service_role_all" 
ON public.airfreight_shipments 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "airfreight_authenticated_insert" 
ON public.airfreight_shipments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Update ocean_shipments policies to match
ALTER TABLE public.ocean_shipments ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive policy
DROP POLICY IF EXISTS "Allow anonymous insert" ON ocean_shipments;

CREATE POLICY "ocean_public_read" 
ON public.ocean_shipments 
FOR SELECT 
USING (true);

CREATE POLICY "ocean_service_role_all" 
ON public.ocean_shipments 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "ocean_authenticated_insert" 
ON public.ocean_shipments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Update trade_shipments policies to match
ALTER TABLE public.trade_shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trade_public_read" 
ON public.trade_shipments 
FOR SELECT 
USING (true);

CREATE POLICY "trade_service_role_all" 
ON public.trade_shipments 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "trade_authenticated_insert" 
ON public.trade_shipments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Ensure companies table has consistent policies (clean up duplicates)
DROP POLICY IF EXISTS "Companies: insert/update/delete" ON companies;
DROP POLICY IF EXISTS "Users can view own companies" ON companies;
DROP POLICY IF EXISTS "companies_read_owner" ON companies;

-- Keep only essential policies for companies
CREATE POLICY "companies_public_read" 
ON public.companies 
FOR SELECT 
USING (true);

CREATE POLICY "companies_service_role_all" 
ON public.companies 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "companies_authenticated_insert" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
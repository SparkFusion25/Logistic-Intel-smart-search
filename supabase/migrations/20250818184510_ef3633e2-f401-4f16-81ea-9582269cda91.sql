-- Fix RLS policy conflicts on unified_shipments table
-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "unified_shipments_select" ON public.unified_shipments;
DROP POLICY IF EXISTS "Users can access their org shipments" ON public.unified_shipments;
DROP POLICY IF EXISTS "Service role full access" ON public.unified_shipments;

-- Create clean, non-conflicting policies
CREATE POLICY "Service role can manage all shipments" ON public.unified_shipments
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can manage their org shipments" ON public.unified_shipments
FOR ALL USING (org_id = auth.uid());

-- Ensure service role has proper permissions on bulk_imports
DROP POLICY IF EXISTS "Service role can manage all bulk imports" ON public.bulk_imports;
DROP POLICY IF EXISTS "Users can manage their org bulk imports" ON public.bulk_imports;

CREATE POLICY "Service role can manage all imports" ON public.bulk_imports
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can manage their imports" ON public.bulk_imports
FOR ALL USING (org_id = auth.uid());
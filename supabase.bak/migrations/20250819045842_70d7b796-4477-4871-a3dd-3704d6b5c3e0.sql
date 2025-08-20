-- Drop ALL existing policies on unified_shipments to start clean
DROP POLICY IF EXISTS "Service role unrestricted access" ON public.unified_shipments;
DROP POLICY IF EXISTS "Service role can manage all shipments" ON public.unified_shipments;
DROP POLICY IF EXISTS "Service role can manage all unified_shipments" ON public.unified_shipments;
DROP POLICY IF EXISTS "Users can access their org unified_shipments" ON public.unified_shipments;
DROP POLICY IF EXISTS "Authenticated users access their org data" ON public.unified_shipments;

-- Create ONE clean service role policy with unrestricted access
CREATE POLICY "Service role unrestricted access" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'service_role'::text) 
WITH CHECK (auth.role() = 'service_role'::text);

-- Create user policy that only applies to authenticated users (not service role)
CREATE POLICY "Authenticated users access their org data" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'authenticated'::text AND org_id = auth.uid()) 
WITH CHECK (auth.role() = 'authenticated'::text AND org_id = auth.uid());

-- Keep public read access policy intact
-- (This policy should already exist and allow general read access)
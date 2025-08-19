-- Clean up conflicting RLS policies on unified_shipments table

-- Drop existing service role policies that may conflict
DROP POLICY IF EXISTS "Service role can manage all shipments" ON public.unified_shipments;
DROP POLICY IF EXISTS "Service role can manage all unified_shipments" ON public.unified_shipments;

-- Drop existing user policy to recreate with proper role filtering
DROP POLICY IF EXISTS "Users can access their org unified_shipments" ON public.unified_shipments;

-- Create ONE clean service role policy with unrestricted access
CREATE POLICY "Service role unrestricted access" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'service_role'::text) 
WITH CHECK (auth.role() = 'service_role'::text);

-- Recreate user policy that only applies to authenticated users (not service role)
CREATE POLICY "Authenticated users access their org data" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'authenticated'::text AND org_id = auth.uid()) 
WITH CHECK (auth.role() = 'authenticated'::text AND org_id = auth.uid());
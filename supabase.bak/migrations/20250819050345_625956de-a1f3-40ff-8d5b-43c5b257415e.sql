-- Remove ALL policies from unified_shipments table temporarily
DROP POLICY IF EXISTS "Service role unrestricted access" ON public.unified_shipments;
DROP POLICY IF EXISTS "Authenticated users access their org data" ON public.unified_shipments;
DROP POLICY IF EXISTS "unified_shipments_select" ON public.unified_shipments;

-- Add back ONLY the essential policies for bulk imports to work
-- 1. Service role policy for bulk imports
CREATE POLICY "Service role full access" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'service_role'::text) 
WITH CHECK (auth.role() = 'service_role'::text);

-- 2. Simple authenticated user policy (when you add users later)
CREATE POLICY "Users can access data" 
ON public.unified_shipments 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);
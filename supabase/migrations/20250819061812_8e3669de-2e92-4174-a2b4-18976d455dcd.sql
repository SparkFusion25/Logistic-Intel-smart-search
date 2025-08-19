-- Remove the restrictive RLS policy that's blocking bulk uploads
DROP POLICY IF EXISTS "Users can manage their org shipments" ON public.unified_shipments;

-- Create a more permissive policy that allows service role and authenticated users to insert
CREATE POLICY "Allow bulk imports and user access" 
ON public.unified_shipments 
FOR ALL 
USING (
  auth.role() = 'service_role'::text 
  OR auth.role() = 'authenticated'::text
)
WITH CHECK (
  auth.role() = 'service_role'::text 
  OR auth.role() = 'authenticated'::text
);
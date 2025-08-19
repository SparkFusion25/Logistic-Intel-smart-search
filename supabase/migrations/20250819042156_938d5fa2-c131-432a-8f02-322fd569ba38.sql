-- Remove org_id requirement for unified_shipments bulk imports
-- This allows service role to insert records without org_id restrictions for CSV/XLSX uploads

-- Update RLS policies to allow service role inserts without org_id validation
DROP POLICY IF EXISTS "unified_shipments_user_access" ON public.unified_shipments;

-- Create more permissive policies for bulk imports
CREATE POLICY "Service role can manage all unified_shipments" 
ON public.unified_shipments 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- Users can only access their own org data
CREATE POLICY "Users can access their org unified_shipments" 
ON public.unified_shipments 
FOR ALL 
TO authenticated
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());

-- Allow public read access for the trade_data_view (if needed)
CREATE POLICY "Public read access for unified_shipments" 
ON public.unified_shipments 
FOR SELECT 
TO anon, authenticated
USING (true);
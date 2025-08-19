-- Add back essential RLS policies for unified_shipments
CREATE POLICY "unified_shipments_public_read" 
ON public.unified_shipments 
FOR SELECT 
USING (true);

CREATE POLICY "unified_shipments_service_role_all" 
ON public.unified_shipments 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "unified_shipments_authenticated_insert" 
ON public.unified_shipments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
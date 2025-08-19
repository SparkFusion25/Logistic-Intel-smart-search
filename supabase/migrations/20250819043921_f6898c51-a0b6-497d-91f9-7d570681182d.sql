-- Make org_id nullable with default value in unified_shipments
ALTER TABLE public.unified_shipments 
ALTER COLUMN org_id DROP NOT NULL,
ALTER COLUMN org_id SET DEFAULT 'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid;

-- Update RLS policies to allow unrestricted service role INSERT
DROP POLICY IF EXISTS "Service role can manage all unified shipments" ON public.unified_shipments;

CREATE POLICY "Service role unrestricted access" ON public.unified_shipments
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
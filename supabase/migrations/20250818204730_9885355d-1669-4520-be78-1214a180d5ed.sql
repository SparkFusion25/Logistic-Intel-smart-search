-- CRITICAL FIX: Make org_id and mode NOT NULL in unified_shipments to match RLS policies
-- This ensures data integrity and prevents import failures

ALTER TABLE public.unified_shipments 
ALTER COLUMN org_id SET NOT NULL;

ALTER TABLE public.unified_shipments 
ALTER COLUMN mode SET NOT NULL;
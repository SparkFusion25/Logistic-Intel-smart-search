-- Remove NOT NULL constraint from mode column in unified_shipments table
ALTER TABLE public.unified_shipments 
ALTER COLUMN mode DROP NOT NULL;
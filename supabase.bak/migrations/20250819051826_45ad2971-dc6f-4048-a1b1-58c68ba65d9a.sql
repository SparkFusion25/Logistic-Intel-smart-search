-- Add missing 'w' column to unified_shipments table
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS w TEXT;
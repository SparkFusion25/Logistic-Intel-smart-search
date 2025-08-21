-- Add explicit trade_direction column to store CSV/XLSX "Trade Direction" values
ALTER TABLE public.unified_shipments ADD COLUMN IF NOT EXISTS trade_direction_explicit text;
ALTER TABLE public.ocean_shipments ADD COLUMN IF NOT EXISTS trade_direction_explicit text;  
ALTER TABLE public.airfreight_shipments ADD COLUMN IF NOT EXISTS trade_direction_explicit text;

-- Update unified view to prioritize explicit trade direction over computed
CREATE OR REPLACE VIEW public.unified_shipments_enhanced AS
SELECT 
  us.*,
  -- Prioritize explicit trade direction from CSV/XLSX, fallback to computed
  COALESCE(
    NULLIF(LOWER(TRIM(us.trade_direction_explicit)), ''),
    CASE 
      WHEN LOWER(COALESCE(us.destination_country, '')) IN ('us', 'usa', 'united states', 'united states of america') THEN 'import'
      WHEN LOWER(COALESCE(us.origin_country, '')) IN ('us', 'usa', 'united states', 'united states of america') THEN 'export'
      ELSE 'other'
    END
  ) as trade_direction_computed
FROM public.unified_shipments us;
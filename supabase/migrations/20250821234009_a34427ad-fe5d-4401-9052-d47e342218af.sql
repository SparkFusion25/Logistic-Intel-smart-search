-- Phase 1: Add trade_direction column and update unified_shipments structure
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS trade_direction text;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_trade_direction 
ON public.unified_shipments(trade_direction);

-- Create index for company name search performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_unified_company_name_gin 
ON public.unified_shipments USING gin(unified_company_name gin_trgm_ops);

-- Delete all existing records with NULL values (the 8,032 problematic records)
DELETE FROM public.unified_shipments 
WHERE unified_company_name IS NULL OR unified_company_name = '' OR unified_company_name = 'Unknown Company';

-- Also clean up any today's bad CRM imports
DELETE FROM public.crm_contacts 
WHERE DATE(created_at) = CURRENT_DATE 
  AND (company_name IS NULL OR company_name = 'Unknown Company' OR full_name IS NULL);

-- Add comment for documentation
COMMENT ON COLUMN public.unified_shipments.trade_direction IS 'Export/Import direction from Panjiva trade data';
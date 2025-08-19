-- Remove duplicate trigger on trade_shipments table
DROP TRIGGER IF EXISTS trigger_queue_invalid_companies_trade ON public.trade_shipments;

-- Ensure the enhanced trigger exists (this should already be there)
DROP TRIGGER IF EXISTS queue_invalid_company_for_enrichment_enhanced_trigger ON public.trade_shipments;
CREATE TRIGGER queue_invalid_company_for_enrichment_enhanced_trigger
  AFTER INSERT OR UPDATE ON public.trade_shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_invalid_company_for_enrichment_enhanced();

-- Fix the bulk_imports status constraint to include 'processing_batches' if needed
-- or we'll just use 'processing' as per the previous fix

-- Add proper null handling for date fields in trade_shipments table constraints
-- Ensure date fields can accept NULL values properly
ALTER TABLE public.trade_shipments 
  ALTER COLUMN shipment_date DROP NOT NULL,
  ALTER COLUMN arrival_date DROP NOT NULL;
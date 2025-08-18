-- Create a cron job to run the pending enrichment processor every 30 minutes
-- First, enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the enrichment processor to run every 30 minutes
SELECT cron.schedule(
  'process-pending-enrichment-job',
  '*/30 * * * *', -- every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/process-pending-enrichment',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"}'::jsonb,
        body:=concat('{"scheduled_run": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Add indexes to improve performance
CREATE INDEX IF NOT EXISTS idx_pending_enrichment_status ON pending_enrichment_records(status);
CREATE INDEX IF NOT EXISTS idx_pending_enrichment_created_at ON pending_enrichment_records(created_at);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_company_name_text ON unified_shipments USING gin(to_tsvector('english', unified_company_name));

-- Add a trigger to automatically queue unknown companies for enrichment
CREATE OR REPLACE FUNCTION queue_unknown_company_for_enrichment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if company name is invalid and not already queued
  IF NOT public.is_valid_company_name(NEW.unified_company_name) OR 
     NOT public.is_valid_company_name(NEW.inferred_company_name) THEN
    
    INSERT INTO public.pending_enrichment_records (
      original_record_id,
      source_table,
      invalid_company_name,
      original_data,
      status,
      created_at
    ) VALUES (
      NEW.id,
      'unified_shipments',
      COALESCE(NEW.unified_company_name, NEW.inferred_company_name, 'Unknown'),
      jsonb_build_object(
        'unified_company_name', NEW.unified_company_name,
        'inferred_company_name', NEW.inferred_company_name,
        'value_usd', NEW.value_usd,
        'shipment_date', NEW.shipment_date,
        'mode', NEW.mode
      ),
      'pending',
      NOW()
    )
    ON CONFLICT (original_record_id, source_table) DO NOTHING; -- Avoid duplicates
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_queue_unknown_companies ON unified_shipments;
CREATE TRIGGER trigger_queue_unknown_companies
  AFTER INSERT ON unified_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_unknown_company_for_enrichment();
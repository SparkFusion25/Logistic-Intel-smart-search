-- Fix pending_enrichment_records table structure to match process-pending-enrichment expectations
DROP TABLE IF EXISTS pending_enrichment_records;

CREATE TABLE pending_enrichment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  original_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'resolved', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add unique constraint to prevent duplicate pending records
  CONSTRAINT unique_org_company_pending UNIQUE (org_id, company_name)
);

-- Add RLS policies
ALTER TABLE pending_enrichment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their pending enrichment records"
ON pending_enrichment_records
FOR ALL
USING (org_id = auth.uid());

CREATE POLICY "Service role can manage all pending enrichment records"
ON pending_enrichment_records
FOR ALL
USING (auth.role() = 'service_role'::text);

-- Create indexes for performance
CREATE INDEX idx_pending_enrichment_org_status ON pending_enrichment_records(org_id, status);
CREATE INDEX idx_pending_enrichment_attempts ON pending_enrichment_records(attempts, last_attempt_at);

-- Create trigger to queue invalid company names for enrichment
CREATE OR REPLACE FUNCTION queue_invalid_company_for_enrichment()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the company name is invalid
  IF NOT public.is_valid_company_name(NEW.unified_company_name) THEN
    -- Insert into pending enrichment records (with conflict handling)
    INSERT INTO pending_enrichment_records (
      org_id,
      company_name,
      original_data,
      status,
      created_at
    ) VALUES (
      NEW.org_id,
      NEW.unified_company_name,
      jsonb_build_object(
        'hs_code', NEW.hs_code,
        'origin_country', NEW.origin_country,
        'destination_country', NEW.destination_country,
        'destination_city', NEW.destination_city,
        'destination_state', NEW.destination_state,
        'port_of_loading', NEW.port_of_loading,
        'port_of_discharge', NEW.port_of_discharge,
        'commodity_description', NEW.commodity_description,
        'shipper_name', NEW.shipper_name,
        'consignee_name', NEW.consignee_name,
        'mode', NEW.mode,
        'unified_date', NEW.unified_date,
        'unified_value', NEW.unified_value
      ),
      'pending',
      now()
    ) ON CONFLICT (org_id, company_name) DO UPDATE SET
      original_data = pending_enrichment_records.original_data || EXCLUDED.original_data,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on unified_shipments
CREATE TRIGGER trigger_queue_invalid_companies
  AFTER INSERT ON unified_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_invalid_company_for_enrichment();
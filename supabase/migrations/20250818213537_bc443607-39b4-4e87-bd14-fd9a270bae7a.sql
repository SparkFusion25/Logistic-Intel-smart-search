-- Comprehensive Company Validation & AI Enrichment Integration
-- Add validation triggers to all tables with company fields

-- Update the pending_enrichment_records table structure to support all tables
ALTER TABLE pending_enrichment_records 
ADD COLUMN IF NOT EXISTS original_record_id UUID,
ADD COLUMN IF NOT EXISTS source_table TEXT,
ADD COLUMN IF NOT EXISTS invalid_company_name TEXT,
ADD COLUMN IF NOT EXISTS resolved_company_name TEXT,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS attempt_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pending_enrichment_source_table ON pending_enrichment_records(source_table);
CREATE INDEX IF NOT EXISTS idx_pending_enrichment_invalid_company ON pending_enrichment_records(invalid_company_name);
CREATE INDEX IF NOT EXISTS idx_pending_enrichment_resolved ON pending_enrichment_records(resolved_at) WHERE resolved_at IS NOT NULL;

-- Drop existing constraint and add new one
ALTER TABLE pending_enrichment_records DROP CONSTRAINT IF EXISTS unique_org_company_pending;
ALTER TABLE pending_enrichment_records 
ADD CONSTRAINT unique_org_company_source_pending UNIQUE (org_id, company_name, source_table);

-- Create enhanced queue function for all tables
CREATE OR REPLACE FUNCTION queue_invalid_company_for_enrichment_enhanced()
RETURNS TRIGGER AS $$
DECLARE
  v_company_fields TEXT[];
  v_field TEXT;
  v_company_name TEXT;
  v_source_table TEXT;
BEGIN
  v_source_table := TG_TABLE_NAME;
  
  -- Define company fields for each table
  v_company_fields := CASE v_source_table
    WHEN 'unified_shipments' THEN ARRAY['unified_company_name', 'shipper_name', 'consignee_name']
    WHEN 'airfreight_shipments' THEN ARRAY['shipper_name', 'consignee_name']
    WHEN 'ocean_shipments' THEN ARRAY['company_name', 'shipper_name', 'consignee_name'] 
    WHEN 'trade_shipments' THEN ARRAY['inferred_company_name', 'shipper_name', 'consignee_name']
    ELSE ARRAY[]::TEXT[]
  END;

  -- Process each company field
  FOREACH v_field IN ARRAY v_company_fields
  LOOP
    -- Extract company name using dynamic SQL
    EXECUTE format('SELECT $1.%I', v_field) USING NEW INTO v_company_name;
    
    -- Check if company name is invalid and queue for enrichment
    IF v_company_name IS NOT NULL AND NOT public.is_valid_company_name(v_company_name) THEN
      INSERT INTO pending_enrichment_records (
        org_id,
        company_name,
        invalid_company_name,
        source_table,
        original_record_id,
        original_data,
        status,
        created_at
      ) VALUES (
        COALESCE(NEW.org_id, 'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid), -- fallback org_id
        v_company_name,
        v_company_name,
        v_source_table,
        NEW.id,
        row_to_json(NEW),
        'pending',
        now()
      ) ON CONFLICT (org_id, company_name, source_table) DO UPDATE SET
        original_data = pending_enrichment_records.original_data || EXCLUDED.original_data,
        updated_at = now();
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all relevant tables
DROP TRIGGER IF EXISTS trigger_queue_invalid_companies ON unified_shipments;
CREATE TRIGGER trigger_queue_invalid_companies_enhanced
  AFTER INSERT ON unified_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

CREATE TRIGGER trigger_queue_invalid_companies_airfreight
  AFTER INSERT ON airfreight_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

CREATE TRIGGER trigger_queue_invalid_companies_ocean
  AFTER INSERT ON ocean_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

CREATE TRIGGER trigger_queue_invalid_companies_trade
  AFTER INSERT ON trade_shipments
  FOR EACH ROW
  EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

-- Create unified company name standardization function
CREATE OR REPLACE FUNCTION standardize_company_name(company_name TEXT)
RETURNS TEXT AS $$
BEGIN
  IF company_name IS NULL OR LENGTH(TRIM(company_name)) = 0 THEN
    RETURN NULL;
  END IF;
  
  -- Basic standardization rules
  RETURN TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        UPPER(company_name),
        '\s+', ' ', 'g'  -- normalize whitespace
      ),
      '[^\w\s&.-]', '', 'g'  -- remove special chars except common business ones
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
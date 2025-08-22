-- Fix bulk import issues by handling the view dependency

-- 1. Drop the view that depends on value_usd column
DROP VIEW IF EXISTS unified_shipments_view;

-- 2. Fix numeric columns in unified_shipments to handle decimal values
ALTER TABLE unified_shipments 
  ALTER COLUMN value_usd TYPE NUMERIC USING NULLIF(REPLACE(value_usd::text, ',', ''), '')::NUMERIC,
  ALTER COLUMN gross_weight_kg TYPE NUMERIC USING NULLIF(REPLACE(gross_weight_kg::text, ',', ''), '')::NUMERIC;

-- 3. Fix bulk_imports status constraint
ALTER TABLE bulk_imports DROP CONSTRAINT IF EXISTS bulk_imports_status_check;
ALTER TABLE bulk_imports ADD CONSTRAINT bulk_imports_status_check 
  CHECK (status IN ('uploaded', 'processing', 'completed', 'error'));

-- 4. Reset the stuck import to allow reprocessing
UPDATE bulk_imports 
SET status = 'uploaded', 
    ai_processing_status = 'pending',
    error_details = NULL
WHERE filename = 'PANJIVA_Enriched.xlsx' 
  AND status = 'processing';

-- 5. Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_company_name ON unified_shipments (unified_company_name);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_date ON unified_shipments (unified_date);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_mode ON unified_shipments (mode);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_org_id ON unified_shipments (org_id);

-- 6. Add partial unique indexes for contacts (when they get created via CRM)
CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_contacts_email 
  ON crm_contacts (org_id, LOWER(email)) 
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_contacts_panjiva 
  ON crm_contacts (org_id, panjiva_id) 
  WHERE panjiva_id IS NOT NULL;
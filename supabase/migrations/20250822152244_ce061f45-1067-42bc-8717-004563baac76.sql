-- Fix unified_shipments schema for type conversion issues only
ALTER TABLE IF EXISTS unified_shipments
  ALTER COLUMN container_count TYPE INTEGER USING ROUND(NULLIF(container_count::TEXT, '')::NUMERIC),
  ALTER COLUMN quantity TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(quantity::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC,
  ALTER COLUMN gross_weight_kg TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(gross_weight_kg::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS bulk_imports_status_idx ON bulk_imports(status);
CREATE INDEX IF NOT EXISTS bulk_imports_created_at_idx ON bulk_imports(created_at DESC);
CREATE INDEX IF NOT EXISTS unified_shipments_import_job_idx ON unified_shipments(org_id, created_at DESC);
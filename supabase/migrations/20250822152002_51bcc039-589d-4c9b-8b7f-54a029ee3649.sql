-- Phase 0: Unstick bad jobs (mark stuck jobs as failed)
UPDATE bulk_imports
SET status = 'failed', 
    ai_processing_status = 'failed',
    updated_at = NOW(),
    error_details = '{"error": "Auto-fail: stuck >30m", "auto_failed": true}'
WHERE status IN ('processing') 
  AND COALESCE(updated_at, created_at) < NOW() - INTERVAL '30 minutes';

-- Phase 1: Schema corrections for import_jobs table
ALTER TABLE IF EXISTS bulk_imports
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_rows INTEGER DEFAULT 0;

-- Update existing failed jobs to set failed_at timestamp
UPDATE bulk_imports 
SET failed_at = updated_at 
WHERE status = 'failed' AND failed_at IS NULL;

-- Update existing completed jobs to set proper timestamps
UPDATE bulk_imports 
SET started_at = created_at 
WHERE status = 'completed' AND started_at IS NULL;

-- Phase 1: Fix unified_shipments schema for type conversion issues
ALTER TABLE IF EXISTS unified_shipments
  ALTER COLUMN container_count TYPE INTEGER USING ROUND(NULLIF(container_count::TEXT, '')::NUMERIC),
  ALTER COLUMN quantity TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(quantity::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC,
  ALTER COLUMN gross_weight_kg TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(gross_weight_kg::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS bulk_imports_status_idx ON bulk_imports(status);
CREATE INDEX IF NOT EXISTS bulk_imports_created_at_idx ON bulk_imports(created_at DESC);
CREATE INDEX IF NOT EXISTS unified_shipments_import_job_idx ON unified_shipments(org_id, created_at DESC);
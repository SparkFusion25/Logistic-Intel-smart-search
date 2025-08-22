-- Fix both check constraints to allow 'failed' status
ALTER TABLE bulk_imports DROP CONSTRAINT IF EXISTS bulk_imports_status_check;
ALTER TABLE bulk_imports DROP CONSTRAINT IF EXISTS bulk_imports_ai_processing_status_check;

-- Add proper constraints that allow 'failed' status
ALTER TABLE bulk_imports ADD CONSTRAINT bulk_imports_status_check 
  CHECK (status IN ('uploaded', 'processing', 'completed', 'failed'));

ALTER TABLE bulk_imports ADD CONSTRAINT bulk_imports_ai_processing_status_check 
  CHECK (ai_processing_status IN ('pending', 'ai_processing', 'completed', 'failed'));

-- Now unstick bad jobs (mark stuck jobs as failed)
UPDATE bulk_imports
SET status = 'failed', 
    ai_processing_status = 'failed',
    updated_at = NOW(),
    error_details = '{"error": "Auto-fail: stuck >30m", "auto_failed": true}'
WHERE status IN ('processing') 
  AND COALESCE(updated_at, created_at) < NOW() - INTERVAL '30 minutes';

-- Add new columns for better state tracking
ALTER TABLE bulk_imports
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
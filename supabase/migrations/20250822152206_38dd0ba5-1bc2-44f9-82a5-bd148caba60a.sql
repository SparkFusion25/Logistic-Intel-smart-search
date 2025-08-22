-- Fix unified_shipments schema for type conversion issues
ALTER TABLE IF EXISTS unified_shipments
  ALTER COLUMN container_count TYPE INTEGER USING ROUND(NULLIF(container_count::TEXT, '')::NUMERIC),
  ALTER COLUMN quantity TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(quantity::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC,
  ALTER COLUMN gross_weight_kg TYPE NUMERIC(18,3) USING NULLIF(REGEXP_REPLACE(COALESCE(gross_weight_kg::TEXT, ''), '[, ]', '', 'g'), '')::NUMERIC;

-- Add storage bucket for imports if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bulk-imports', 'bulk-imports', false)
ON CONFLICT (id) DO NOTHING;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS bulk_imports_status_idx ON bulk_imports(status);
CREATE INDEX IF NOT EXISTS bulk_imports_created_at_idx ON bulk_imports(created_at DESC);
CREATE INDEX IF NOT EXISTS unified_shipments_import_job_idx ON unified_shipments(org_id, created_at DESC);

-- Add storage policies for bulk imports bucket
CREATE POLICY "Users can upload to their org folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bulk-imports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their org files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bulk-imports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Service role can manage all bulk imports" ON storage.objects
  FOR ALL USING (bucket_id = 'bulk-imports');
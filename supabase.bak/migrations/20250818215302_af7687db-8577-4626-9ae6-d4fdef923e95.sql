-- Phase 3: Reset the stuck CSV import to allow reprocessing
UPDATE bulk_imports 
SET status = 'uploaded', 
    processed_records = 0, 
    duplicate_records = 0, 
    error_records = 0,
    processing_metadata = '{}',
    error_details = '{}',
    updated_at = now()
WHERE status = 'uploaded' 
  AND total_records = 14437;
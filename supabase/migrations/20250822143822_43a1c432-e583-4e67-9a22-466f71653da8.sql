-- Reset the stuck bulk import
UPDATE bulk_imports 
SET 
  status = 'uploaded',
  ai_processing_status = 'pending',
  processed_records = 0,
  error_records = 0,
  updated_at = NOW(),
  completed_at = NULL,
  processing_metadata = '{}',
  error_details = '{}'
WHERE id = 'a2c92702-f119-4be2-b6f2-a4e843507af4';
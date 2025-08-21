-- Reset the problematic import to allow re-processing
UPDATE bulk_imports 
SET status = 'uploaded', 
    ai_processing_status = 'pending',
    completed_at = NULL,
    processed_records = 0,
    error_records = 0,
    total_records = 0
WHERE filename = 'Panjiva - US EXPORTS 2025.xlsx' 
  AND status = 'completed' 
  AND processed_records = 25;
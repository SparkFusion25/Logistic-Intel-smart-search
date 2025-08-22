-- Reset PANJIVA_Enriched.xlsx import status for testing
UPDATE bulk_imports 
SET status = 'uploaded', 
    ai_processing_status = 'pending',
    completed_at = NULL,
    updated_at = NOW()
WHERE filename = 'PANJIVA_Enriched.xlsx' 
  AND status IN ('processing', 'completed');
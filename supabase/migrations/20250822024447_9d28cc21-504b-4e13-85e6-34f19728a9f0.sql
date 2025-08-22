-- Reset stuck import status for PANJIVA_Enriched.xlsx
UPDATE bulk_imports 
SET status = 'uploaded', ai_processing_status = 'pending' 
WHERE filename = 'PANJIVA_Enriched.xlsx' AND status = 'processing';
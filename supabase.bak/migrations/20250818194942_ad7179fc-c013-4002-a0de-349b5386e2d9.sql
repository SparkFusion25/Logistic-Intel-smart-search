UPDATE bulk_imports 
SET status = 'failed', 
    error_details = '{"error": "Import timed out after 45+ minutes", "reason": "timeout"}'::jsonb,
    updated_at = NOW() 
WHERE id = '259a2ef2-0f7d-43ca-8e40-fc4dd5fbd614' 
  AND status = 'processing';
-- Clean up any stuck processing records
DELETE FROM public.bulk_imports 
WHERE org_id = 'bb997b6b-fa1a-46c8-9957-fabe835eee55' 
  AND status = 'processing';
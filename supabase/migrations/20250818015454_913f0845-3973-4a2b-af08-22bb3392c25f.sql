-- Fix the queue_apollo_enrichment function to set success = false instead of NULL
CREATE OR REPLACE FUNCTION public.queue_apollo_enrichment()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Skip if no org or no material change
  IF NEW.org_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only enqueue when we have something enrichable (email or full_name),
  -- and the row is new or those fields changed.
  IF (TG_OP = 'INSERT')
     OR (TG_OP = 'UPDATE' AND (
          COALESCE(NEW.email,'') <> COALESCE(OLD.email,'')
          OR COALESCE(NEW.full_name,'') <> COALESCE(OLD.full_name,'')
        ))
  THEN
    -- Create a lightweight "queued" event (dedupe recent ones)
    INSERT INTO public.enrichment_events (org_id, contact_id, provider, payload, success, created_at)
    VALUES (NEW.org_id, NEW.id, 'apollo',
            jsonb_build_object(
              'queued', true,
              'email', NEW.email,
              'full_name', NEW.full_name,
              'source', COALESCE(NEW.source,'manual')
            ),
            false, NOW());
  END IF;

  RETURN NEW;
END;
$function$

-- Check if trigger exists and create it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'queue_apollo_enrichment_trigger' 
        AND event_object_table = 'crm_contacts'
    ) THEN
        CREATE TRIGGER queue_apollo_enrichment_trigger
            AFTER INSERT OR UPDATE ON public.crm_contacts
            FOR EACH ROW
            EXECUTE FUNCTION public.queue_apollo_enrichment();
    END IF;
END $$;
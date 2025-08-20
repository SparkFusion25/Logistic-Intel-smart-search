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
$function$;
-- Fix enrichment_events RLS policies
-- Remove all broken policies that use current_org_id()
DROP POLICY IF EXISTS "enrichment_events_delete" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_delete_org_delete_org" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_insert" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_insert_org_insert_org" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_select" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_select_org_select_org" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_update" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_update_org_update_org" ON public.enrichment_events;

-- Create single working policy for enrichment_events
CREATE POLICY "enrichment_events_user_access" ON public.enrichment_events
  FOR ALL USING (org_id = auth.uid());

-- Also fix any remaining broken policies on other tables
-- Remove broken audit_logs policies if they exist
DROP POLICY IF EXISTS "audit_logs_delete_org_delete_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_org_insert_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_org_select_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_update_org_update_org" ON public.audit_logs;
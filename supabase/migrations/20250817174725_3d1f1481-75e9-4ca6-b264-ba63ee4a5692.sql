-- Fix RLS policies to work without separate users table
-- Use auth.uid() directly as org_id for now

-- Update pipeline policies
DROP POLICY IF EXISTS pipelines_read ON public.pipelines;
CREATE POLICY pipelines_read ON public.pipelines
FOR SELECT
TO authenticated
USING (org_id = auth.uid());

DROP POLICY IF EXISTS pipelines_insert ON public.pipelines;
CREATE POLICY pipelines_insert ON public.pipelines
FOR INSERT
TO authenticated
WITH CHECK (org_id = auth.uid());

-- Update pipeline_stages policies  
DROP POLICY IF EXISTS pipeline_stages_read ON public.pipeline_stages;
CREATE POLICY pipeline_stages_read ON public.pipeline_stages
FOR SELECT
TO authenticated
USING (org_id = auth.uid());

DROP POLICY IF EXISTS pipeline_stages_insert ON public.pipeline_stages;
CREATE POLICY pipeline_stages_insert ON public.pipeline_stages
FOR INSERT
TO authenticated
WITH CHECK (org_id = auth.uid());

-- Update deals policies
DROP POLICY IF EXISTS deals_select ON public.deals;
CREATE POLICY deals_select ON public.deals
FOR SELECT
TO authenticated
USING (org_id = auth.uid());

DROP POLICY IF EXISTS deals_insert ON public.deals;
CREATE POLICY deals_insert ON public.deals
FOR INSERT
TO authenticated
WITH CHECK (org_id = auth.uid());

DROP POLICY IF EXISTS deals_update ON public.deals;
CREATE POLICY deals_update ON public.deals
FOR UPDATE
TO authenticated
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());
-- Fix RLS policies for CRM deals functionality
-- The issue is that RLS is blocking edge function access

-- First, ensure the service role can bypass RLS for edge functions
-- by adding service_role policies

-- Pipelines table policies
DROP POLICY IF EXISTS pipelines_service_role ON public.pipelines;
CREATE POLICY pipelines_service_role ON public.pipelines
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS pipelines_authenticated ON public.pipelines;
CREATE POLICY pipelines_authenticated ON public.pipelines
FOR ALL
TO authenticated
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());

-- Pipeline_stages table policies  
DROP POLICY IF EXISTS pipeline_stages_service_role ON public.pipeline_stages;
CREATE POLICY pipeline_stages_service_role ON public.pipeline_stages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS pipeline_stages_authenticated ON public.pipeline_stages;
CREATE POLICY pipeline_stages_authenticated ON public.pipeline_stages
FOR ALL
TO authenticated
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());

-- Deals table policies
DROP POLICY IF EXISTS deals_service_role ON public.deals;
CREATE POLICY deals_service_role ON public.deals
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS deals_authenticated ON public.deals;
CREATE POLICY deals_authenticated ON public.deals
FOR ALL
TO authenticated
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());
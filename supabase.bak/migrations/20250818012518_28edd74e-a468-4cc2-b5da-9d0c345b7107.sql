-- Fix RLS policies for pipelines and pipeline_stages tables
-- Remove conflicting policies and create simple, consistent ones

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "pipelines_org_select" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_org_insert" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_org_update" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_org_delete" ON public.pipelines;

DROP POLICY IF EXISTS "pipeline_stages_org_select" ON public.pipeline_stages;
DROP POLICY IF EXISTS "pipeline_stages_org_insert" ON public.pipeline_stages;
DROP POLICY IF EXISTS "pipeline_stages_org_update" ON public.pipeline_stages;
DROP POLICY IF EXISTS "pipeline_stages_org_delete" ON public.pipeline_stages;

-- Create simple, consistent policies using auth.uid() as org_id
-- Pipelines policies
CREATE POLICY "pipelines_user_access" ON public.pipelines
  FOR ALL USING (org_id = auth.uid());

-- Pipeline stages policies  
CREATE POLICY "pipeline_stages_user_access" ON public.pipeline_stages
  FOR ALL USING (org_id = auth.uid());
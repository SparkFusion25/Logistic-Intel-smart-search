-- Enable RLS for all CRM tables
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

-- Fix the existing pipeline policies to use proper org relationship
DROP POLICY IF EXISTS pipelines_read ON public.pipelines;
CREATE POLICY pipelines_read ON public.pipelines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = pipelines.org_id
  )
);

DROP POLICY IF EXISTS pipelines_insert ON public.pipelines;
CREATE POLICY pipelines_insert ON public.pipelines
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = pipelines.org_id
  )
);

-- Fix the existing pipeline_stages policies
DROP POLICY IF EXISTS pipeline_stages_read ON public.pipeline_stages;
CREATE POLICY pipeline_stages_read ON public.pipeline_stages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = pipeline_stages.org_id
  )
);

DROP POLICY IF EXISTS pipeline_stages_insert ON public.pipeline_stages;
CREATE POLICY pipeline_stages_insert ON public.pipeline_stages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = pipeline_stages.org_id
  )
);

-- Create comprehensive deals policies
DROP POLICY IF EXISTS deals_select ON public.deals;
CREATE POLICY deals_select ON public.deals
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = deals.org_id
  )
);

DROP POLICY IF EXISTS deals_insert ON public.deals;
CREATE POLICY deals_insert ON public.deals
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = deals.org_id
  )
);

DROP POLICY IF EXISTS deals_update ON public.deals;
CREATE POLICY deals_update ON public.deals
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = deals.org_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.org_id = deals.org_id
  )
);

-- Add foreign key constraint for stage validation
ALTER TABLE public.deals
  DROP CONSTRAINT IF EXISTS deals_stage_fk;
ALTER TABLE public.deals
  ADD CONSTRAINT deals_stage_fk
  FOREIGN KEY (stage_id) REFERENCES public.pipeline_stages(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS deals_org_stage_idx ON public.deals(org_id, stage_id);
CREATE INDEX IF NOT EXISTS deals_org_pipeline_idx ON public.deals(org_id, pipeline_id);
CREATE INDEX IF NOT EXISTS users_org_idx ON public.users(org_id);
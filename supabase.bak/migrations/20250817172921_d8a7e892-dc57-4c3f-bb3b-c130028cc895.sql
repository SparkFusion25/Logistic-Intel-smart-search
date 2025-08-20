-- Enable RLS and create org-scoped policies for pipelines
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pipelines_read ON public.pipelines;
CREATE POLICY pipelines_read ON public.pipelines
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.id = pipelines.org_id
  )
);

DROP POLICY IF EXISTS pipelines_insert ON public.pipelines;
CREATE POLICY pipelines_insert ON public.pipelines
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.id = pipelines.org_id
  )
);

-- Enable RLS and create org-scoped policies for pipeline_stages
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pipeline_stages_read ON public.pipeline_stages;
CREATE POLICY pipeline_stages_read ON public.pipeline_stages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.id = pipeline_stages.org_id
  )
);

DROP POLICY IF EXISTS pipeline_stages_insert ON public.pipeline_stages;
CREATE POLICY pipeline_stages_insert ON public.pipeline_stages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.id = pipeline_stages.org_id
  )
);
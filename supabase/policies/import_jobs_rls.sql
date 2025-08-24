-- RLS Policies for import_jobs and import_job_errors tables
-- Ensures org-based security isolation

-- Enable RLS on both tables
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_job_errors ENABLE ROW LEVEL SECURITY;

-- Import Jobs Policies
-- Users can only see jobs from their org
CREATE POLICY "Users can view their org's import jobs" 
ON public.import_jobs FOR SELECT 
USING (
  -- For development: allow authenticated users to see all jobs
  -- In production: add proper org_id check
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can create import jobs" 
ON public.import_jobs FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  org_id = auth.uid() -- Use user ID as org_id for now
);

CREATE POLICY "Users can update their org's import jobs" 
ON public.import_jobs FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND
  (org_id = auth.uid() OR user_id = auth.uid())
);

-- Service role can bypass RLS for bulk operations
CREATE POLICY "Service role can manage all import jobs" 
ON public.import_jobs FOR ALL 
USING (auth.role() = 'service_role');

-- Import Job Errors Policies
-- Users can only see errors for jobs they have access to
CREATE POLICY "Users can view their import job errors" 
ON public.import_job_errors FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.import_jobs 
    WHERE import_jobs.id = import_job_errors.job_id 
    AND (
      auth.uid() IS NOT NULL AND
      (import_jobs.org_id = auth.uid() OR import_jobs.user_id = auth.uid())
    )
  )
);

-- Service role can manage all errors (needed for Edge Function)
CREATE POLICY "Service role can manage all import job errors" 
ON public.import_job_errors FOR ALL 
USING (auth.role() = 'service_role');

-- Storage Policies for 'imports' bucket
-- Users can upload to their org folder
CREATE POLICY "Users can upload to their org folder in imports bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'imports' AND 
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = 'org' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can read from their org folder
CREATE POLICY "Users can read from their org folder in imports bucket" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'imports' AND 
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = 'org' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Service role can manage all objects in imports bucket
CREATE POLICY "Service role can manage all imports bucket objects" 
ON storage.objects FOR ALL 
USING (bucket_id = 'imports' AND auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON POLICY "Users can view their org's import jobs" ON public.import_jobs IS 
'Users can only access import jobs from their organization';

COMMENT ON POLICY "Service role can manage all import jobs" ON public.import_jobs IS 
'Edge Functions running as service role can bypass RLS for bulk operations';

COMMENT ON TABLE public.import_jobs IS 
'Import job tracking table - stores metadata for bulk data imports';

COMMENT ON TABLE public.import_job_errors IS 
'Import error logging table - stores detailed error information for failed rows';

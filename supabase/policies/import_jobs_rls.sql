-- Row Level Security policies for import_jobs and import_job_errors

-- Enable RLS on both tables
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_job_errors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS import_jobs_rw ON public.import_jobs;
DROP POLICY IF EXISTS import_job_errors_r ON public.import_job_errors;

-- Policy for import_jobs: users can manage their own jobs
-- For now, using user_id = auth.uid() until org system is fully implemented
CREATE POLICY import_jobs_rw ON public.import_jobs
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for import_job_errors: users can read errors for their jobs
CREATE POLICY import_job_errors_r ON public.import_job_errors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.import_jobs
    WHERE import_jobs.id = import_job_errors.job_id
    AND import_jobs.user_id = auth.uid()
  )
);

-- Allow authenticated users to insert errors (needed by edge functions)
CREATE POLICY import_job_errors_w ON public.import_job_errors
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.import_jobs
    WHERE import_jobs.id = import_job_errors.job_id
    AND import_jobs.user_id = auth.uid()
  )
);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_jobs TO authenticated;
GRANT SELECT, INSERT ON public.import_job_errors TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_import_jobs_user_id ON public.import_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON public.import_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_job_errors_job_id ON public.import_job_errors(job_id);
CREATE INDEX IF NOT EXISTS idx_import_job_errors_row_number ON public.import_job_errors(job_id, row_number);

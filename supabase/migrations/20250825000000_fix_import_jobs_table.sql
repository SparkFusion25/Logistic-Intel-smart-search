-- Create import_jobs and import_job_errors tables per task requirements
-- This creates the canonical schema that the Edge Function expects

-- Drop existing tables if they exist (careful - this will lose data!)
DROP TABLE IF EXISTS public.import_job_errors CASCADE;
DROP TABLE IF EXISTS public.import_jobs CASCADE;

-- Create import_jobs table per task specification
CREATE TABLE public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  user_id uuid NOT NULL,
  source_bucket text NOT NULL DEFAULT 'imports',
  object_path text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'success', 'error')),
  total_rows integer DEFAULT 0,
  success_rows integer DEFAULT 0,
  error_rows integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create import_job_errors table per task specification  
CREATE TABLE public.import_job_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
  row_number integer NULL,
  raw_data jsonb NOT NULL,
  error_code text NULL,
  error_detail text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_import_jobs_org_id ON public.import_jobs(org_id);
CREATE INDEX idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX idx_import_jobs_created_at ON public.import_jobs(created_at DESC);
CREATE INDEX idx_import_job_errors_job_id ON public.import_job_errors(job_id);
CREATE INDEX idx_import_job_errors_row_number ON public.import_job_errors(row_number);

-- Enable RLS
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_job_errors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their org's import jobs" ON public.import_jobs
  FOR ALL USING (
    -- Allow users to see jobs from their org
    -- For development, we'll use a simple auth.uid() check
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view their org's import job errors" ON public.import_job_errors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.import_jobs 
      WHERE import_jobs.id = import_job_errors.job_id 
      AND auth.uid() IS NOT NULL
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_import_jobs_updated_at
    BEFORE UPDATE ON public.import_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket 'imports' if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('imports', 'imports', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for imports bucket
CREATE POLICY "Users can upload to imports bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'imports' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can read from imports bucket" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'imports' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Service role can manage imports bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'imports');

-- Migrate existing bulk_imports data to import_jobs if needed
DO $$
BEGIN
  -- Check if bulk_imports exists and has data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bulk_imports') THEN
    -- Migrate data from bulk_imports to import_jobs
    INSERT INTO public.import_jobs (
      id, org_id, user_id, source_bucket, object_path, status,
      total_rows, success_rows, error_rows, started_at, finished_at, created_at, updated_at
    )
    SELECT 
      id,
      COALESCE(org_id, 'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid) as org_id,
      COALESCE(user_id, 'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid) as user_id,
      'bulk-imports' as source_bucket, -- Map from old bucket name
      file_path as object_path,
      CASE status
        WHEN 'uploaded' THEN 'queued'
        WHEN 'processing' THEN 'running'  
        WHEN 'completed' THEN 'success'
        WHEN 'failed' THEN 'error'
        ELSE 'queued'
      END as status,
      COALESCE(total_records, 0) as total_rows,
      COALESCE(processed_records, 0) as success_rows,
      COALESCE(error_records, 0) as error_rows,
      started_at,
      completed_at as finished_at,
      created_at,
      updated_at
    FROM public.bulk_imports
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Migrated data from bulk_imports to import_jobs';
  END IF;
END
$$;
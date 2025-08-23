-- Storage policies for the 'imports' bucket
-- Run this in the Supabase SQL editor after creating the bucket

-- Create the imports bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('imports', 'imports', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files to their org folder
CREATE POLICY "Users can upload to their org folder" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'imports'
  AND auth.uid()::text = split_part(name, '/', 2)
);

-- Policy: Allow authenticated users to read their own files
CREATE POLICY "Users can read their own files" ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'imports'
  AND auth.uid()::text = split_part(name, '/', 2)
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'imports'
  AND auth.uid()::text = split_part(name, '/', 2)
);

-- Policy: Allow service role to access all files (needed for edge functions)
CREATE POLICY "Service role can access all import files" ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'imports');

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Create storage bucket for bulk import files
INSERT INTO storage.buckets (id, name, public) VALUES ('bulk-import-files', 'bulk-import-files', false);

-- Create RLS policies for bulk import files storage
CREATE POLICY "Users can upload their own bulk import files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bulk-import-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own bulk import files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bulk-import-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all bulk import files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'bulk-import-files' AND is_admin_user());
-- Fix RLS policies for site_content table
DROP POLICY IF EXISTS "Admin can manage site content" ON site_content;
DROP POLICY IF EXISTS "Users can view site content" ON site_content;

-- Create proper RLS policies for site_content
CREATE POLICY "Admin can manage site content" 
ON site_content 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role' = 'admin'
         OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role' = 'admin'
         OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  )
);

CREATE POLICY "Public can view site content" 
ON site_content 
FOR SELECT 
USING (true);

-- Create service role policy for backend operations
CREATE POLICY "Service role can manage site content" 
ON site_content 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
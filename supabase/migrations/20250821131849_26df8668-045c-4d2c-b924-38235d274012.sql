-- Fix RLS policies for bulk_imports table to allow inserts
CREATE POLICY "Users can insert their bulk imports" 
ON public.bulk_imports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their bulk imports" 
ON public.bulk_imports 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Fix company_profiles table RLS policies  
CREATE POLICY "Users can manage company profiles"
ON public.company_profiles
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix contacts table RLS policies
CREATE POLICY "Users can manage contacts through auth"
ON public.contacts
FOR ALL  
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix campaigns table RLS policies  
CREATE POLICY "Users can manage their campaigns"
ON public.campaigns
FOR ALL
USING (org_id = auth.uid() OR creator_id = auth.uid())
WITH CHECK (org_id = auth.uid() OR creator_id = auth.uid());
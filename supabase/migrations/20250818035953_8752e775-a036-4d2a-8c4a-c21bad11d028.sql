-- Fix RLS policy for activities table to allow proper activity logging
-- The current policy might be too restrictive

-- First, let's check and update the activities RLS policies
DROP POLICY IF EXISTS "activities_org_insert" ON activities;
DROP POLICY IF EXISTS "activities_org_select" ON activities;
DROP POLICY IF EXISTS "activities_org_update" ON activities;
DROP POLICY IF EXISTS "activities_org_delete" ON activities;

-- Create more permissive policies for activities
CREATE POLICY "activities_org_select" ON activities
  FOR SELECT USING (org_id = auth.uid());

CREATE POLICY "activities_org_insert" ON activities
  FOR INSERT WITH CHECK (org_id = auth.uid());

CREATE POLICY "activities_org_update" ON activities
  FOR UPDATE USING (org_id = auth.uid()) WITH CHECK (org_id = auth.uid());

CREATE POLICY "activities_org_delete" ON activities
  FOR DELETE USING (org_id = auth.uid());
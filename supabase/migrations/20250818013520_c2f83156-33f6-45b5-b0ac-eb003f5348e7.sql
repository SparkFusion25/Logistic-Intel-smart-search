-- Remove duplicate policies in smaller batches to avoid deadlocks

-- First batch: Remove duplicate crm_contacts policies (keep the _org_ versions)
DROP POLICY IF EXISTS "crm_contacts_delete" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_insert" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_select" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_update" ON public.crm_contacts;

-- Remove the broken _org_ policies and create working ones
DROP POLICY IF EXISTS "crm_contacts_delete_org_delete_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_insert_org_insert_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_select_org_select_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_update_org_update_org" ON public.crm_contacts;

-- Create single working policy for crm_contacts
CREATE POLICY "crm_contacts_user_access" ON public.crm_contacts
  FOR ALL USING (org_id = auth.uid());
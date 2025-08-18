-- Remove duplicate and unnecessary RLS policies
-- Keep only essential policies for: search, CRM, emails, campaigns, subscriptions, users, analysis, widgets, admin

-- Remove duplicate policies for crm_contacts (keep the _org_ versions)
DROP POLICY IF EXISTS "crm_contacts_delete" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_insert" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_select" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_update" ON public.crm_contacts;

-- Remove duplicate policies for deals (keep the _org_ versions)
DROP POLICY IF EXISTS "deals_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_select" ON public.deals;
DROP POLICY IF EXISTS "deals_update" ON public.deals;

-- Remove duplicate policies for enrichment_events (keep the _org_ versions)
DROP POLICY IF EXISTS "enrichment_events_delete" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_insert" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_select" ON public.enrichment_events;
DROP POLICY IF EXISTS "enrichment_events_update" ON public.enrichment_events;

-- Remove duplicate policies for audit_logs (keep the _org_ versions)
DROP POLICY IF EXISTS "audit_logs_delete_org_delete_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_org_insert_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_org_select_org" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_update_org_update_org" ON public.audit_logs;

-- Remove unnecessary policies for unused/admin-only tables
DROP POLICY IF EXISTS "deal_attachments_org_delete" ON public.deal_attachments;
DROP POLICY IF EXISTS "deal_attachments_org_insert" ON public.deal_attachments;
DROP POLICY IF EXISTS "deal_attachments_org_select" ON public.deal_attachments;
DROP POLICY IF EXISTS "deal_attachments_org_update" ON public.deal_attachments;

-- Remove conflicting email campaign policies (keep the simpler ones)
DROP POLICY IF EXISTS "User can manage own email campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Admin can manage all email campaigns" ON public.email_campaigns;

-- Remove conflicting email integration policies  
DROP POLICY IF EXISTS "User can manage own email integrations" ON public.email_integrations;
DROP POLICY IF EXISTS "Admin can manage all email integrations" ON public.email_integrations;

-- Remove unnecessary admin email activity policies
DROP POLICY IF EXISTS "Admin can view all email activity" ON public.email_activity;

-- Keep essential policies and fix the current_org_id() issue by updating remaining policies
-- Fix crm_contacts policies to use auth.uid()
DROP POLICY IF EXISTS "crm_contacts_delete_org_delete_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_insert_org_insert_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_select_org_select_org" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_update_org_update_org" ON public.crm_contacts;

CREATE POLICY "crm_contacts_user_access" ON public.crm_contacts
  FOR ALL USING (org_id = auth.uid());

-- Fix deals policies to use auth.uid()
DROP POLICY IF EXISTS "deals_org_delete" ON public.deals;
DROP POLICY IF EXISTS "deals_org_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_org_select" ON public.deals;
DROP POLICY IF EXISTS "deals_org_update" ON public.deals;

CREATE POLICY "deals_user_access" ON public.deals
  FOR ALL USING (org_id = auth.uid());

-- Fix activities policies to use auth.uid()
DROP POLICY IF EXISTS "activities_org_delete" ON public.activities;
DROP POLICY IF EXISTS "activities_org_insert" ON public.activities;
DROP POLICY IF EXISTS "activities_org_select" ON public.activities;
DROP POLICY IF EXISTS "activities_org_update" ON public.activities;

CREATE POLICY "activities_user_access" ON public.activities
  FOR ALL USING (org_id = auth.uid());
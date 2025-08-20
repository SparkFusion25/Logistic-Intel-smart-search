-- Add missing RLS policies for tables without any policies to prevent future issues

-- Affiliate tables - only authenticated users can access
CREATE POLICY "Authenticated users manage affiliate links" ON public.affiliate_links 
FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users manage affiliate payouts" ON public.affiliate_payouts 
FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users manage affiliate promo codes" ON public.affiliate_promo_codes 
FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users manage affiliate referrals" ON public.affiliate_referrals 
FOR ALL USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users manage affiliates" ON public.affiliates 
FOR ALL USING (auth.role() = 'authenticated'::text);

-- Audit logs - service role only
CREATE POLICY "Service role can manage audit logs" ON public.audit_logs 
FOR ALL USING (auth.role() = 'service_role'::text);

-- Campaign related tables - users manage their own data
CREATE POLICY "Users manage their campaign contacts" ON public.campaign_contacts 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage their campaign follow ups" ON public.campaign_follow_ups 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage their campaign steps" ON public.campaign_steps 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage their campaign targets" ON public.campaign_targets 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Contacts table - users manage their own
CREATE POLICY "Users manage their contacts" ON public.contacts 
FOR ALL USING (org_id = auth.uid());

-- Email templates - users manage their own
CREATE POLICY "Users manage their email templates" ON public.email_templates 
FOR ALL USING (user_id = auth.uid());

-- Enrichment queue - service role and users
CREATE POLICY "Service role can manage enrichment queue" ON public.enrichment_queue 
FOR ALL USING (auth.role() = 'service_role'::text);

CREATE POLICY "Users can view their enrichment queue" ON public.enrichment_queue 
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Follow up tables - users manage their own
CREATE POLICY "Users manage follow up executions" ON public.follow_up_executions 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage follow up rules" ON public.follow_up_rules 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage follow up steps" ON public.follow_up_steps 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Import tables - users manage their own
CREATE POLICY "Users manage their import contacts" ON public.import_contacts 
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage their import crm contacts" ON public.import_crm_contacts 
FOR ALL USING (auth.uid() IS NOT NULL);
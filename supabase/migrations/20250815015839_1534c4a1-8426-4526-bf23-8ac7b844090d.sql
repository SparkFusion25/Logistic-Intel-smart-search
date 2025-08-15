-- Enable RLS on existing tables that don't have it
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airfreight_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airfreight_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_city_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bts_route_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_trade_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_alias_resolver ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enrichment_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_crm_contacts ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for public readable data
CREATE POLICY "airfreight_insights_select" ON public.airfreight_insights FOR SELECT USING (true);
CREATE POLICY "airfreight_shipments_select" ON public.airfreight_shipments FOR SELECT USING (true);
CREATE POLICY "airport_city_mapping_select" ON public.airport_city_mapping FOR SELECT USING (true);
CREATE POLICY "bts_route_matches_select" ON public.bts_route_matches FOR SELECT USING (true);
CREATE POLICY "census_trade_data_select" ON public.census_trade_data FOR SELECT USING (true);
CREATE POLICY "companies_select" ON public.companies FOR SELECT USING (true);
CREATE POLICY "company_alias_resolver_select" ON public.company_alias_resolver FOR SELECT USING (true);
CREATE POLICY "company_profiles_select" ON public.company_profiles FOR SELECT USING (true);

-- Restrictive policies for user-specific or admin-only data
CREATE POLICY "affiliate_links_admin_only" ON public.affiliate_links FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "affiliates_admin_only" ON public.affiliates FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "contact_enrichment_cache_select" ON public.contact_enrichment_cache FOR SELECT USING (true);

CREATE POLICY "contacts_admin_only" ON public.contacts FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "crm_contacts_staging_admin_only" ON public.crm_contacts_staging FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "email_templates_user_access" ON public.email_templates FOR ALL 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "enrichment_queue_admin_only" ON public.enrichment_queue FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "follow_up_executions_admin_only" ON public.follow_up_executions FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "follow_up_rules_user_access" ON public.follow_up_rules FOR ALL 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "follow_up_steps_admin_only" ON public.follow_up_steps FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "import_companies_admin_only" ON public.import_companies FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "import_contacts_admin_only" ON public.import_contacts FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "import_crm_contacts_admin_only" ON public.import_crm_contacts FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));

CREATE POLICY "campaign_contacts_org_access" ON public.campaign_contacts FOR ALL 
  USING (auth.uid() IN (SELECT u.id FROM public.users u 
    JOIN public.campaigns c ON c.org_id = u.org_id 
    WHERE c.id = campaign_contacts.campaign_id));

CREATE POLICY "campaign_follow_ups_admin_only" ON public.campaign_follow_ups FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true));
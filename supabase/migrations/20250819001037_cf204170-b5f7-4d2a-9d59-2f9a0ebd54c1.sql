-- Phase 1: Relax company name validation function
CREATE OR REPLACE FUNCTION public.is_valid_company_name(company_name text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Much more flexible validation for sparse Panjiva data
  -- Only reject completely empty/null values or obvious placeholders
  
  IF company_name IS NULL OR LENGTH(TRIM(company_name)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Allow single character names (common in trade data)
  IF LENGTH(TRIM(company_name)) >= 1 THEN
    -- Only reject very obvious AI placeholders - accept most variations
    IF LOWER(TRIM(company_name)) IN (
      'null', 'n/a', 'na', 'none', 'unknown company', 'not available', 
      'tbd', 'pending', 'missing', 'unnamed', 'placeholder',
      'company name', 'company_name', 'companyname', 'default company'
    ) THEN
      RETURN FALSE;
    END IF;
    
    -- Accept everything else including:
    -- - Short names (2+ chars)
    -- - AI fallback values like 'UNKNOWN', 'Unknown'
    -- - Single letter company codes
    -- - Numbers and special characters
    -- - Foreign company names
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$function$;

-- Phase 2: Fix search path for all functions to address linter warnings
CREATE OR REPLACE FUNCTION public.get_user_plan()
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  select public.get_user_plan(auth.uid());
$function$;

CREATE OR REPLACE FUNCTION public.get_user_plan(p_uid uuid)
RETURNS text
LANGUAGE sql
STABLE 
SET search_path TO 'public'
AS $function$
  select coalesce(
    (select plan from public.user_profiles where id = p_uid),
    'trial'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and lower(up.role) = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_uid(p_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = p_uid AND lower(u.raw_user_meta_data->>'role')='admin'
  ) OR EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = p_uid AND lower(up.role)='admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT u.org_id FROM public.users u WHERE u.id = auth.uid()
$function$;

-- Phase 3: Update queue enrichment trigger to be more flexible
CREATE OR REPLACE FUNCTION public.queue_invalid_company_for_enrichment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only queue obviously invalid names for enrichment, accept more variations
  IF NEW.unified_company_name IS NOT NULL AND 
     LENGTH(TRIM(NEW.unified_company_name)) > 0 AND
     NOT public.is_valid_company_name(NEW.unified_company_name) THEN
    
    -- Insert into pending enrichment records (with conflict handling)
    INSERT INTO pending_enrichment_records (
      org_id,
      company_name,
      original_data,
      status,
      created_at
    ) VALUES (
      NEW.org_id,
      NEW.unified_company_name,
      jsonb_build_object(
        'hs_code', NEW.hs_code,
        'origin_country', NEW.origin_country,
        'destination_country', NEW.destination_country,
        'destination_city', NEW.destination_city,
        'destination_state', NEW.destination_state,
        'port_of_loading', NEW.port_of_loading,
        'port_of_discharge', NEW.port_of_discharge,
        'commodity_description', NEW.commodity_description,
        'shipper_name', NEW.shipper_name,
        'consignee_name', NEW.consignee_name,
        'mode', NEW.mode,
        'unified_date', NEW.unified_date,
        'unified_value', NEW.unified_value
      ),
      'pending',
      now()
    ) ON CONFLICT (org_id, company_name) DO UPDATE SET
      original_data = pending_enrichment_records.original_data || EXCLUDED.original_data,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Phase 4: Add missing RLS policies for tables without them
-- Add policies for campaign_targets table
CREATE POLICY "Users manage their campaign targets" 
ON public.campaign_targets 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Add policies for campaigns table
CREATE POLICY "campaigns_org_access" 
ON public.campaigns 
FOR ALL 
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());

-- Add policies for company_profiles table  
CREATE POLICY "company_profiles_org_access"
ON public.company_profiles
FOR ALL
USING (org_id = auth.uid())
WITH CHECK (org_id = auth.uid());

-- Phase 5: Fix plan enforcement functions to set search_path
CREATE OR REPLACE FUNCTION public.enforce_campaign_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := NEW.user_id;
  v_plan text;
  v_is_admin boolean;
  v_limit int;
  v_count int;
  v_trial int := 2;   -- trial limit
  v_starter int := 5;
  v_pro int := 50;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Campaign insert blocked: user_id is required';
  END IF;

  v_is_admin := public.is_admin_uid(v_user);
  IF v_is_admin THEN
    RETURN NEW;
  END IF;

  v_plan := public.get_user_plan(v_user);

  -- Trial expiry check
  IF v_plan = 'trial' AND public.is_trial_expired(v_user) THEN
    RAISE EXCEPTION 'Your 7-day trial has expired. Please upgrade.';
  END IF;

  v_limit := public.plan_campaign_limit(v_plan, v_trial, v_starter, v_pro);

  IF v_limit IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM public.email_campaigns ec
  WHERE ec.user_id = v_user
    AND COALESCE(LOWER(ec.status), 'draft') IN ('draft','active');

  IF v_count >= v_limit THEN
    RAISE EXCEPTION 'Campaign limit reached for plan % (limit=%). Please upgrade.', v_plan, v_limit;
  END IF;

  RETURN NEW;
END;
$function$;
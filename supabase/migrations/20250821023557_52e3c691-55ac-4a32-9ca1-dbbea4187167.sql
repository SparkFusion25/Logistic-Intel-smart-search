-- Phase 1: Update bulk_imports table to support XLSX and add AI processing status
ALTER TABLE public.bulk_imports 
ADD COLUMN IF NOT EXISTS ai_processing_status text DEFAULT 'pending' CHECK (ai_processing_status IN ('pending', 'ai_processing', 'ai_completed', 'ai_failed'));

-- Add index for better performance on AI processing queries
CREATE INDEX IF NOT EXISTS idx_bulk_imports_ai_status ON public.bulk_imports(ai_processing_status) WHERE ai_processing_status != 'pending';

-- Phase 2: Create data migration function to consolidate ocean + airfreight data
CREATE OR REPLACE FUNCTION public.migrate_legacy_shipments()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  ocean_count int := 0;
  air_count int := 0;
  company_count int := 0;
BEGIN
  -- Clear existing sparse unified_shipments records
  DELETE FROM public.unified_shipments 
  WHERE unified_company_name IS NULL 
     OR unified_company_name = '' 
     OR mode IS NULL;

  -- Migrate ocean shipments
  INSERT INTO public.unified_shipments (
    org_id,
    unified_company_name,
    mode,
    hs_code,
    origin_country,
    destination_country,
    destination_city,
    destination_state,
    port_of_loading,
    port_of_discharge,
    unified_carrier,
    unified_date,
    commodity_description,
    bol_number,
    vessel_name,
    gross_weight_kg,
    value_usd,
    container_count,
    shipper_name,
    consignee_name,
    created_at
  )
  SELECT 
    'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid as org_id,
    COALESCE(
      NULLIF(TRIM(shipper_name), ''),
      NULLIF(TRIM(consignee_name), ''),
      'Unknown Company'
    ) as unified_company_name,
    'ocean' as mode,
    NULLIF(TRIM(hs_code), '') as hs_code,
    NULLIF(TRIM(shipper_country), '') as origin_country,
    NULLIF(TRIM(consignee_country), '') as destination_country,
    NULLIF(TRIM(consignee_city), '') as destination_city,
    NULLIF(TRIM(consignee_state), '') as destination_state,
    NULLIF(TRIM(port_of_lading), '') as port_of_loading,
    NULLIF(TRIM(destination_port), '') as port_of_discharge,
    NULLIF(TRIM(carrier_name), '') as unified_carrier,
    COALESCE(arrival_date, shipment_date) as unified_date,
    NULLIF(TRIM(COALESCE(description, commodity_description, goods_description)), '') as commodity_description,
    NULLIF(TRIM(COALESCE(bol_number, bill_of_lading_number)), '') as bol_number,
    NULLIF(TRIM(vessel_name), '') as vessel_name,
    weight_kg as gross_weight_kg,
    value_usd,
    container_count,
    NULLIF(TRIM(shipper_name), '') as shipper_name,
    NULLIF(TRIM(consignee_name), '') as consignee_name,
    COALESCE(created_at, NOW()) as created_at
  FROM public.ocean_shipments
  WHERE (shipper_name IS NOT NULL AND TRIM(shipper_name) != '') 
     OR (consignee_name IS NOT NULL AND TRIM(consignee_name) != '');

  GET DIAGNOSTICS ocean_count = ROW_COUNT;

  -- Migrate airfreight shipments  
  INSERT INTO public.unified_shipments (
    org_id,
    unified_company_name,
    mode,
    hs_code,
    origin_country,
    destination_country,
    destination_city,
    destination_state,
    port_of_loading,
    port_of_discharge,
    unified_carrier,
    unified_date,
    commodity_description,
    bol_number,
    vessel_name,
    gross_weight_kg,
    value_usd,
    container_count,
    shipper_name,
    consignee_name,
    created_at
  )
  SELECT 
    'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid as org_id,
    COALESCE(
      NULLIF(TRIM(shipper_name), ''),
      NULLIF(TRIM(consignee_name), ''),
      'Unknown Company'
    ) as unified_company_name,
    'air' as mode,
    NULLIF(TRIM(hs_code), '') as hs_code,
    NULLIF(TRIM(shipper_country), '') as origin_country,
    NULLIF(TRIM(consignee_country), '') as destination_country,
    NULLIF(TRIM(consignee_city), '') as destination_city,
    NULLIF(TRIM(consignee_state_region), '') as destination_state,
    NULLIF(TRIM(port_of_lading_name), '') as port_of_loading,
    NULLIF(TRIM(port_of_unlading_name), '') as port_of_discharge,
    NULLIF(TRIM(carrier_name), '') as unified_carrier,
    COALESCE(arrival_date, shipment_date, departure_date) as unified_date,
    NULLIF(TRIM(COALESCE(description, commodity_description, goods_shipped)), '') as commodity_description,
    NULLIF(TRIM(COALESCE(bol_number, master_bol_number, house_bol_number)), '') as bol_number,
    NULLIF(TRIM(vessel), '') as vessel_name,
    weight_kg as gross_weight_kg,
    value_usd,
    container_count,
    NULLIF(TRIM(shipper_name), '') as shipper_name,
    NULLIF(TRIM(consignee_name), '') as consignee_name,
    COALESCE(created_at, NOW()) as created_at
  FROM public.airfreight_shipments
  WHERE (shipper_name IS NOT NULL AND TRIM(shipper_name) != '') 
     OR (consignee_name IS NOT NULL AND TRIM(consignee_name) != '');

  GET DIAGNOSTICS air_count = ROW_COUNT;

  -- Update companies table with basic shipment counts
  INSERT INTO public.companies (
    company_name,
    total_shipments,
    air_match,
    ocean_match,
    last_activity,
    created_at,
    updated_at
  )
  SELECT 
    us.unified_company_name,
    COUNT(*) as total_shipments,
    bool_or(us.mode = 'air') as air_match,
    bool_or(us.mode = 'ocean') as ocean_match,
    MAX(us.unified_date) as last_activity,
    NOW() as created_at,
    NOW() as updated_at
  FROM public.unified_shipments us
  WHERE us.unified_company_name IS NOT NULL 
    AND us.unified_company_name != ''
    AND us.unified_company_name != 'Unknown Company'
  GROUP BY us.unified_company_name
  ON CONFLICT (company_name) DO UPDATE SET
    total_shipments = companies.total_shipments + EXCLUDED.total_shipments,
    air_match = companies.air_match OR EXCLUDED.air_match,
    ocean_match = companies.ocean_match OR EXCLUDED.ocean_match,
    last_activity = GREATEST(companies.last_activity, EXCLUDED.last_activity),
    updated_at = NOW();

  GET DIAGNOSTICS company_count = ROW_COUNT;

  RAISE NOTICE 'Migration completed: % ocean shipments, % air shipments, % companies processed', ocean_count, air_count, company_count;
END;
$$;

-- Phase 3: Create AI company processing function
CREATE OR REPLACE FUNCTION public.process_companies_with_ai(p_import_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  companies_to_process text[];
  company_name text;
BEGIN
  -- Get distinct company names from recent import or all if no import_id
  IF p_import_id IS NOT NULL THEN
    SELECT array_agg(DISTINCT unified_company_name) INTO companies_to_process
    FROM public.unified_shipments us
    JOIN public.bulk_imports bi ON bi.id = p_import_id
    WHERE us.created_at >= bi.created_at
      AND us.unified_company_name IS NOT NULL
      AND us.unified_company_name != ''
      AND us.unified_company_name != 'Unknown Company';
  ELSE
    SELECT array_agg(DISTINCT unified_company_name) INTO companies_to_process
    FROM public.unified_shipments
    WHERE unified_company_name IS NOT NULL
      AND unified_company_name != ''
      AND unified_company_name != 'Unknown Company';
  END IF;

  -- Update status to ai_processing
  IF p_import_id IS NOT NULL THEN
    UPDATE public.bulk_imports 
    SET ai_processing_status = 'ai_processing'
    WHERE id = p_import_id;
  END IF;

  -- Log that AI processing would start here
  -- Note: Actual OpenAI integration will be handled by Edge Function
  RAISE NOTICE 'AI processing queued for % companies from import %', 
    array_length(companies_to_process, 1), p_import_id;

  -- Create AI processing queue entries (placeholder for now)
  -- This will be replaced with actual Edge Function calls
  
END;
$$;
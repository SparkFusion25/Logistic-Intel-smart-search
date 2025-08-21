-- Phase 1: Complete Data Cleanup
-- Clear all corrupted unified_shipments data
DELETE FROM public.unified_shipments WHERE TRUE;

-- Reset companies table (keep the structure but clear data generated from corrupted shipments)
DELETE FROM public.companies WHERE TRUE;

-- Phase 2: Fix the migrate_legacy_shipments() function
CREATE OR REPLACE FUNCTION public.migrate_legacy_shipments()
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  ocean_count int := 0;
  air_count int := 0;
  company_count int := 0;
BEGIN
  -- Clear existing unified_shipments records to start fresh
  DELETE FROM public.unified_shipments WHERE TRUE;

  -- Migrate ocean shipments with corrected company name extraction and mode setting
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
    -- Prioritize consignee_name (importer) for ocean shipments, fallback to shipper_name
    COALESCE(
      CASE WHEN TRIM(COALESCE(consignee_name, '')) != '' AND TRIM(COALESCE(consignee_name, '')) IS NOT NULL 
           THEN TRIM(consignee_name) END,
      CASE WHEN TRIM(COALESCE(shipper_name, '')) != '' AND TRIM(COALESCE(shipper_name, '')) IS NOT NULL 
           THEN TRIM(shipper_name) END,
      'Unknown Company'
    ) as unified_company_name,
    'ocean' as mode, -- FIXED: Set correct mode for ocean shipments
    NULLIF(TRIM(COALESCE(hs_code, '')), '') as hs_code,
    NULLIF(TRIM(COALESCE(shipper_country, '')), '') as origin_country,
    NULLIF(TRIM(COALESCE(consignee_country, '')), '') as destination_country,
    NULLIF(TRIM(COALESCE(consignee_city, '')), '') as destination_city,
    NULLIF(TRIM(COALESCE(consignee_state, '')), '') as destination_state,
    NULLIF(TRIM(COALESCE(port_of_lading, '')), '') as port_of_loading,
    NULLIF(TRIM(COALESCE(destination_port, '')), '') as port_of_discharge,
    NULLIF(TRIM(COALESCE(carrier_name, '')), '') as unified_carrier,
    COALESCE(arrival_date, shipment_date) as unified_date,
    NULLIF(TRIM(COALESCE(description, commodity_description, goods_description, '')), '') as commodity_description,
    NULLIF(TRIM(COALESCE(bol_number, bill_of_lading_number, '')), '') as bol_number,
    NULLIF(TRIM(COALESCE(vessel_name, '')), '') as vessel_name,
    weight_kg as gross_weight_kg,
    value_usd,
    container_count,
    NULLIF(TRIM(COALESCE(shipper_name, '')), '') as shipper_name,
    NULLIF(TRIM(COALESCE(consignee_name, '')), '') as consignee_name,
    COALESCE(created_at, NOW()) as created_at
  FROM public.ocean_shipments
  WHERE (TRIM(COALESCE(consignee_name, '')) != '' AND consignee_name IS NOT NULL) 
     OR (TRIM(COALESCE(shipper_name, '')) != '' AND shipper_name IS NOT NULL);

  GET DIAGNOSTICS ocean_count = ROW_COUNT;

  -- Migrate airfreight shipments with enhanced company name extraction (if any exist)
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
    -- For air shipments, prioritize shipper_name, fallback to consignee_name
    COALESCE(
      CASE WHEN TRIM(COALESCE(shipper_name, '')) != '' AND TRIM(COALESCE(shipper_name, '')) IS NOT NULL 
           THEN TRIM(shipper_name) END,
      CASE WHEN TRIM(COALESCE(consignee_name, '')) != '' AND TRIM(COALESCE(consignee_name, '')) IS NOT NULL 
           THEN TRIM(consignee_name) END,
      'Unknown Company'
    ) as unified_company_name,
    'air' as mode, -- Correct mode for air shipments
    NULLIF(TRIM(COALESCE(hs_code, '')), '') as hs_code,
    NULLIF(TRIM(COALESCE(shipper_country, '')), '') as origin_country,
    NULLIF(TRIM(COALESCE(consignee_country, '')), '') as destination_country,
    NULLIF(TRIM(COALESCE(consignee_city, '')), '') as destination_city,
    NULLIF(TRIM(COALESCE(consignee_state_region, '')), '') as destination_state,
    NULLIF(TRIM(COALESCE(port_of_lading_name, '')), '') as port_of_loading,
    NULLIF(TRIM(COALESCE(port_of_unlading_name, '')), '') as port_of_discharge,
    NULLIF(TRIM(COALESCE(carrier_name, '')), '') as unified_carrier,
    COALESCE(arrival_date, shipment_date, departure_date) as unified_date,
    NULLIF(TRIM(COALESCE(description, commodity_description, goods_shipped, '')), '') as commodity_description,
    NULLIF(TRIM(COALESCE(bol_number, master_bol_number, house_bol_number, '')), '') as bol_number,
    NULLIF(TRIM(COALESCE(vessel, '')), '') as vessel_name,
    weight_kg as gross_weight_kg,
    value_usd,
    container_count,
    NULLIF(TRIM(COALESCE(shipper_name, '')), '') as shipper_name,
    NULLIF(TRIM(COALESCE(consignee_name, '')), '') as consignee_name,
    COALESCE(created_at, NOW()) as created_at
  FROM public.airfreight_shipments
  WHERE (TRIM(COALESCE(shipper_name, '')) != '' AND shipper_name IS NOT NULL) 
     OR (TRIM(COALESCE(consignee_name, '')) != '' AND consignee_name IS NOT NULL);

  GET DIAGNOSTICS air_count = ROW_COUNT;

  -- Update companies table with extracted company data from clean unified shipments
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
    AND public.is_valid_company_name(us.unified_company_name)
  GROUP BY us.unified_company_name
  ON CONFLICT (company_name) DO UPDATE SET
    total_shipments = companies.total_shipments + EXCLUDED.total_shipments,
    air_match = companies.air_match OR EXCLUDED.air_match,
    ocean_match = companies.ocean_match OR EXCLUDED.ocean_match,
    last_activity = GREATEST(companies.last_activity, EXCLUDED.last_activity),
    updated_at = NOW();

  GET DIAGNOSTICS company_count = ROW_COUNT;

  RAISE NOTICE 'Clean migration completed: % ocean shipments, % air shipments, % companies processed', ocean_count, air_count, company_count;
END;
$function$;
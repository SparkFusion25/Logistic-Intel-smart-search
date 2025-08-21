-- Enhanced migration function to properly extract company names from ocean shipments
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
  DELETE FROM public.unified_shipments;

  -- Migrate ocean shipments with enhanced company name extraction
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
      CASE WHEN TRIM(consignee_name) != '' AND TRIM(consignee_name) IS NOT NULL 
           THEN TRIM(consignee_name) END,
      CASE WHEN TRIM(shipper_name) != '' AND TRIM(shipper_name) IS NOT NULL 
           THEN TRIM(shipper_name) END,
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
  WHERE (TRIM(consignee_name) != '' AND consignee_name IS NOT NULL) 
     OR (TRIM(shipper_name) != '' AND shipper_name IS NOT NULL);

  GET DIAGNOSTICS ocean_count = ROW_COUNT;

  -- Migrate airfreight shipments with enhanced company name extraction
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
      CASE WHEN TRIM(shipper_name) != '' AND TRIM(shipper_name) IS NOT NULL 
           THEN TRIM(shipper_name) END,
      CASE WHEN TRIM(consignee_name) != '' AND TRIM(consignee_name) IS NOT NULL 
           THEN TRIM(consignee_name) END,
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
  WHERE (TRIM(shipper_name) != '' AND shipper_name IS NOT NULL) 
     OR (TRIM(consignee_name) != '' AND consignee_name IS NOT NULL);

  GET DIAGNOSTICS air_count = ROW_COUNT;

  -- Update companies table with extracted company data
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

  RAISE NOTICE 'Enhanced migration completed: % ocean shipments, % air shipments, % companies processed', ocean_count, air_count, company_count;
END;
$function$;
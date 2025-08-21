-- Phase 2: Create company aggregation function and populate company_trade_profiles
CREATE OR REPLACE FUNCTION public.aggregate_company_trade_data()
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  processed_count int := 0;
BEGIN
  -- Clear existing aggregated data
  DELETE FROM public.company_trade_profiles;
  
  -- Aggregate shipment data by company
  INSERT INTO public.company_trade_profiles (
    org_id,
    company_name,
    total_shipments,
    total_ocean_shipments,
    total_air_shipments,
    last_shipment_date,
    first_shipment_date,
    total_trade_value_usd,
    avg_shipment_value_usd,
    top_origin_countries,
    top_destination_countries,
    top_commodities,
    created_at,
    updated_at
  )
  SELECT 
    us.org_id,
    us.unified_company_name as company_name,
    COUNT(*) as total_shipments,
    COUNT(*) FILTER (WHERE LOWER(us.mode) = 'ocean') as total_ocean_shipments,
    COUNT(*) FILTER (WHERE LOWER(us.mode) = 'air') as total_air_shipments,
    MAX(us.unified_date) as last_shipment_date,
    MIN(us.unified_date) as first_shipment_date,
    COALESCE(SUM(us.value_usd), 0) as total_trade_value_usd,
    COALESCE(AVG(us.value_usd), 0) as avg_shipment_value_usd,
    -- Top 3 origin countries as array
    ARRAY(
      SELECT o.origin_country 
      FROM (
        SELECT us2.origin_country, COUNT(*) as cnt
        FROM public.unified_shipments us2 
        WHERE us2.unified_company_name = us.unified_company_name
          AND us2.origin_country IS NOT NULL
        GROUP BY us2.origin_country
        ORDER BY cnt DESC
        LIMIT 3
      ) o
    ) as top_origin_countries,
    -- Top 3 destination countries as array  
    ARRAY(
      SELECT d.destination_country
      FROM (
        SELECT us3.destination_country, COUNT(*) as cnt
        FROM public.unified_shipments us3
        WHERE us3.unified_company_name = us.unified_company_name
          AND us3.destination_country IS NOT NULL
        GROUP BY us3.destination_country  
        ORDER BY cnt DESC
        LIMIT 3
      ) d
    ) as top_destination_countries,
    -- Top 3 commodities as array
    ARRAY(
      SELECT c.description
      FROM (
        SELECT us4.description, COUNT(*) as cnt
        FROM public.unified_shipments us4
        WHERE us4.unified_company_name = us.unified_company_name
          AND us4.description IS NOT NULL
          AND LENGTH(TRIM(us4.description)) > 3
        GROUP BY us4.description
        ORDER BY cnt DESC
        LIMIT 3
      ) c
    ) as top_commodities,
    NOW() as created_at,
    NOW() as updated_at
  FROM public.unified_shipments us
  WHERE us.unified_company_name IS NOT NULL 
    AND us.unified_company_name != ''
    AND us.unified_company_name != 'Unknown Company'
    AND public.is_valid_company_name(us.unified_company_name)
  GROUP BY us.org_id, us.unified_company_name
  HAVING COUNT(*) > 0;

  GET DIAGNOSTICS processed_count = ROW_COUNT;
  
  -- Update companies table as well
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
    ctp.company_name,
    ctp.total_shipments,
    (ctp.total_air_shipments > 0) as air_match,
    (ctp.total_ocean_shipments > 0) as ocean_match,
    ctp.last_shipment_date as last_activity,
    NOW() as created_at,
    NOW() as updated_at
  FROM public.company_trade_profiles ctp
  ON CONFLICT (company_name) DO UPDATE SET
    total_shipments = EXCLUDED.total_shipments,
    air_match = EXCLUDED.air_match,
    ocean_match = EXCLUDED.ocean_match,
    last_activity = EXCLUDED.last_activity,
    updated_at = NOW();

  RAISE NOTICE 'Company aggregation completed: % trade profiles created', processed_count;
END;
$function$;
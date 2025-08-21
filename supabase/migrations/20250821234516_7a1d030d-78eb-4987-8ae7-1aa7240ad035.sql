-- Run aggregation function to populate company_trade_profiles
SELECT public.aggregate_company_trade_data();

-- Create company_search_view for enhanced search
CREATE OR REPLACE VIEW public.company_search_view AS
SELECT 
  ctp.id as company_id,
  ctp.company_name,
  ctp.total_shipments as shipments_count,
  ctp.total_ocean_shipments,
  ctp.total_air_shipments,
  ctp.last_shipment_date,
  ctp.total_trade_value_usd,
  ctp.avg_shipment_value_usd,
  ctp.top_origin_countries,
  ctp.top_destination_countries as dest_countries,
  ctp.top_commodities,
  -- Derive modes array from shipment counts
  CASE 
    WHEN ctp.total_ocean_shipments > 0 AND ctp.total_air_shipments > 0 
    THEN ARRAY['ocean', 'air']
    WHEN ctp.total_ocean_shipments > 0 
    THEN ARRAY['ocean']
    WHEN ctp.total_air_shipments > 0 
    THEN ARRAY['air']
    ELSE ARRAY[]::text[]
  END as modes,
  -- Get company details from companies table if available
  c.website,
  c.country,
  c.industry,
  -- Contact count would be calculated from crm_contacts
  0 as contacts_count
FROM public.company_trade_profiles ctp
LEFT JOIN public.companies c ON c.company_name = ctp.company_name
WHERE ctp.total_shipments > 0
ORDER BY ctp.total_shipments DESC;
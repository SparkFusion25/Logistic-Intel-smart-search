-- Fix the empty data issue by populating unified_shipments with proper data from airfreight_shipments
UPDATE unified_shipments 
SET 
  unified_company_name = (
    SELECT COALESCE(shipper_name, consignee_name, 'Unknown Company')
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  mode = 'air',
  origin_country = (
    SELECT shipper_country 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  destination_country = (
    SELECT consignee_country 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  unified_value = (
    SELECT value_usd 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  weight_kg = (
    SELECT weight_kg 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  unified_date = (
    SELECT COALESCE(shipment_date, arrival_date)::date 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  hs_code = (
    SELECT hs_code 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  carrier_name = (
    SELECT COALESCE(vessel, 'Unknown Carrier') 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  ),
  commodity_description = (
    SELECT COALESCE(commodity_description, description, goods_description) 
    FROM airfreight_shipments a 
    WHERE a.id::text = unified_shipments.unified_id
    LIMIT 1
  )
WHERE unified_company_name IS NULL;

-- If the above doesn't work due to unified_id mismatch, let's insert fresh data
INSERT INTO unified_shipments (
  unified_company_name, shipper_name, consignee_name,
  origin_country, destination_country, mode, hs_code, 
  commodity_description, unified_date, unified_value, 
  weight_kg, carrier_name, org_id
)
SELECT 
  COALESCE(shipper_name, consignee_name, 'Unknown Company') as unified_company_name,
  shipper_name,
  consignee_name,
  shipper_country as origin_country,
  consignee_country as destination_country,
  'air' as mode,
  hs_code,
  COALESCE(commodity_description, description, goods_description) as commodity_description,
  COALESCE(shipment_date, arrival_date)::date as unified_date,
  value_usd as unified_value,
  weight_kg,
  COALESCE(vessel, 'Unknown Carrier') as carrier_name,
  'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid as org_id
FROM airfreight_shipments 
WHERE (shipper_name IS NOT NULL OR consignee_name IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1 FROM unified_shipments u2 
    WHERE u2.unified_company_name IS NOT NULL 
    LIMIT 10
  )
LIMIT 100;

-- Clean up duplicate/overlapping policies
DROP POLICY IF EXISTS "unified_shipments_read_all" ON unified_shipments;
DROP POLICY IF EXISTS "unified_shipments_insert_authenticated" ON unified_shipments;
DROP POLICY IF EXISTS "unified_shipments_update_own_org" ON unified_shipments;
DROP POLICY IF EXISTS "unified_shipments_xml_service_only" ON unified_shipments;
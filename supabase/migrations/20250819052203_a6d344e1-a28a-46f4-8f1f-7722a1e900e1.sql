-- Remove all problematic NOT NULL constraints from unified_shipments table
ALTER TABLE public.unified_shipments 
ALTER COLUMN hs_code DROP NOT NULL,
ALTER COLUMN origin_country DROP NOT NULL,
ALTER COLUMN destination_country DROP NOT NULL,
ALTER COLUMN unified_company_name DROP NOT NULL,
ALTER COLUMN shipper_name DROP NOT NULL,
ALTER COLUMN consignee_name DROP NOT NULL,
ALTER COLUMN commodity_description DROP NOT NULL;
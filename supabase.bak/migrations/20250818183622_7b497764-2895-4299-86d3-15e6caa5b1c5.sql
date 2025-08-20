-- Add missing org_id field to unified_shipments table
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id);

-- Add missing fields for better Panjiva compatibility
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS consignee_name TEXT,
ADD COLUMN IF NOT EXISTS destination_state TEXT,
ADD COLUMN IF NOT EXISTS carrier_name TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER,
ADD COLUMN IF NOT EXISTS value_usd NUMERIC,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS shipment_date DATE,
ADD COLUMN IF NOT EXISTS arrival_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_unified_shipments_org_id ON public.unified_shipments(org_id);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_company ON public.unified_shipments(unified_company_name);
CREATE INDEX IF NOT EXISTS idx_unified_shipments_date ON public.unified_shipments(unified_date);

-- Enable RLS
ALTER TABLE public.unified_shipments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access their org shipments" ON public.unified_shipments
FOR ALL USING (org_id = auth.uid());

-- Allow service role full access for processing
CREATE POLICY "Service role full access" ON public.unified_shipments
FOR ALL USING (auth.role() = 'service_role');
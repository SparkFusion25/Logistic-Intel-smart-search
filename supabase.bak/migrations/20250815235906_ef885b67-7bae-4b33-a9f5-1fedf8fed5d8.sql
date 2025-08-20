-- Create market_benchmarks table for storing trade lane benchmark data
CREATE TABLE public.market_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  origin_country TEXT NOT NULL,
  origin_city TEXT,
  destination_country TEXT NOT NULL DEFAULT 'US',
  destination_city TEXT,
  transport_mode TEXT NOT NULL CHECK (transport_mode IN ('Ocean', 'Air', 'Domestic')),
  benchmark_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_import_value NUMERIC,
  yoy_change NUMERIC,
  avg_air_cost NUMERIC,
  avg_ocean_cost NUMERIC,
  avg_domestic_cost NUMERIC,
  fsc_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_benchmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for organization-scoped access
CREATE POLICY "market_benchmarks_select_org" 
ON public.market_benchmarks 
FOR SELECT 
USING (org_id = current_org_id());

CREATE POLICY "market_benchmarks_insert_org" 
ON public.market_benchmarks 
FOR INSERT 
WITH CHECK (org_id = current_org_id());

CREATE POLICY "market_benchmarks_update_org" 
ON public.market_benchmarks 
FOR UPDATE 
USING (org_id = current_org_id());

CREATE POLICY "market_benchmarks_delete_org" 
ON public.market_benchmarks 
FOR DELETE 
USING (org_id = current_org_id());

-- Create indexes for better query performance
CREATE INDEX idx_market_benchmarks_org_id ON public.market_benchmarks(org_id);
CREATE INDEX idx_market_benchmarks_trade_lane ON public.market_benchmarks(origin_country, destination_country, transport_mode);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_market_benchmarks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_market_benchmarks_updated_at
  BEFORE UPDATE ON public.market_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_market_benchmarks_updated_at();

-- Insert sample data for testing
INSERT INTO public.market_benchmarks (
  org_id, origin_country, origin_city, destination_country, transport_mode,
  benchmark_data, total_import_value, yoy_change, avg_ocean_cost, fsc_rate
) VALUES 
(
  'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid,
  'Germany', 'Hamburg', 'US', 'Ocean',
  '{"total_import_value": 45.8, "yoy_change": 12.5, "top_ports": ["Los Angeles", "Long Beach", "New York"]}'::jsonb,
  45.8, 12.5, 2850.00, 15.5
),
(
  'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid,
  'China', 'Shanghai', 'US', 'Ocean',
  '{"total_import_value": 128.3, "yoy_change": 8.2, "top_ports": ["Los Angeles", "Long Beach", "Seattle"]}'::jsonb,
  128.3, 8.2, 2650.00, 18.2
),
(
  'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid,
  'Germany', 'Frankfurt', 'US', 'Air',
  '{"total_import_value": 15.2, "yoy_change": 15.8, "top_ports": ["JFK", "LAX", "ORD"]}'::jsonb,
  15.2, 15.8, 4850.00, 22.1
);
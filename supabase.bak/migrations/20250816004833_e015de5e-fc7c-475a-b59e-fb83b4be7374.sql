-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',        -- draft|running|paused|completed
  channel TEXT NOT NULL DEFAULT 'email',       -- email|linkedin|hybrid
  audience JSONB NOT NULL DEFAULT '{}'::jsonb, -- filters: tags, country, title, etc.
  sequence JSONB NOT NULL DEFAULT '[]'::jsonb, -- ordered steps
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign queue (n8n/worker processes rows)
CREATE TABLE IF NOT EXISTS public.campaign_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  step_index INT NOT NULL DEFAULT 0,
  state TEXT NOT NULL DEFAULT 'pending',  -- pending|sent|error|skipped
  last_error TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  payload JSONB NOT NULL,
  pdf_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: cache tariffs (30d TTL)
CREATE TABLE IF NOT EXISTS public.tariff_cache (
  hs_code TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  provider TEXT NOT NULL,
  rate NUMERIC,
  payload JSONB,
  refreshed_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (hs_code, origin_country)
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
CREATE POLICY "Users can view their org campaigns" 
ON public.campaigns 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their org campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for campaign_queue
CREATE POLICY "Users can view their campaign queue" 
ON public.campaign_queue 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage campaign queue" 
ON public.campaign_queue 
FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for quotes
CREATE POLICY "Users can view their org quotes" 
ON public.quotes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for tariff_cache
CREATE POLICY "Anyone can read tariff cache" 
ON public.tariff_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage tariff cache" 
ON public.tariff_cache 
FOR ALL 
USING (auth.role() = 'service_role');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quotes', 'quotes', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quotes bucket
CREATE POLICY "Users can view their quotes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'quotes' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload quotes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'quotes' AND auth.uid() IS NOT NULL);

-- Storage policies for branding bucket
CREATE POLICY "Anyone can view branding files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'branding');

CREATE POLICY "Users can upload branding files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'branding' AND auth.uid() IS NOT NULL);
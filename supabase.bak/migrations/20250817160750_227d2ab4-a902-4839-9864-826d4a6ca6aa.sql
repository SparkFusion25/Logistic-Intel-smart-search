-- Create pipelines table for managing deal pipelines
CREATE TABLE IF NOT EXISTS public.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create pipeline_stages table for ordered columns in pipelines
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stage_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for pipeline stages ordering
CREATE INDEX IF NOT EXISTS pipeline_stages_pipeline_idx ON public.pipeline_stages(pipeline_id, stage_order);

-- Create deals table for deal-centric records
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.pipeline_stages(id) ON DELETE RESTRICT,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  company_name TEXT,
  title TEXT,
  value_usd NUMERIC,
  currency TEXT DEFAULT 'USD',
  expected_close_date DATE,
  status TEXT NOT NULL DEFAULT 'open',
  lost_reason TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for deals filtering
CREATE INDEX IF NOT EXISTS deals_org_pipeline_stage_idx ON public.deals(org_id, pipeline_id, stage_id, status);

-- Create deal_attachments table for quotes, docs, tariff snapshots
CREATE TABLE IF NOT EXISTS public.deal_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  url TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create activities table for calls, emails, meetings, follow-ups
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for activities due date filtering
CREATE INDEX IF NOT EXISTS activities_due_idx ON public.activities(org_id, due_at);

-- Enable RLS on all new tables
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pipelines
CREATE POLICY "pipelines_org_select" ON public.pipelines
FOR SELECT USING (org_id = current_org_id());

CREATE POLICY "pipelines_org_insert" ON public.pipelines
FOR INSERT WITH CHECK (org_id = current_org_id());

CREATE POLICY "pipelines_org_update" ON public.pipelines
FOR UPDATE USING (org_id = current_org_id()) WITH CHECK (org_id = current_org_id());

CREATE POLICY "pipelines_org_delete" ON public.pipelines
FOR DELETE USING (org_id = current_org_id());

-- Create RLS policies for pipeline_stages
CREATE POLICY "pipeline_stages_org_select" ON public.pipeline_stages
FOR SELECT USING (org_id = current_org_id());

CREATE POLICY "pipeline_stages_org_insert" ON public.pipeline_stages
FOR INSERT WITH CHECK (org_id = current_org_id());

CREATE POLICY "pipeline_stages_org_update" ON public.pipeline_stages
FOR UPDATE USING (org_id = current_org_id()) WITH CHECK (org_id = current_org_id());

CREATE POLICY "pipeline_stages_org_delete" ON public.pipeline_stages
FOR DELETE USING (org_id = current_org_id());

-- Create RLS policies for deals
CREATE POLICY "deals_org_select" ON public.deals
FOR SELECT USING (org_id = current_org_id());

CREATE POLICY "deals_org_insert" ON public.deals
FOR INSERT WITH CHECK (org_id = current_org_id());

CREATE POLICY "deals_org_update" ON public.deals
FOR UPDATE USING (org_id = current_org_id()) WITH CHECK (org_id = current_org_id());

CREATE POLICY "deals_org_delete" ON public.deals
FOR DELETE USING (org_id = current_org_id());

-- Create RLS policies for deal_attachments
CREATE POLICY "deal_attachments_org_select" ON public.deal_attachments
FOR SELECT USING (org_id = current_org_id());

CREATE POLICY "deal_attachments_org_insert" ON public.deal_attachments
FOR INSERT WITH CHECK (org_id = current_org_id());

CREATE POLICY "deal_attachments_org_update" ON public.deal_attachments
FOR UPDATE USING (org_id = current_org_id()) WITH CHECK (org_id = current_org_id());

CREATE POLICY "deal_attachments_org_delete" ON public.deal_attachments
FOR DELETE USING (org_id = current_org_id());

-- Create RLS policies for activities
CREATE POLICY "activities_org_select" ON public.activities
FOR SELECT USING (org_id = current_org_id());

CREATE POLICY "activities_org_insert" ON public.activities
FOR INSERT WITH CHECK (org_id = current_org_id());

CREATE POLICY "activities_org_update" ON public.activities
FOR UPDATE USING (org_id = current_org_id()) WITH CHECK (org_id = current_org_id());

CREATE POLICY "activities_org_delete" ON public.activities
FOR DELETE USING (org_id = current_org_id());

-- Seed default pipeline and stages for existing orgs
DO $$
DECLARE
    org_record RECORD;
    pipeline_id UUID;
    stage_names TEXT[] := ARRAY['Prospect Identified', 'Contacted', 'Engaged', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    stage_name TEXT;
    stage_order INT;
BEGIN
    -- Get all existing orgs (assuming they exist in a table - adjust query as needed)
    FOR org_record IN 
        SELECT DISTINCT org_id FROM public.crm_contacts WHERE org_id IS NOT NULL
        UNION
        SELECT id as org_id FROM public.user_profiles WHERE id IS NOT NULL
    LOOP
        -- Check if pipeline already exists for this org
        SELECT id INTO pipeline_id 
        FROM public.pipelines 
        WHERE org_id = org_record.org_id AND name = 'Default'
        LIMIT 1;
        
        -- Create default pipeline if it doesn't exist
        IF pipeline_id IS NULL THEN
            INSERT INTO public.pipelines (org_id, name)
            VALUES (org_record.org_id, 'Default')
            RETURNING id INTO pipeline_id;
        END IF;
        
        -- Create stages for this pipeline
        stage_order := 1;
        FOREACH stage_name IN ARRAY stage_names
        LOOP
            -- Check if stage already exists
            IF NOT EXISTS (
                SELECT 1 FROM public.pipeline_stages 
                WHERE org_id = org_record.org_id 
                AND pipeline_id = pipeline_id 
                AND name = stage_name
            ) THEN
                INSERT INTO public.pipeline_stages (org_id, pipeline_id, name, stage_order)
                VALUES (org_record.org_id, pipeline_id, stage_name, stage_order);
            END IF;
            stage_order := stage_order + 1;
        END LOOP;
    END LOOP;
END $$;
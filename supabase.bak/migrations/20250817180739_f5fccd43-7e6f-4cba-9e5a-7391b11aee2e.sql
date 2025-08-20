-- Create AI Sales Assistant tables for the comprehensive system

-- AI suggestions table for next best actions
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('deal', 'contact', 'campaign')),
  subject_id UUID,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('follow_up', 'schedule_call', 'advance_stage', 'attach_quote', 'share_tariff', 'send_email')),
  score INTEGER NOT NULL DEFAULT 0,
  confidence TEXT NOT NULL CHECK (confidence IN ('Low', 'Medium', 'High')),
  rationale TEXT NOT NULL,
  source_signals JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'applied', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead scores table for contact scoring
CREATE TABLE IF NOT EXISTS public.lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signals JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Deal scores table for opportunity scoring  
CREATE TABLE IF NOT EXISTS public.deal_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  deal_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signals JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email sends tracking table
CREATE TABLE IF NOT EXISTS public.email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  campaign_id UUID,
  contact_id UUID NOT NULL,
  deal_id UUID,
  subject TEXT,
  body TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tracking events for email interactions
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_send_id UUID NOT NULL REFERENCES public.email_sends(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN ('open', 'click', 'reply', 'bounce')),
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service role and authenticated users
-- AI suggestions policies
CREATE POLICY ai_suggestions_service_role ON public.ai_suggestions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY ai_suggestions_authenticated ON public.ai_suggestions FOR ALL TO authenticated USING (org_id = auth.uid()) WITH CHECK (org_id = auth.uid());

-- Lead scores policies  
CREATE POLICY lead_scores_service_role ON public.lead_scores FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY lead_scores_authenticated ON public.lead_scores FOR ALL TO authenticated USING (org_id = auth.uid()) WITH CHECK (org_id = auth.uid());

-- Deal scores policies
CREATE POLICY deal_scores_service_role ON public.deal_scores FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY deal_scores_authenticated ON public.deal_scores FOR ALL TO authenticated USING (org_id = auth.uid()) WITH CHECK (org_id = auth.uid());

-- Email sends policies
CREATE POLICY email_sends_service_role ON public.email_sends FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY email_sends_authenticated ON public.email_sends FOR ALL TO authenticated USING (org_id = auth.uid()) WITH CHECK (org_id = auth.uid());

-- Tracking events policies (inherit from email_sends)
CREATE POLICY tracking_events_service_role ON public.tracking_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY tracking_events_authenticated ON public.tracking_events FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.email_sends es WHERE es.id = email_send_id AND es.org_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.email_sends es WHERE es.id = email_send_id AND es.org_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_org_subject ON public.ai_suggestions(org_id, subject_type, subject_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON public.ai_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_lead_scores_org_contact ON public.lead_scores(org_id, contact_id);
CREATE INDEX IF NOT EXISTS idx_deal_scores_org_deal ON public.deal_scores(org_id, deal_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_org_contact ON public.email_sends(org_id, contact_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_email_send ON public.tracking_events(email_send_id);
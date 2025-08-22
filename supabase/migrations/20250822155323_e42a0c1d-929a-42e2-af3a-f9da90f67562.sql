-- Fix critical RLS security issues identified by the linter
-- Enable RLS on all public tables that are missing it

-- Enable RLS on critical tables that were missing it
ALTER TABLE public.airfreight_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_city_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bts_route_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_trade_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enrichment_cache ENABLE ROW LEVEL SECURITY;

-- Add basic policies for read-only data tables
CREATE POLICY "Public read access" ON public.airfreight_insights FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.airport_city_mapping FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.bts_route_matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.census_trade_data FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.contact_enrichment_cache FOR SELECT USING (true);

-- Update the create_user_profile_safe function to set search_path (security fix)
CREATE OR REPLACE FUNCTION public.create_user_profile_safe(
  user_id UUID,
  user_email TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update user profile safely using id as the user reference
  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    plan,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    'user',
    'trial',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN user_id;
END;
$$;
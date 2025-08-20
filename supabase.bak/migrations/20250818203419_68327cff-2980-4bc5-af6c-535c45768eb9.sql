-- Fix the refresh_company_profile function to use correct column names
CREATE OR REPLACE FUNCTION public.refresh_company_profile(p_company_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_air_cnt    int    := 0;
  v_ocean_cnt  int    := 0;
  v_bts_kg     numeric := 0;
  v_bts_score  int    := 0;
  v_air_score  int    := 0;
  v_ocean_score int   := 0;
BEGIN
  -- last 24 months activity by mode
  SELECT count(*) INTO v_air_cnt
    FROM public.unified_shipments
   WHERE unified_company_name ILIKE p_company_name
     AND mode='air'
     AND (unified_date IS NULL OR unified_date >= (CURRENT_DATE - INTERVAL '24 months')::date);

  SELECT count(*) INTO v_ocean_cnt
    FROM public.unified_shipments
   WHERE unified_company_name ILIKE p_company_name
     AND mode='ocean'
     AND (unified_date IS NULL OR unified_date >= (CURRENT_DATE - INTERVAL '24 months')::date);

  -- BTS freight mass → confidence (log‑scaled)
  SELECT COALESCE(SUM(freight_kg),0) INTO v_bts_kg
    FROM public.bts_route_matches
   WHERE company_name ILIKE p_company_name;

  v_bts_score  := LEAST(100, GREATEST(0, ROUND( (LN(1 + v_bts_kg)::numeric) * 20 )));
  -- simple heuristic v1 (can refine later)
  v_air_score   := LEAST(100, v_bts_score + v_air_cnt * 5);
  v_ocean_score := LEAST(100, v_ocean_cnt * 5);

  -- Fixed: Use company_name instead of name
  INSERT INTO public.companies (
    company_name, air_match, air_match_score, ocean_match, ocean_match_score,
    bts_confidence_score, last_refreshed
  ) VALUES (
    p_company_name, (v_air_cnt > 0), v_air_score, (v_ocean_cnt > 0), v_ocean_score,
    v_bts_score, NOW()
  )
  ON CONFLICT (company_name) DO UPDATE SET
    air_match            = EXCLUDED.air_match,
    air_match_score      = EXCLUDED.air_match_score,
    ocean_match          = EXCLUDED.ocean_match,
    ocean_match_score    = EXCLUDED.ocean_match_score,
    bts_confidence_score = EXCLUDED.bts_confidence_score,
    last_refreshed       = EXCLUDED.last_refreshed;
END$function$;
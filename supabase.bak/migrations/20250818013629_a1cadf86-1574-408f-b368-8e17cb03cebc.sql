-- Continue with deals and activities policies
-- Remove duplicate deals policies and fix them
DROP POLICY IF EXISTS "deals_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_select" ON public.deals;
DROP POLICY IF EXISTS "deals_update" ON public.deals;
DROP POLICY IF EXISTS "deals_org_delete" ON public.deals;
DROP POLICY IF EXISTS "deals_org_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_org_select" ON public.deals;
DROP POLICY IF EXISTS "deals_org_update" ON public.deals;

-- Create single working policy for deals
CREATE POLICY "deals_user_access" ON public.deals
  FOR ALL USING (org_id = auth.uid());
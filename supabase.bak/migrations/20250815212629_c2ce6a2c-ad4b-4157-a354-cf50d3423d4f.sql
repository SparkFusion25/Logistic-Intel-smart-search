-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_prefs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email boolean DEFAULT true,
  browser boolean DEFAULT false,
  mobile boolean DEFAULT false,
  weekly boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_notification_prefs ENABLE ROW LEVEL SECURITY;

-- Users can read/update ONLY their row
CREATE POLICY "unp_select_self" ON public.user_notification_prefs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "unp_upsert_self" ON public.user_notification_prefs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "unp_update_self" ON public.user_notification_prefs
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Browser Push subscriptions (per user; one row per device)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  keys jsonb NOT NULL,         -- {auth, p256dh}
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ps_select_self" ON public.push_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ps_insert_self" ON public.push_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "ps_delete_self" ON public.push_subscriptions
  FOR DELETE USING (user_id = auth.uid());
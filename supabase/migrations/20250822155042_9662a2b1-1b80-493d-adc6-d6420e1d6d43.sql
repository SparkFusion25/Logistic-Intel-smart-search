-- Fix authentication issues by removing problematic triggers on auth.users
-- and implementing a safer user profile creation pattern

-- Drop the problematic trigger that's interfering with auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a safer function that doesn't interfere with auth
CREATE OR REPLACE FUNCTION public.create_user_profile_safe(
  user_id UUID,
  user_email TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Insert or update user profile safely
  INSERT INTO public.user_profiles (
    id,
    user_id,
    email,
    role,
    plan,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    user_email,
    'user',
    'trial',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now()
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;

-- Ensure user_profiles table has correct structure
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for user_profiles to be safer
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role can manage profiles" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Clean up any orphaned data that might cause issues
DELETE FROM public.user_profiles WHERE user_id NOT IN (SELECT id FROM auth.users);
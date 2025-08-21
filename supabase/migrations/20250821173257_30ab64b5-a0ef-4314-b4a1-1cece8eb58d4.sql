-- Create the master admin user manually using auth.users
-- First check if user already exists
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'support@logisticintel.com';
    
    -- If user doesn't exist, we'll create a profile that can be linked later
    -- The actual user creation must be done via Supabase Auth API
    IF admin_user_id IS NULL THEN
        -- Create a placeholder profile that will be updated when user signs up
        INSERT INTO public.user_profiles (
            id,
            email,
            role,
            plan,
            created_at,
            updated_at
        ) VALUES (
            'bb997b6b-fa1a-46c8-9957-fabe835eee55'::uuid, -- Placeholder ID
            'support@logisticintel.com',
            'admin',
            'enterprise',
            NOW(),
            NOW()
        ) ON CONFLICT (email) DO UPDATE SET
            role = 'admin',
            plan = 'enterprise',
            updated_at = NOW();
            
        RAISE NOTICE 'Admin profile placeholder created. User must sign up via Supabase Auth.';
    ELSE
        -- User exists, ensure they have admin profile
        INSERT INTO public.user_profiles (
            id,
            email,
            role,
            plan,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
            'support@logisticintel.com',
            'admin',
            'enterprise',
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            plan = 'enterprise',
            updated_at = NOW();
            
        RAISE NOTICE 'Admin profile updated for existing user.';
    END IF;
END
$$;
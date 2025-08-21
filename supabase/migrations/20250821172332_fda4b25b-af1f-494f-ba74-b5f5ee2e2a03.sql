-- Create admin user directly in user_profiles table
-- Note: User will need to sign up normally first, then we'll update their profile to admin
DO $$
DECLARE
    user_exists boolean := false;
BEGIN
    -- Check if user profile already exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE email = 'support@logisticintel.com') INTO user_exists;
    
    -- Only insert if profile doesn't exist
    IF NOT user_exists THEN
        -- Create a placeholder admin profile that will be linked when user signs up
        INSERT INTO user_profiles (
            id,
            email,
            role,
            subscription_tier,
            plan,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'support@logisticintel.com',
            'admin'::user_role,
            'enterprise'::subscription_tier, 
            'enterprise',
            now(),
            now()
        );
        
        RAISE NOTICE 'Admin profile created for support@logisticintel.com - user must sign up with this email to activate';
    ELSE
        -- Update existing profile to admin
        UPDATE user_profiles 
        SET 
            role = 'admin'::user_role,
            subscription_tier = 'enterprise'::subscription_tier,
            plan = 'enterprise',
            updated_at = now()
        WHERE email = 'support@logisticintel.com';
        
        RAISE NOTICE 'Updated existing profile to admin for support@logisticintel.com';
    END IF;
END $$;
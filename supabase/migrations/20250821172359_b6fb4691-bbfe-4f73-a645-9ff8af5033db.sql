-- Create admin profile for support@logisticintel.com
DO $$
DECLARE
    user_exists boolean := false;
BEGIN
    -- Check if user profile already exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE email = 'support@logisticintel.com') INTO user_exists;
    
    -- Only insert if profile doesn't exist
    IF NOT user_exists THEN
        INSERT INTO user_profiles (
            id,
            email,
            role,
            plan,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'support@logisticintel.com',
            'admin'::user_role,
            'enterprise',
            now(),
            now()
        );
        
        RAISE NOTICE 'Admin profile created for support@logisticintel.com';
    ELSE
        -- Update existing profile to admin
        UPDATE user_profiles 
        SET 
            role = 'admin'::user_role,
            plan = 'enterprise',
            updated_at = now()
        WHERE email = 'support@logisticintel.com';
        
        RAISE NOTICE 'Updated existing profile to admin for support@logisticintel.com';
    END IF;
END $$;
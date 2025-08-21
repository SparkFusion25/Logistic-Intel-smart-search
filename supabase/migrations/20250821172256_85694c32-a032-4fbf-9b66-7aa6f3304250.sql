-- Create master admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'support@logisticintel.com',
  crypt('7354$$', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile for the master user
INSERT INTO user_profiles (
  id,
  email,
  role,
  subscription_tier,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  u.email,
  'admin'::user_role,
  'enterprise'::subscription_tier,
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'support@logisticintel.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin'::user_role,
  subscription_tier = 'enterprise'::subscription_tier;
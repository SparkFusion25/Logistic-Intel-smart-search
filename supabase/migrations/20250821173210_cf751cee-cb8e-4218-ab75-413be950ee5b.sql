-- Call the setup-admin function to create the master admin user
SELECT extensions.http_post(
  'https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/setup-admin',
  '{}',
  'application/json'
) as setup_result;
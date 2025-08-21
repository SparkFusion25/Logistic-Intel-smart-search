
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Use the direct values since they're already in the config
const url = 'https://zupuxlrtixhfnbuhxhum.supabase.co';
const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0';

export const supabaseBrowser = () => createClient<Database>(url, anon);

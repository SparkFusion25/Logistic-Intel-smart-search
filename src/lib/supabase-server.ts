import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zupuxlrtixhfnbuhxhum.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0';
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServer = () => createClient<Database>(url, anon, { auth: { persistSession: false } });

export const supabaseAdmin = () => {
  if (!service) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient<Database>(url, service, { auth: { persistSession: false } });
};
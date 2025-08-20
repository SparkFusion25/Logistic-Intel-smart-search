import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServer = () => createClient<Database>(url, anon, { auth: { persistSession: false } });

export const supabaseAdmin = () => {
  if (!service) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient<Database>(url, service, { auth: { persistSession: false } });
};
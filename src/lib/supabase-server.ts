import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY; // avoid unless required (e.g., server jobs)

// Default server client (anon) — respects RLS with auth via cookies if you wire it up in middleware
export const supabaseServer = () => createClient(url, anon, { auth: { persistSession: false } });

// Optional elevated client for internal server jobs (DO NOT expose to client)
export const supabaseAdmin = () => {
  if (!service) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, service, { auth: { persistSession: false } });
};
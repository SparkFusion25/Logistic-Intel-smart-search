// src/pages/api/search/countries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE || (ANON as string));
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase.rpc('distinct_countries');
    if (error) throw error;
    const countries = (data || []).map((r: any) => r.country).filter(Boolean);
    res.status(200).json({ success: true, countries });
  } catch (_e) {
    res.status(200).json({ success: true, countries: ['United States','China','Mexico','Germany','United Kingdom','India','Vietnam'] });
  }
}
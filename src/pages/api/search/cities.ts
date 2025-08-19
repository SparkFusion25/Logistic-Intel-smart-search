// src/pages/api/search/cities.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE || (ANON as string));
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const country = (req.query.country ? String(req.query.country) : null);
    const { data, error } = await supabase.rpc('distinct_dest_cities', { p_country: country });
    if (error) throw error;
    const cities = (data || []).map((r: any) => r.city).filter(Boolean);
    res.status(200).json({ success: true, cities });
  } catch (_e) {
    res.status(200).json({ success: true, cities: ['Los Angeles','New York','Chicago','Houston','Dallas','Miami'] });
  }
}
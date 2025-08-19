// src/pages/api/search/unified.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE || (ANON as string));

function parseBool(v: any): boolean | null { if (v == null) return null; const s = String(v).toLowerCase(); if (['1','true','t','yes','y'].includes(s)) return true; if (['0','false','f','no','n'].includes(s)) return false; return null; }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      q = null,
      mode = 'all',
      hs_code = null,
      origin_country = null,
      destination_country = null,
      destination_city = null,
      carrier = null,
      date_from = null,
      date_to = null,
      limit = '25',
      offset = '0'
    } = req.query;

    const p = {
      p_q: q ? String(q) : null,
      p_mode: String(mode) as 'all' | 'air' | 'ocean',
      p_date_from: date_from ? String(date_from) : null,
      p_date_to: date_to ? String(date_to) : null,
      p_hs_code: hs_code ? String(hs_code) : null,
      p_origin_country: origin_country ? String(origin_country) : null,
      p_destination_country: destination_country ? String(destination_country) : null,
      p_destination_city: destination_city ? String(destination_city) : null,
      p_carrier: carrier ? String(carrier) : null,
      p_limit: Number(limit ?? 25),
      p_offset: Number(offset ?? 0)
    };

    const { data, error } = await supabase.rpc('search_unified', p);
    if (error) throw error;

    const list = (data || []) as any[];
    const total = list.length ? Number(list[0]?.total_count ?? list.length) : 0;

    res.status(200).json({ success: true, data: list, total, summary: {}, pagination: { hasMore: (p.p_offset + list.length) < total } });
  } catch (e: any) {
    res.status(200).json({ success: false, error: e?.message || 'Search failed', data: [], total: 0, summary: {}, pagination: { hasMore: false } });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * Apollo enrichment (safe, no scraping)
 * Requires:
 *   APOLLO_API_KEY    (server)
 *   APOLLO_API_BASE   (optional, default https://api.apollo.io/v1)
 * Flow:
 *   - POST body: { company: string, domain?: string, titles?: string[] }
 *   - Calls Apollo people search (best-effort: org name or domain)
 *   - Upserts top matches into crm_contacts (email may be null if not provided)
 */
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const { company='', domain='', titles=[] } = req.body||{};
  const APOLLO_API_KEY = process.env.APOLLO_API_KEY||'';
  const APOLLO_API_BASE = process.env.APOLLO_API_BASE||'https://api.apollo.io/v1';
  if(!APOLLO_API_KEY) return res.status(400).json({success:false,error:'Missing APOLLO_API_KEY'});

  const url = `${APOLLO_API_BASE}/people/search`;
  const body:any = {
    q_organization_domains: domain || undefined,
    organization_name: domain ? undefined : company,
    per_page: 5,
    api_key: APOLLO_API_KEY, // some tenants require key in body
    title: (Array.isArray(titles) && titles.length) ? titles.join(' OR ') : undefined
  };

  let people:any[]=[];
  try{
    const r = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-Api-Key': APOLLO_API_KEY }, body: JSON.stringify(body) });
    const j = await r.json();
    people = (j?.people||[]).slice(0,5);
  }catch(e:any){ return res.status(200).json({success:true, inserted:0, people:[], note:'Apollo call failed (returned empty).'}); }

  const SUPABASE_URL=process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const SUPABASE_KEY=(process.env.SUPABASE_SERVICE_ROLE||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
  if(!SUPABASE_URL||!SUPABASE_KEY) return res.status(200).json({success:true, inserted:0, people, note:'Supabase env missing — returning people only'});
  const sb=createClient(SUPABASE_URL,SUPABASE_KEY);

  let inserted=0; for(const p of people){
    const payload={
      company_name: company,
      full_name: p?.name || [p?.first_name,p?.last_name].filter(Boolean).join(' ') || null,
      title: p?.title || null,
      email: p?.email || null,
      phone: p?.phone || null,
      source: 'apollo.io'
    };
    const { error } = await sb.from('crm_contacts').upsert(payload, { onConflict:'email,company_name', ignoreDuplicates:false });
    if(!error) inserted++;
  }
  return res.status(200).json({success:true, inserted, people});
}
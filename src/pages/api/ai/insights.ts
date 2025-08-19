// src/pages/api/ai/insights.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { aiComplete, safeJson } from '@/lib/ai';
import { linkedinCompanyGuess, linkedinPeopleSearch } from '@/lib/linkouts';

/**
 * Input: { company: string, enrichment?: { titles?: string[], departments?: string[] } }
 * Output: { linkedin_company_guess_url, linkedin_people_search_url, titles_used: string[] }
 * No scraping. We only produce *links/patterns* and optional titles derived from context.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const { company = '', enrichment = {} } = req.body || {};
  const co = String(company||'').trim();
  if(!co) return res.status(400).json({success:false,error:'Missing company'});

  // Ask AI to propose best titles to target given enrichment (safe: we don't output PII)
  const system = 'You are a B2B prospecting assistant. Return JSON: { titles: string[] } with 3-6 role titles for logistics/procurement/operations leaders. No PII, generic titles only.';
  const prompt = `Company: ${co}\nEnrichment: ${JSON.stringify({
    titles: enrichment?.titles || [],
    departments: enrichment?.departments || [],
  })}`;

  let titles: string[] = ['VP Logistics','Head of Supply Chain','Director of Procurement','Logistics Manager','Operations Manager'];
  try{
    const out = await aiComplete({ system, prompt, model: 'gpt-4.1-mini', max_tokens: 200 });
    const j = safeJson<{titles:string[]}>((out||''),{titles});
    if(Array.isArray(j.titles) && j.titles.length) titles = j.titles.slice(0,6);
  } catch {}

  const linkedin_company_guess_url = linkedinCompanyGuess(co);
  const linkedin_people_search_url = linkedinPeopleSearch(co, titles);

  return res.status(200).json({
    success: true,
    company: co,
    linkedin_company_guess_url,
    linkedin_people_search_url,
    titles_used: titles
  });
}
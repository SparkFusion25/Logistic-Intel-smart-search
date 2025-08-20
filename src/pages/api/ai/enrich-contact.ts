import type { NextApiRequest, NextApiResponse } from 'next';
import { aiComplete, safeJson } from '@/lib/ai';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const { company, role='logistics/procurement', context={} } = req.body||{};
    const system='Enrichment strategist. Return JSON { search_terms:string[], linkedin_title_patterns:string[], email_guess_pattern:string, opener:string } (generic patterns only).';
    const prompt=`Company: ${company}\nRole: ${role}\nContext: ${JSON.stringify(context)}`;
    const out=await aiComplete({system,prompt,model:'gpt-4.1-mini',max_tokens:380});
    const json=safeJson(out,{search_terms:[],linkedin_title_patterns:[],email_guess_pattern:'first.last@domain.com',opener:''});
    res.status(200).json({success:true,...json});
  }catch{res.status(200).json({success:true,search_terms:[],linkedin_title_patterns:[],email_guess_pattern:'first.last@domain.com',opener:''});}
}
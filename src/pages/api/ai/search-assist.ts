import type { NextApiRequest, NextApiResponse } from 'next';
import { aiComplete, safeJson } from '@/lib/ai';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const { q='', filters={}, lastResults=[] } = req.body||{};
    const system='Freight-intel copilot. Return pure JSON with keys: query_suggestions:string[], structured_filters:object (date_from,date_to,hs_code,origin_country,destination_country,destination_city,carrier,mode), natural_summary:string.';
    const trimmed=(lastResults||[]).slice(0,12).map((r:any)=>({company:r.unified_company_name,hs:r.hs_code,origin:r.origin_country,dest:r.destination_city||r.destination_country,carrier:r.unified_carrier}));
    const prompt=`User query: ${q}\nFilters: ${JSON.stringify(filters)}\nRecent: ${JSON.stringify(trimmed)}`;
    const out=await aiComplete({system,prompt,model:'gpt-4.1-mini'});
    const json=safeJson(out,{query_suggestions:[],structured_filters:{},natural_summary:''});
    res.status(200).json({success:true,...json});
  }catch(e:any){res.status(200).json({success:false,query_suggestions:[],structured_filters:{},natural_summary:''});}
}
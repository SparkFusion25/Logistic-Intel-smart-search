import type { NextApiRequest, NextApiResponse } from 'next';
import { aiComplete, safeJson } from '@/lib/ai';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const { company, shipments=[] } = req.body||{};
    const system='Write compact sales intel from provided shipments only. Return JSON { bullets:string[3-5], tags:string[], risk_notes:string[] }';
    const sample=(shipments||[]).slice(0,30).map((s:any)=>({date:s.unified_date,hs:s.hs_code,origin:s.origin_country,dest:s.destination_city||s.destination_country,carrier:s.unified_carrier,mode:s.mode}));
    const prompt=`Company: ${company}\nShipments: ${JSON.stringify(sample)}`;
    const out=await aiComplete({system,prompt,model:'gpt-4.1-mini',max_tokens:500});
    const json=safeJson(out,{bullets:[],tags:[],risk_notes:[]});
    res.status(200).json({success:true,...json});
  }catch{res.status(200).json({success:true,bullets:[],tags:[],risk_notes:[]});}
}
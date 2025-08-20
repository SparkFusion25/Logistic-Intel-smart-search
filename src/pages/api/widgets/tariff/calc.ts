import type { NextApiRequest, NextApiResponse } from 'next';

type Body={ hs_code?:string; origin_country?:string; destination_country?:string; mode?:'air'|'ocean'; incoterm?:'EXW'|'FOB'|'CIF'|'DAP'|'DDP'; customs_value?:number };

type Result={ duty_rate:number; est_duty:number; est_tax:number; est_total:number; notes:string[] };

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const b=(req.body||{}) as Body;
  const hs=(b.hs_code||'').replace(/\D/g,'');
  const value=Math.max(0,Number(b.customs_value||0));
  const mode=b.mode||'ocean';
  const incoterm=b.incoterm||'FOB';

  // If you have AVALARA/FLEXPORT keys, call them here (best-effort; omitted for brevity)
  // const AVALARA_API_KEY=process.env.AVALARA_API_KEY||'';
  // const FLEXPORT_API_KEY=process.env.FLEXPORT_API_KEY||'';

  // Heuristic baseline by HS chapter
  const chap=hs.slice(0,2);
  let rate=0.03; // default 3%
  if(chap==='85') rate=0.025; // electronics
  if(chap==='94') rate=0.04;  // furniture
  if(chap==='90') rate=0.02;  // instruments/medical
  if(chap==='39') rate=0.06;  // plastics
  if(chap==='73') rate=0.025; // iron/steel

  // Incoterm adjustments: if DDP, include an extra 1% for local taxes/fees placeholder
  const tax = value * 0.01 * (incoterm==='DDP'?1.5:1);
  const duty = value * rate;
  const total = duty + tax;

  const notes=[
    `HS ${hs||'unknown'} mapped to chapter ${chap||'—'} baseline ${(rate*100).toFixed(2)}%`,
    `Mode: ${mode}, Incoterm: ${incoterm}`,
    'This is a non-binding estimate; real duty/tax depends on final classification and country rules.'
  ];

  const out:Result={ duty_rate:rate, est_duty:duty, est_tax:tax, est_total:total, notes };
  return res.status(200).json(out);
}
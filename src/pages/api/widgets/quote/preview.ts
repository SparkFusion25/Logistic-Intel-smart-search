import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const f=req.body||{};
  const css=`body{background:#0b1220;color:#e5e7eb;font-family:ui-sans-serif,system-ui;}
  .card{border:1px solid #1f2937;background:rgba(255,255,255,0.04);border-radius:16px;padding:16px;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}
  .h{font-weight:600;margin-bottom:6px}
  .k{font-size:12px;opacity:.7}
  .v{font-weight:600}
  .pill{display:inline-block;border:1px solid #1f2937;background:rgba(255,255,255,.04);border-radius:9999px;padding:4px 10px;font-size:12px}
  .tot{font-size:18px;font-weight:700}`;
  const row=(k:string,v:any)=>`<div><div class='k'>${k}</div><div class='v'>${v??'—'}</div></div>`;

  const total = Number(f.price_usd||0)+Number(f.surcharges_usd||0);
  const html=`<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><title>Quote</title><style>${css}</style></head><body>
  <div style='max-width:900px;margin:24px auto'>
    <div style='display:flex;align-items:center;gap:10px;margin-bottom:12px'>
      <img src='/logo-icon.svg' width='28' height='28'/>
      <div class='h'>Quotation</div>
      <div style='flex:1'></div>
      <div class='pill'>Valid ${Number(f.validity_days||14)} days</div>
    </div>
    <div class='card grid'>
      ${row('Company',f.company)}
      ${row('Contact',f.contact||'')}
      ${row('Email',f.email||'')}
      ${row('Mode',f.mode)}
      ${row('Incoterm',f.incoterm)}
      ${row('Origin',f.origin)}
      ${row('Destination',f.destination)}
      ${row('Commodity',f.commodity||'')}
      ${row('Weight (kg)',f.weight_kg||'')}
      ${row('Volume (cbm)',f.volume_cbm||'')}
      ${row('Containers',f.containers||'')}
    </div>
    <div class='card grid'>
      ${row('Base price', `$${Number(f.price_usd||0).toFixed(2)}`)}
      ${row('Surcharges', `$${Number(f.surcharges_usd||0).toFixed(2)}`)}
      ${row('Total', `<span class='tot'>$${(total).toFixed(2)}</span>`)}
    </div>
    <div class='card'>
      <div class='k'>Notes</div>
      <div style='font-size:12px;opacity:.8'>Quoted subject to carrier availability, final dims/weight, and current fuel/bunker indexes. Local charges and duties/taxes not included unless specified.</div>
    </div>
  </div>
  <script>window.onload=()=>{try{window.focus()}catch(e){};};</script>
  </body></html>`;
  return res.status(200).json({html});
}
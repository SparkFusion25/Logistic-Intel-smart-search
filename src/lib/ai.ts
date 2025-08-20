export type AIModel='gpt-4.1-mini'|'gpt-4.1'|'gpt-4o-mini'|'gpt-4o';
const OPENAI_API_KEY=process.env.OPENAI_API_KEY||process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_BASE=process.env.OPENAI_BASE_URL||'https://api.openai.com/v1';
export type AIRequest={system?:string;prompt:string;model?:AIModel;max_tokens?:number;temperature?:number};
export async function aiComplete(req:AIRequest):Promise<string>{
  if(!OPENAI_API_KEY) return heuristic(req.prompt);
  try{
    const r=await fetch(`${OPENAI_BASE}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${OPENAI_API_KEY}`},body:JSON.stringify({model:req.model||'gpt-4.1-mini',messages:[req.system?{role:'system',content:req.system}:null,{role:'user',content:req.prompt}].filter(Boolean),max_tokens:req.max_tokens||400,temperature:req.temperature??0.2})});
    if(!r.ok) throw new Error(`OpenAI ${r.status}`); const j=await r.json(); return j.choices?.[0]?.message?.content?.trim?.()||'';
  }catch{ return heuristic(req.prompt); }
}
export function safeJson<T=unknown>(txt:string,fallback:T):T{try{return JSON.parse(txt) as T;}catch{return fallback;}}
function heuristic(prompt:string){
  if(/hs|harmonized|code/i.test(prompt)) return JSON.stringify({query_suggestions:['HS 850440 power supply','HS 940360 furniture','HS 901890 medical instruments'],structured_filters:{hs_code:'850440'},natural_summary:'Filtering by HS code 850440 likely improves relevance.'});
  if(/air|ocean|vessel|bol|b\/l/i.test(prompt)) return JSON.stringify({query_suggestions:['ocean shipments to Los Angeles','air carriers to ORD','vessel CMA CGM'],structured_filters:{mode:'ocean',destination_city:'Los Angeles'},natural_summary:'Focusing on ocean shipments to LA.'});
  return JSON.stringify({query_suggestions:['top importers of solar panels','exporters of furniture in Vietnam'],structured_filters:{},natural_summary:'General trade queries suggested.'});
}
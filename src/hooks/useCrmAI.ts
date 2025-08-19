import { useState } from 'react';
export function useCrmAI(){
  const [bullets,setBullets]=useState<string[]>([]);
  const [tags,setTags]=useState<string[]>([]);
  const [risk,setRisk]=useState<string[]>([]);
  const [enrich,setEnrich]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const summarize=async(company:string,shipments:any[])=>{ setLoading(true); try{ const r=await fetch('/api/ai/company-summarize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company,shipments})}); const j=await r.json(); setBullets(j.bullets||[]); setTags(j.tags||[]); setRisk(j.risk_notes||[]); } finally{ setLoading(false); } };
  const plan=async(company:string,role:string,context?:any)=>{ setLoading(true); try{ const r=await fetch('/api/ai/enrich-contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company,role,context})}); const j=await r.json(); setEnrich(j); } finally{ setLoading(false); } };
  return { bullets,tags,risk,enrich,loading,summarize,plan } as const;
}
export default useCrmAI;
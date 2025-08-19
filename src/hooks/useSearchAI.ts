import { useState } from 'react';
export function useSearchAI(){
  const [suggestions,setSuggestions]=useState<string[]>([]);
  const [structured,setStructured]=useState<any>({});
  const [summary,setSummary]=useState<string>('');
  const [loading,setLoading]=useState(false);
  const assist=async(q:string,filters:any,lastResults:any[])=>{ setLoading(true); try{ const r=await fetch('/api/ai/search-assist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q,filters,lastResults})}); const j=await r.json(); setSuggestions(j.query_suggestions||[]); setStructured(j.structured_filters||{}); setSummary(j.natural_summary||''); return j; } finally{ setLoading(false); } };
  return { suggestions,structured,summary,loading,assist } as const;
}
export default useSearchAI;
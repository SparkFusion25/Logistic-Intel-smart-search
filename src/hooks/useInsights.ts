// src/hooks/useInsights.ts
import { useState } from 'react';

export type PeopleNewsResult = {
  company: string;
  linkedin_company_guess_url: string;
  linkedin_people_search_url: string;
  titles_used: string[];
  news: { title: string; url: string; source?: string; published_at?: string; summary?: string }[];
  news_link_google: string;
  news_link_bing: string;
};

export function useInsights(){
  const [data,setData] = useState<PeopleNewsResult|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  const run = async (company: string, enrichment?: any) => {
    setLoading(true); setError(null);
    try{
      const ai = await fetch('/api/ai/insights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company,enrichment})}).then(r=>r.json());
      const news = await fetch('/api/news/suggest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company})}).then(r=>r.json());
      setData({
        company,
        linkedin_company_guess_url: ai.linkedin_company_guess_url,
        linkedin_people_search_url: ai.linkedin_people_search_url,
        titles_used: ai.titles_used || [],
        news: news.items || [],
        news_link_google: news.news_link_google,
        news_link_bing: news.news_link_bing,
      });
    }catch(e:any){ setError(e?.message||'Failed to load insights'); }
    finally{ setLoading(false); }
  };

  return { data, loading, error, run } as const;
}

export default useInsights;
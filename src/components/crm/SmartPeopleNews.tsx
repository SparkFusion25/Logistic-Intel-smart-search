// src/components/crm/SmartPeopleNews.tsx
import * as React from 'react';
import useInsights from '@/hooks/useInsights';

export default function SmartPeopleNews({ company, enrichment, className }:{ company: string; enrichment?: any; className?: string }){
  const { data, loading, error, run } = useInsights();
  React.useEffect(()=>{ if(company) run(company, enrichment); },[company]);

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className||''}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-300">Smart People & News</div>
        <button onClick={()=>run(company, enrichment)} className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10">{loading?'Updating…':'Refresh'}</button>
      </div>

      {error && <div className="mt-2 text-xs text-rose-300">{error}</div>}

      {!data && !loading && (
        <div className="mt-2 text-sm text-slate-300">No insights yet.</div>
      )}

      {data && (
        <div className="mt-3 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">LinkedIn</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="badge border-white/15 bg-white/5 hover:bg-white/10" href={data.linkedin_company_guess_url} target="_blank" rel="noreferrer">Company page (search)</a>
              <a className="badge border-white/15 bg-white/5 hover:bg-white/10" href={data.linkedin_people_search_url} target="_blank" rel="noreferrer">People search</a>
            </div>
            {data.titles_used?.length>0 && (
              <div className="mt-2 text-xs text-slate-300">Target titles: {data.titles_used.join(', ')}</div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Recent news</div>
            <div className="mt-2 space-y-2">
              {(data.news||[]).length===0 && (
                <div className="text-xs text-slate-400">No headlines API configured — use links below.</div>
              )}
              {(data.news||[]).map((n,i)=>(
                <a key={i} href={n.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
                  <div className="text-sm text-slate-100 line-clamp-2">{n.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{n.source || 'News'} {n.published_at? ' · ' + new Date(n.published_at).toLocaleDateString(): ''}</div>
                  {n.summary && <div className="text-xs text-slate-300 mt-1 line-clamp-2">{n.summary}</div>}
                </a>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <a className="badge border-white/15 bg-white/5 hover:bg-white/10" href={data.news_link_google} target="_blank" rel="noreferrer">Google News</a>
                <a className="badge border-white/15 bg-white/5 hover:bg-white/10" href={data.news_link_bing} target="_blank" rel="noreferrer">Bing News</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
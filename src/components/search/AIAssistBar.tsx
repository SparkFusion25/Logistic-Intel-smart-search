import * as React from 'react';
import useSearchAI from '@/hooks/useSearchAI';
export default function AIAssistBar({ q, filters, lastResults, onPickSuggestion, onApplyStructured }:{ q:string; filters:any; lastResults:any[]; onPickSuggestion:(s:string)=>void; onApplyStructured:(f:any)=>void; }){
  const { suggestions, structured, summary, loading, error, assist } = useSearchAI();
  return (
    <div className="rounded-xl sm:rounded-2xl border border-border bg-card/50 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
        <div className="text-sm text-muted-foreground font-medium">🤖 Smart AI Assistant</div>
        <button 
          onClick={()=>assist(q,filters,lastResults)} 
          className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs hover:bg-primary/20 transition-colors text-primary font-medium w-full sm:w-auto touch-manipulation min-h-[44px] flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-primary/50 border-t-primary rounded-full animate-spin" />
              Analyzing...
            </div>
          ) : 'Get AI Insights'}
        </button>
      </div>
        {error && (
          <div className="text-xs text-red-500 mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        {summary && <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/50 rounded-lg">{summary}</div>}
      <div className="flex flex-wrap gap-2">
        {(suggestions||[]).map((s,i)=>(
          <button 
            key={i} 
            onClick={()=>onPickSuggestion(s)} 
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-foreground hover:bg-muted transition-colors"
          >
            {s}
          </button>
        ))}
        {structured && Object.keys(structured).length>0 && (
          <button 
            onClick={()=>onApplyStructured(structured)} 
            className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary font-medium hover:bg-primary/20 transition-colors"
          >
            Apply AI Filters
          </button>
        )}
      </div>
    </div>
  );
}
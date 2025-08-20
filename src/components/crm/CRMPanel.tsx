import * as React from 'react';
import { supabase } from "@/integrations/supabase/client";
import ContactsTable from './ContactsTable';
import ContactDrawer from './ContactDrawer';

export default function CRMPanel(){
  const [rows,setRows]=React.useState<any[]>([]);
  const [loading,setLoading]=React.useState(false);
  const [open,setOpen]=React.useState(false);
  const [company,setCompany]=React.useState<string>('');
  const [shipments,setShipments]=React.useState<any[]>([]);

  const load=async()=>{
    setLoading(true);
    try{ 
      const { data, error } = await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data||[]);
    }
    finally{ setLoading(false); }
  };
  React.useEffect(()=>{load()},[]);

  const onRowClick=(r:any)=>{ setCompany(r.company_name||''); setShipments([]); setOpen(true); };

  const enrichViaApollo=async()=>{
    if(!company) return;
    try {
      const { error } = await supabase.functions.invoke('enrich-apollo', { 
        body: { company } 
      });
      if (error) throw error;
      await load();
    } catch(e) { console.error('Apollo enrichment failed:', e); }
  };
  const enrichFallback=async()=>{
    if(!company) return;
    try {
      const { error } = await supabase.functions.invoke('enrich-phantombuster', { 
        body: { company, titles: ["Head of Supply Chain","Director of Logistics","Procurement Manager"] } 
      });
      if (error) throw error;
    } catch(e) { console.error('PhantomBuster enrichment failed:', e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-card">
        <div className="text-sm text-muted-foreground font-medium">
          {loading?'Loading…':`${rows.length} contacts`}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={enrichViaApollo} 
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium shadow-sm transition-opacity"
          >
            Enrich via Apollo
          </button>
          <button 
            onClick={enrichFallback} 
            className="px-4 py-2 rounded-lg bg-muted border border-border hover:bg-accent text-sm font-medium transition-colors"
          >
            LinkedIn Fallback
          </button>
        </div>
      </div>
      <div onClickCapture={(e)=>{
        const row=(e.target as HTMLElement).closest('tr');
        if(row && (row as HTMLElement).dataset['rowIndex']){
          const idx=Number((row as HTMLElement).dataset['rowIndex']);
          onRowClick(rows[idx]);
        }
      }}>
        <div className="overflow-x-auto rounded-xl border border-border shadow-card bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {['Company','Name','Title','Email','Source'].map((h)=>(
                  <th key={h} className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length===0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No contacts yet — add from Search.
                  </td>
                </tr>
              )}
              {rows.map((r,i)=>(
                <tr 
                  key={i} 
                  data-row-index={i} 
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">{r.company_name||'—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{r.full_name||'—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{r.title||'—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{r.email||'—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{r.source||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ContactDrawer open={open} onClose={()=>setOpen(false)} company={company} shipments={shipments}/>
    </div>
  );
}
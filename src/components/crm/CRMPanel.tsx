import * as React from 'react';
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
    try{ const r=await fetch('/api/crm/contacts'); const j=await r.json(); setRows(j.contacts||[]); }
    finally{ setLoading(false); }
  };
  React.useEffect(()=>{load()},[]);

  const onRowClick=(r:any)=>{ setCompany(r.company_name||''); setShipments([]); setOpen(true); };

  const enrichViaApollo=async()=>{
    if(!company) return;
    await fetch('/api/enrichment/apollo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company})});
    await load();
  };
  const enrichFallback=async()=>{
    if(!company) return;
    await fetch('/api/enrichment/phantombuster',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company,titles:["Head of Supply Chain","Director of Logistics","Procurement Manager"]})});
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-80">{loading?'Loading…':`${rows.length} contacts`}</div>
        <div className="flex items-center gap-2">
          <button onClick={enrichViaApollo} className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm">Enrich via Apollo</button>
          <button onClick={enrichFallback} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm">LinkedIn Fallback</button>
        </div>
      </div>
      <div onClickCapture={(e)=>{
        const row=(e.target as HTMLElement).closest('tr');
        if(row && (row as HTMLElement).dataset['rowIndex']){
          const idx=Number((row as HTMLElement).dataset['rowIndex']);
          onRowClick(rows[idx]);
        }
      }}>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-300"><tr>
              {['Company','Name','Title','Email','Source'].map((h)=>(<th key={h} className="text-left px-3 py-2 font-medium">{h}</th>))}
            </tr></thead>
            <tbody>
              {rows.length===0 && (<tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No contacts yet — add from Search.</td></tr>)}
              {rows.map((r,i)=>(
                <tr key={i} data-row-index={i} className="odd:bg-slate-900/40 even:bg-slate-900/20 cursor-pointer hover:bg-white/5">
                  <td className="px-3 py-2 whitespace-nowrap">{r.company_name||''}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.full_name||''}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.title||''}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.email||''}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.source||''}</td>
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
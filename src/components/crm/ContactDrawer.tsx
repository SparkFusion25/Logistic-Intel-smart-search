import React from 'react';
import SmartEnrichmentPanel from './SmartEnrichmentPanel';
import SmartPeopleNews from './SmartPeopleNews';
export default function ContactDrawer({ open, onClose, company, shipments }:{ open:boolean; onClose:()=>void; company:string; shipments:any[] }){
  return (
    <div className={`fixed inset-0 z-40 ${open?'pointer-events-auto':'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open?'opacity-100':'opacity-0'}`} onClick={onClose}/>
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-slate-950 shadow-xl transition-transform ${open?'translate-x-0':'translate-x-full'}`}>
        <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{company||'Company'}</div>
          <button onClick={onClose} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">Close</button>
        </div>
        <div className="p-3 sm:p-4 space-y-3 overflow-y-auto">
          <SmartEnrichmentPanel company={company} shipments={shipments}/>
          <SmartPeopleNews company={company}/>
        </div>
      </aside>
    </div>
  );
}
import * as React from 'react';
import PlanGate, { type Plan } from '@/components/common/PlanGate';

type Contact = { full_name?:string|null; title?:string|null; email?:string|null; phone?:string|null; linkedin_url?:string|null; source?:string|null };
export default function EnrichedContactCard({ plan='pro', contact, className }:{ plan?:Plan; contact:Contact; className?:string }){
  const Row=({k,v}:{k:string;v:any})=> (<div className="flex items-center justify-between gap-2 text-sm"><div className="opacity-70">{k}</div><div className="font-medium truncate max-w-[60%]">{v||'—'}</div></div>);
  return (
    <PlanGate plan={plan} min="pro" className={className}>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
        <div className="text-sm font-semibold">Primary Contact</div>
        <Row k="Name" v={contact.full_name}/>
        <Row k="Title" v={contact.title}/>
        <Row k="Email" v={contact.email}/>
        <Row k="Phone" v={contact.phone}/>
        <div className="pt-1">
          {contact.linkedin_url ? (
            <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">LinkedIn Profile</a>
          ) : (
            <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-xl border border-white/10 bg-white/5">No LinkedIn found</span>
          )}
        </div>
        <div className="text-[11px] opacity-60">Source: {contact.source||'—'}</div>
      </div>
    </PlanGate>
  );
}
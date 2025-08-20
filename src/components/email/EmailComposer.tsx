import { useState } from 'react';
export default function EmailComposer(){
  const [subject,setSubject]=useState('');
  const [body,setBody]=useState('');
  const [sending,setSending]=useState(false);
  const [status,setStatus]=useState<string|null>(null);
  const onSend=async()=>{
    setSending(true); setStatus(null);
    try{ const r=await fetch('/api/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,bodyHtml:body})}); const j=await r.json(); setStatus(j.success? 'Sent (stub)':'Not configured'); }
    catch(e){ setStatus('Error'); }
    finally{ setSending(false); }
  };
  return (
    <div className="space-y-3">
      <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2 outline-none"/>
      <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Body (HTML or text)" rows={10} className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2 outline-none"/>
      <div className="flex gap-2">
        <button onClick={onSend} disabled={sending} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Send</button>
        {status && <span className="text-sm text-slate-400 self-center">{status}</span>}
      </div>
    </div>
  );
}
import { useState } from 'react';
export default function CampaignBuilder(){
  const [name,setName]=useState('New Campaign');
  const [steps,setSteps]=useState([{type:'email',subject:'Intro',body:'Hi {{first_name}}'}]);
  return (
    <div className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2"/>
      <div className="space-y-2">
        {steps.map((s,i)=> (
          <div key={i} className="rounded-xl border border-slate-800 p-3 bg-slate-900/40">
            <div className="text-xs text-slate-400">Step {i+1} • {s.type}</div>
            <input value={s.subject} onChange={e=>{const x=[...steps]; x[i]={...x[i],subject:e.target.value}; setSteps(x);}} className="mt-2 w-full rounded bg-slate-900/60 border border-slate-800 px-2 py-1 text-sm"/>
            <textarea value={s.body} onChange={e=>{const x=[...steps]; x[i]={...x[i],body:e.target.value}; setSteps(x);}} className="mt-2 w-full rounded bg-slate-900/60 border border-slate-800 px-2 py-1 text-sm" rows={4}/>
          </div>
        ))}
      </div>
      <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Save Draft</button>
    </div>
  );
}
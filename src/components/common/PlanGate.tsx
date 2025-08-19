import * as React from 'react';
import { cn } from '@/lib/utils';
export type Plan = 'free' | 'pro' | 'enterprise';
export default function PlanGate({ plan, min='pro', children, className, onUpgrade }:{ plan:Plan; min?:Plan; children:React.ReactNode; className?:string; onUpgrade?:()=>void; }){
  const order:{[k in Plan]:number}={free:0,pro:1,enterprise:2};
  const allowed = order[plan] >= order[min];
  if(allowed) return <div className={className}>{children}</div>;
  return (
    <div className={cn('relative rounded-2xl border border-white/10 bg-white/5 p-4', className)}>
      <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[2px]"/>
      <div className="relative text-center space-y-2">
        <div className="text-sm font-medium">🔒 Premium feature</div>
        <div className="text-xs opacity-80">Upgrade to unlock full contact details and enrichment.</div>
        <button onClick={onUpgrade} className="mt-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm">Upgrade</button>
      </div>
    </div>
  );
}
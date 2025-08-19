import React from 'react';
import {lower,s} from './strings';
export function Highlight({text,query}:{text?:string|null;query?:string|null}){
  const t=s(text); const q=s(query);
  if(!q) return <>{t}</>;
  const i=lower(t).indexOf(lower(q)); if(i===-1) return <>{t}</>;
  const pre=t.slice(0,i), mid=t.slice(i,i+q.length), post=t.slice(i+q.length);
  return (<>{pre}<mark className="bg-yellow-200/60 text-yellow-900 px-0.5 rounded-sm">{mid}</mark>{post}</>);
}
export default Highlight;
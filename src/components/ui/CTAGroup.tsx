import React from 'react'
type Btn={label:string,onClick?:()=>void,href?:string}
export default function CTAGroup({primary,secondary,tertiary}:{primary?:Btn;secondary?:Btn;tertiary?:Btn}){
  const B=(b?:Btn,cls?:string)=>b? b.href? <a href={b.href} className={`${cls} rounded-xl px-4 py-2`}>{b.label}</a> : <button onClick={b.onClick} className={`${cls} rounded-xl px-4 py-2`}>{b.label}</button> : null
  return <div className='flex gap-2 flex-wrap'>{B(primary,'cta-primary')}{B(secondary,'cta-secondary')}{B(tertiary,'cta-tertiary')}</div>
}
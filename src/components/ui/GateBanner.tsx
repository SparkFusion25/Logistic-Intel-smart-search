import React from 'react'
export default function GateBanner({title='Premium Contact Intelligence',copy='Unlock verified emails, LinkedIn & one‑click outreach.',children}:{title?:string;copy?:string;children?:React.ReactNode}){
  return (
    <div className='surface border border-divider/60 bg-panel p-4 flex items-start gap-3'>
      <span>🔒</span>
      <div>
        <div className='font-semibold'>{title}</div>
        <div className='text-muted text-sm'>{copy}</div>
        {children}
      </div>
    </div>
  )
}
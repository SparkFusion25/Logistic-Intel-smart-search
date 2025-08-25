export default function FilterChips({children}:{children:React.ReactNode}){
  return(
    <div className='sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-divider/60 py-2'>
      <div className='max-w-screen-xl mx-auto px-3 flex gap-2 overflow-x-auto'>{children}</div>
    </div>
  )
}
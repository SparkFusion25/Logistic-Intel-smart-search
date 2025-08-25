export default function StickyCTABar({label,onClick}:{label:string;onClick:()=>void}){
  return(
    <div className='fixed bottom-0 inset-x-0 z-40 md:hidden'>
      <div className='mx-auto max-w-screen-sm p-3'>
        <button onClick={onClick} className='w-full rounded-2xl bg-[#2F7BFF] text-white py-3 font-medium shadow-lg'>{label}</button>
      </div>
    </div>
  )
}
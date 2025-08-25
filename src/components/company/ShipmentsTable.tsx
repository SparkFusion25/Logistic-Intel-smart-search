type Row={date:string,mode:'air'|'ocean',shipper:string,hs:string,od:string,weight?:string,containers?:number,carrier?:string}
export default function ShipmentsTable({rows}:{rows:Row[]}){
  return(
    <div className='surface p-3'>
      <div className='hidden md:grid grid-cols-8 px-2 py-2 text-xs text-muted'>
        <div>Date</div><div>Mode</div><div>Shipper/Supplier</div><div>HS/Product</div><div>Origin→Dest</div><div>Cont./Wgt</div><div>Carrier</div><div>Actions</div>
      </div>
      <div className='divide-y'>
        {rows.map((r,i)=>(
          <div key={i} className='grid md:grid-cols-8 gap-2 p-2 items-center'>
            <div>{r.date}</div>
            <div>{r.mode==='air'?'✈':'🚢'}</div>
            <div>{r.shipper}</div>
            <div>{r.hs}</div>
            <div>{r.od}</div>
            <div>{r.containers??'—'}/{r.weight??'—'}</div>
            <div>{r.carrier??'—'}</div>
            <div className='flex gap-2'>
              <button className='rounded border px-2 py-1'>Add Contact</button>
              <button className='cta-secondary rounded px-2 py-1'>Quote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
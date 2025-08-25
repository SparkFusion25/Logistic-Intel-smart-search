type Tile={label:string,value:string|number,sub?:string}
export default function KpiTiles({items}:{items:Tile[]}){
  return <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
    {items.map((t,i)=>(
      <div className='kpi' key={i}>
        <div className='text-muted text-xs'>{t.label}</div>
        <div className='font-bold text-xl'>{t.value}</div>
        {t.sub && <div className='text-xs text-muted'>{t.sub}</div>}
      </div>
    ))}
  </div>
}
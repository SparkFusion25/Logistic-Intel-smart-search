type P={title:string,value:string|number,delta?:string}
export function KpiCard({title,value,delta}:P){
  return(
    <div className='kpi'>
      <div className='text-xs text-muted'>{title}</div>
      <div className='text-2xl font-bold'>{value}</div>
      {delta && <div className='text-xs text-teal mt-1'>{delta}</div>}
    </div>
  )
}
export default KpiCard
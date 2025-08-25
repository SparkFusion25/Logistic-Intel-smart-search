import CTAGroup from '@/components/ui/CTAGroup'
export default function CompanyHeader({name,location,onOutreach,onQuote,onAdd,onFeedback}:{name:string;location?:string;onOutreach:()=>void;onQuote:()=>void;onAdd:()=>void;onFeedback:()=>void;}){
  return(
    <div className='surface p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold'>{name}</h1>
        <div className='text-muted'>{location}</div>
        <div className='text-xs text-muted mt-1'>Live US Customs + BTS air routes</div>
      </div>
      <CTAGroup
        primary={{label:'Start Outreach',onClick:onOutreach}}
        secondary={{label:'Quote this Company',onClick:onQuote}}
        tertiary={{label:'Request Feedback',onClick:onFeedback}}
      />
    </div>
  )
}
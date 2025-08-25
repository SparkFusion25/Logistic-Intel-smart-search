export default function FeatureFlags(){
  return(
    <div className='surface p-4 space-y-2'>
      <h3 className='section-title'>Feature Flags</h3>
      <label className='flex items-center gap-2'><input type='checkbox'/> Enable BTS</label>
      <label className='flex items-center gap-2'><input type='checkbox'/> Enable Market Benchmarks</label>
    </div>
  )
}
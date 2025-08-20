import dynamic from 'next/dynamic';
import SiteShell from '@/components/layout/SiteShell';
const SearchPanel = dynamic(()=>import('@/components/search/SearchPanel'),{ ssr:false });
export default function SearchPage(){
  return (
    <SiteShell>
      <div className='flex items-center justify-between mb-3'>
        <h1 className='text-lg font-semibold'>Search Intelligence</h1>
      </div>
      <SearchPanel/>
    </SiteShell>
  );
}
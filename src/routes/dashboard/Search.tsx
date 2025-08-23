import SearchPanel from '@/components/search/SearchPanel';
import PageHeader from '@/ui/PageHeader';
import { CTAPrimary } from '@/ui/CTA';

export default function Search() {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <PageHeader 
          title="Search Intelligence" 
          actions={
            <CTAPrimary>Export Results</CTAPrimary>
          } 
        />
        
        {/* Search Interface */}
        <SearchPanel />
      </div>
    </div>
  );
}
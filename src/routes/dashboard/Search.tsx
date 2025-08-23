import SearchPanel from '@/components/search/SearchPanel';
import PageHeader from '@/ui/PageHeader';
import { CTAPrimary } from '@/ui/CTA';

export default function Search() {
  return (
    <div className="stack-gap">
      <PageHeader 
        title="Search Intelligence" 
        actions={
          <CTAPrimary>Export Results</CTAPrimary>
        } 
      />
      
      {/* Search Interface */}
      <SearchPanel />
    </div>
  );
}
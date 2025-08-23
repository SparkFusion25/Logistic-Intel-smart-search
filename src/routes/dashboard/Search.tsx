import SearchPanelWorking from '@/components/SearchPanelWorking';
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
      <SearchPanelWorking />
    </div>
  );
}
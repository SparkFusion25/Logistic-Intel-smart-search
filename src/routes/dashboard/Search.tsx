import { SearchIntelligence } from '@/components/dashboard/SearchIntelligence';
import GlossyCard from '@/ui/GlossyCard';
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
      <GlossyCard className="toolbar">
        <SearchIntelligence />
      </GlossyCard>
    </div>
  );
}
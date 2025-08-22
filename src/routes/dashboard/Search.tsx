import { SearchIntelligence } from '@/components/dashboard/SearchIntelligence';

export default function Search() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Search Intelligence</h1>
        <p className="text-muted-foreground">Find companies, analyze trade data, and discover opportunities</p>
      </div>
      <SearchIntelligence />
    </div>
  );
}
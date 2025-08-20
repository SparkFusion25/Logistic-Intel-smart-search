import { useState } from 'react';
import { Search, Plane, Ship } from 'lucide-react';
import { searchAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function QuickSearchCard() {
  const [company, setCompany] = useState('');
  const [origin, setOrigin] = useState('');
  const [region, setRegion] = useState('');
  const [mode, setMode] = useState<'air' | 'ocean'>('air');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!company.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter a company name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await searchAPI.search({
        company: company.trim(),
        origin: origin.trim() || undefined,
        region: region.trim() || undefined,
        mode,
        pageSize: 10
      });

      if (result.ok && result.data) {
        toast({
          title: "Search completed",
          description: `Found ${result.data.total} results for "${company}"`,
        });
        // Navigate to search results or show in modal
        // You could use router.push('/search') with state
      } else {
        throw new Error(result.error?.message || 'Search failed');
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glass p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Quick Search</h3>
          <p className="text-sm text-muted-foreground">Find trade data instantly</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter company name..."
            className="input-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Country/Port"
              className="input-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Region
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Destination"
              className="input-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Transport Mode
          </label>
          <div className="toggle-container">
            <button
              onClick={() => setMode('air')}
              className="toggle-item"
              data-active={mode === 'air'}
            >
              <Plane className="h-4 w-4 mr-2" />
              Air
            </button>
            <button
              onClick={() => setMode('ocean')}
              className="toggle-item"
              data-active={mode === 'ocean'}
            >
              <Ship className="h-4 w-4 mr-2" />
              Ocean
            </button>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Searching...
            </div>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, Ship } from 'lucide-react';

export function QuickSearchCard() {
  const [company, setCompany] = useState('');
  const [origin, setOrigin] = useState('');
  const [region, setRegion] = useState('');
  const [mode, setMode] = useState<'air' | 'ocean'>('air');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!company.trim()) {
      return;
    }

    // Build search params
    const params = new URLSearchParams();
    params.set('q', company.trim());
    params.set('mode', mode);
    if (origin.trim()) params.set('origin', origin.trim());
    if (region.trim()) params.set('destination', region.trim());

    // Navigate to search page with params
    navigate(`/dashboard/search?${params.toString()}`);
  };

  return (
    <div className="card-glass p-6 animate-fade-in-up border-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-3 font-medium transition
                     hover:bg-blue-700 hover:shadow-sm active:scale-[0.99]"
        >
          <Search className="h-4 w-4" />
          Search Now
        </button>
      </div>
    </div>
  );
}
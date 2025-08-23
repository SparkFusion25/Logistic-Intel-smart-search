import { useState } from 'react';
import { SimilarCompanies } from './SimilarCompanies';
import { SimilarCompaniesEnhanced } from './SimilarCompaniesEnhanced';
import SimilarCompaniesList from './SimilarCompaniesList';

// Mock data for demonstration
const mockCompanies = [
  {
    company_id: '550e8400-e29b-41d4-a716-446655440001',
    company_name: 'Global Trade Corp',
    score: 0.95,
    country: 'USA',
    hs6_code: '8708',
    id: '1',
    confidence_score: 95,
    trade_volume: 15000,
    trade_value: 2500000,
    last_seen: '2024-01-15'
  },
  {
    company_id: '550e8400-e29b-41d4-a716-446655440002',
    company_name: 'Pacific Logistics Ltd',
    score: 0.87,
    country: 'Japan',
    hs6_code: '8471',
    id: '2',
    confidence_score: 87,
    trade_volume: 8500,
    trade_value: 1800000,
    last_seen: '2024-01-12'
  },
  {
    company_id: '550e8400-e29b-41d4-a716-446655440003',
    company_name: 'European Import Solutions',
    score: 0.82,
    country: 'Germany',
    hs6_code: '8537',
    id: '3',
    confidence_score: 82,
    trade_volume: 12000,
    trade_value: 2100000,
    last_seen: '2024-01-10'
  }
];

export default function WatchlistDemo() {
  const [currentTab, setCurrentTab] = useState<'basic' | 'enhanced' | 'original'>('basic');

  // Transform for basic component
  const basicItems = mockCompanies.map(c => ({
    company_id: c.company_id,
    company_name: c.company_name,
    score: c.score
  }));

  // Transform for enhanced component
  const enhancedItems = mockCompanies.map(c => ({
    company_id: c.company_id,
    company_name: c.company_name,
    score: c.score,
    country: c.country,
    hs6_code: c.hs6_code
  }));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Watchlist Implementation Demo</h1>
        <p className="text-gray-600">Compare different approaches to the Similar Companies watchlist functionality</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Version
          </button>
          <button
            onClick={() => setCurrentTab('enhanced')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'enhanced'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Enhanced Version
          </button>
          <button
            onClick={() => setCurrentTab('original')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'original'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Original Complex Version
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border p-6">
        {currentTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic SimilarCompanies Component</h3>
              <p className="text-sm text-gray-600 mb-4">
                Simple implementation following the exact pattern provided. Uses alert() for notifications.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
{`// Single RPC function
export async function watchCompany(companyId: string) {
  const { data, error } = await supabase.rpc('add_company_to_watchlist', {
    p_company_id: companyId
  });
  if (error) throw error;
  return data; // { watchlist_id }
}`}
                </pre>
              </div>
            </div>
            <SimilarCompanies items={basicItems} />
          </div>
        )}

        {currentTab === 'enhanced' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Enhanced SimilarCompanies Component</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enhanced version with toast notifications, React Router integration, and better styling.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
{`// Same RPC function, enhanced UI
- React Router Link instead of <a> tags
- useToast() instead of alert()
- Better styling and hover states
- Additional company metadata display`}
                </pre>
              </div>
            </div>
            <SimilarCompaniesEnhanced items={enhancedItems} />
          </div>
        )}

        {currentTab === 'original' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original Complex Implementation</h3>
              <p className="text-sm text-gray-600 mb-4">
                The original complex implementation with multiple states, actions, and detailed UI components.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
{`// Multiple functions and complex state management
- Save, Watch, Add to CRM actions
- Individual loading states per action  
- Complex UI with trade stats and confidence scores
- Three-button layout with different CTAs`}
                </pre>
              </div>
            </div>
            <SimilarCompaniesList 
              limit={3} 
              useSimplified={false} 
              className="max-w-2xl"
            />
          </div>
        )}
      </div>

      {/* Benefits Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Basic Version Benefits</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Minimal code complexity</li>
            <li>• Single RPC function call</li>
            <li>• Easy to understand and maintain</li>
            <li>• Fast implementation</li>
            <li>• Clear error handling</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Enhanced Version Benefits</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Better user experience</li>
            <li>• Consistent with app design</li>
            <li>• Proper navigation</li>
            <li>• Toast notifications</li>
            <li>• Additional metadata display</li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">Original Version Features</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Multiple actions per company</li>
            <li>• Rich data display</li>
            <li>• Complex state management</li>
            <li>• Detailed trade information</li>
            <li>• CRM integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
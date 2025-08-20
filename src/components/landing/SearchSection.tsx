import { useState } from 'react';
import { Search, ArrowRight, Building, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const popularSearches = [
    'Walmart imports from China',
    'Apple supply chain',
    'Amazon logistics partners',
    'Tesla battery suppliers',
    'Nike manufacturing locations'
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Discover supply chains from industry giants
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search through millions of trade records to uncover the suppliers, customers, 
            and trade patterns of major companies worldwide.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company names, products, or trade routes..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <Button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl">
                Search Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Filter Options */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
                <select className="bg-transparent border-none outline-none text-gray-700 font-medium">
                  <option>All Industries</option>
                  <option>Electronics</option>
                  <option>Textiles</option>
                  <option>Machinery</option>
                  <option>Automotive</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <select className="bg-transparent border-none outline-none text-gray-700 font-medium">
                  <option>All Routes</option>
                  <option>China → USA</option>
                  <option>Germany → USA</option>
                  <option>India → EU</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <select className="bg-transparent border-none outline-none text-gray-700 font-medium">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                  <option>Last month</option>
                </select>
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Results Preview */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Results Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <span className="font-medium text-gray-900">Walmart Inc.</span>
                  <span className="text-gray-500 ml-2">• Electronics from China</span>
                </div>
                <span className="text-blue-600 font-semibold">2,847 shipments</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <span className="font-medium text-gray-900">Apple Inc.</span>
                  <span className="text-gray-500 ml-2">• Components from Taiwan</span>
                </div>
                <span className="text-blue-600 font-semibold">1,523 shipments</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <span className="font-medium text-gray-900">Amazon.com Inc.</span>
                  <span className="text-gray-500 ml-2">• Consumer goods from China</span>
                </div>
                <span className="text-blue-600 font-semibold">4,159 shipments</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
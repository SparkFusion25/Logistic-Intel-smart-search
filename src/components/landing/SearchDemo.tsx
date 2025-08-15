import { useState } from 'react'
import { Search, Filter, TrendingUp, MapPin, Ship, Package, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const SearchDemo = () => {
  const [activeTab, setActiveTab] = useState('ocean')
  const [searchQuery, setSearchQuery] = useState('')

  const mockData = {
    ocean: [
      {
        id: 1,
        company: "Global Logistics Corp",
        route: "Shanghai → Los Angeles",
        commodity: "Electronics",
        volume: "2,450 TEU",
        trend: "+15%",
        frequency: "Weekly"
      },
      {
        id: 2,
        company: "Maritime Solutions Ltd",
        route: "Rotterdam → New York", 
        commodity: "Automotive Parts",
        volume: "1,850 TEU",
        trend: "+8%",
        frequency: "Bi-weekly"
      },
      {
        id: 3,
        company: "Ocean Connect Inc",
        route: "Hamburg → Miami",
        commodity: "Machinery",
        volume: "920 TEU", 
        trend: "-3%",
        frequency: "Monthly"
      }
    ],
    air: [
      {
        id: 1,
        company: "AirCargo Express",
        route: "Frankfurt → Chicago",
        commodity: "Pharmaceuticals",
        volume: "145 tons",
        trend: "+22%",
        frequency: "Daily"
      },
      {
        id: 2,
        company: "Sky Freight Pro",
        route: "Tokyo → Seattle",
        commodity: "Electronics",
        volume: "89 tons",
        trend: "+12%",
        frequency: "3x weekly"
      }
    ]
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            See Trade Intelligence
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of real-time trade data. Search through millions of shipment records 
            and discover market opportunities instantly.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-xl">
          {/* Search Interface */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search companies, routes, or commodities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
              </div>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-bold hover:from-primary/90 hover:to-accent/90 transition-all duration-300 flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'ocean', label: 'Ocean Freight', icon: Ship },
                { id: 'air', label: 'Air Cargo', icon: Package }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                {mockData[activeTab as keyof typeof mockData].length} shipments found
              </h3>
              <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                Filter Results
              </button>
            </div>

            {mockData[activeTab as keyof typeof mockData].map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-primary/20 group"
              >
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-foreground text-lg mb-1">{item.company}</h4>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.route}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Commodity</p>
                    <p className="font-semibold text-foreground">{item.commodity}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="font-semibold text-foreground">{item.volume}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-emerald-600" />
                      <span className={`font-semibold ${
                        item.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Frequency</p>
                      <p className="font-semibold text-foreground">{item.frequency}</p>
                    </div>
                    <button className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors group-hover:bg-primary group-hover:text-white">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-8 p-6 bg-white rounded-xl border-2 border-dashed border-primary/30">
            <p className="text-muted-foreground mb-4">
              This is just a preview. Get access to 50M+ real trade records.
            </p>
            <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 rounded-lg font-bold hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
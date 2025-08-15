import { useState } from 'react'
import { Search, Users, TrendingUp, FileText, BarChart3, Package, ArrowRight, Play, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Container from "@/components/ui/Container"

export const PlatformShowcase = () => {
  const [activeTab, setActiveTab] = useState('search')

  const tabs = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 }
  ]

  const features = [
    'Real-time shipment tracking across all modes',
    'Advanced filtering by HS codes, routes, and time periods',
    'Export capabilities for further analysis',
    'API access for seamless integration'
  ]

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to dominate global trade
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            From intelligent search to contact discovery and market analysis—all in one powerful platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Advanced Search */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Advanced Search</h3>
                <p className="text-muted-foreground">Find any company's shipping activity</p>
              </div>
            </div>

            {/* Search Interface */}
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-4">Search Query</div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <div className="text-lg font-mono">
                  <span className="text-blue-300">Electronics</span>
                  <span className="text-slate-300"> → </span>
                  <span className="text-green-300">China</span>
                  <span className="text-slate-300"> to → </span>
                  <span className="text-yellow-300">USA</span>
                  <span className="text-slate-300"> ⌄ </span>
                  <span className="text-purple-300">Last 30 days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Results Found</div>
                  <div className="text-xl font-bold">2,847 shipments</div>
                </div>
                <div>
                  <div className="text-slate-400">Key Exporter</div>
                  <div className="text-xl font-bold">TechCorp Solutions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Key Features */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">Key Features</h3>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold rounded-xl">
                Start searching now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <button className="w-full flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-foreground transition-colors">
                <Play className="w-5 h-5" />
                Watch demo
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
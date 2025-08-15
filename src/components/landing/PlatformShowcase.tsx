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

  const getTabContent = () => {
    switch (activeTab) {
      case 'search':
        return {
          title: 'Advanced Search',
          subtitle: 'Find any company\'s shipping activity',
          icon: Package,
          searchQuery: 'Electronics → China to → USA ⌄ Last 30 days',
          results: '2,847 shipments',
          topResult: 'TechCorp Solutions',
          features: [
            'Real-time shipment tracking across all modes',
            'Advanced filtering by HS codes, routes, and time periods',
            'Export capabilities for further analysis',
            'API access for seamless integration'
          ]
        }
      case 'contacts':
        return {
          title: 'Contact Discovery',
          subtitle: 'Find verified decision makers',
          icon: Users,
          searchQuery: 'Supply Chain Directors → Electronics → USA',
          results: '1,234 contacts',
          topResult: 'Sarah Chen, GlobalTech',
          features: [
            'Verified contact information for key decision makers',
            'Real-time email and phone number validation',
            'LinkedIn profile integration',
            'CRM export capabilities'
          ]
        }
      case 'analytics':
        return {
          title: 'Market Analytics',
          subtitle: 'Deep market intelligence',
          icon: TrendingUp,
          searchQuery: 'Trade Trends → Asia-Pacific → Q4 2024',
          results: '15,692 data points',
          topResult: 'Electronics +23.5%',
          features: [
            'Real-time market trend analysis',
            'Competitive intelligence and benchmarking',
            'Price movement predictions',
            'Supply chain risk assessment'
          ]
        }
      case 'reports':
        return {
          title: 'Custom Reports',
          subtitle: 'Generate detailed insights',
          icon: FileText,
          searchQuery: 'Monthly Report → China Imports → Electronics',
          results: '45 reports',
          topResult: 'Q4 Trade Summary',
          features: [
            'Automated report generation',
            'Customizable templates and layouts',
            'Scheduled delivery options',
            'Multi-format export (PDF, Excel, CSV)'
          ]
        }
      case 'insights':
        return {
          title: 'AI Insights',
          subtitle: 'Predictive trade intelligence',
          icon: BarChart3,
          searchQuery: 'AI Predictions → Supply Chain → Next 90 days',
          results: '892 insights',
          topResult: 'Port Congestion Alert',
          features: [
            'AI-powered market predictions',
            'Supply chain disruption alerts',
            'Opportunity identification',
            'Risk mitigation recommendations'
          ]
        }
      default:
        return getTabContent()
    }
  }

  const content = getTabContent()

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

        {/* Content Container */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Dynamic Search Interface */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <content.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{content.title}</h3>
                  <p className="text-muted-foreground">{content.subtitle}</p>
                </div>
              </div>

              {/* Browser-style Search Interface */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Browser Header */}
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-slate-600 ml-4">Advanced Search</div>
                </div>

                {/* Search Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-slate-600 mb-2">Search Query</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                    <div className="text-lg font-mono text-slate-800">
                      {content.searchQuery}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-600">Results Found</div>
                      <div className="text-xl font-bold text-slate-800">{content.results}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Top Result</div>
                      <div className="text-xl font-bold text-slate-800">{content.topResult}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Key Features */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">Key Features</h3>
              
              <div className="space-y-4 mb-8">
                {content.features.map((feature, index) => (
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
        </div>
      </Container>
    </section>
  )
}
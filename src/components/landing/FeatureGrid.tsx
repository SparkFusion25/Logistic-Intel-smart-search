import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import { ArrowRight, Search, Users, TrendingUp, FileText, BarChart3, Play } from "lucide-react";

const FeatureGrid = () => {
  const [activeFeature, setActiveFeature] = useState("search");

  const features = {
    search: {
      icon: Search,
      title: "Advanced Search",
      subtitle: "Find any company's shipping activity",
      description: "Search through millions of trade records with precision filters for HS codes, routes, and trade patterns. Get real-time insights into market movements.",
      benefits: [
        "Real-time shipment tracking across all modes",
        "Advanced filtering by HS codes, routes, and time periods", 
        "Export capabilities for further analysis",
        "API access for seamless integration"
      ],
      cta: "Start searching now"
    },
    contacts: {
      icon: Users,
      title: "Verified Contacts",
      subtitle: "Direct access to decision makers",
      description: "Access verified contact information for procurement managers, supply chain directors, and trade decision-makers with 94% accuracy.",
      benefits: [
        "94% email verification accuracy",
        "Direct phone numbers and LinkedIn profiles",
        "Real-time contact enrichment",
        "CRM integration capabilities"
      ],
      cta: "Find contacts"
    },
    analytics: {
      icon: TrendingUp,
      title: "Market Analytics",
      subtitle: "Comprehensive trade intelligence",
      description: "Analyze market trends, competitor movements, and trade opportunities with advanced analytics and reporting tools.",
      benefits: [
        "Market trend analysis and forecasting",
        "Competitor tracking and benchmarking",
        "Custom dashboard creation",
        "Automated report generation"
      ],
      cta: "View analytics"
    },
    reports: {
      icon: FileText,
      title: "Custom Reports",
      subtitle: "Tailored insights for your business",
      description: "Generate comprehensive reports tailored to your specific trade requirements and business objectives.",
      benefits: [
        "Customizable report templates",
        "Automated data collection",
        "Professional PDF exports",
        "Scheduled delivery options"
      ],
      cta: "Create reports"
    },
    insights: {
      icon: BarChart3,
      title: "Trade Insights",
      subtitle: "Deep market intelligence",
      description: "Unlock hidden opportunities with AI-powered insights into trade patterns, market shifts, and emerging trends.",
      benefits: [
        "AI-powered pattern recognition",
        "Emerging market identification",
        "Risk assessment tools",
        "Opportunity scoring"
      ],
      cta: "Explore insights"
    }
  };

  const tabs = [
    { id: "search", label: "Search", icon: Search },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "insights", label: "Insights", icon: BarChart3 }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-6">
            Platform Features
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for trade intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive trade data, verified contacts, and powerful analytics in one platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-12 lg:mb-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeFeature === tab.id ? "default" : "outline"}
                size="lg"
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 ${
                  activeFeature === tab.id 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
                }`}
                onClick={() => setActiveFeature(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Tool Interface Snippet */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-12 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Tool Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                {(() => {
                  const Icon = features[activeFeature as keyof typeof features].icon;
                  return (
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {features[activeFeature as keyof typeof features].title}
                  </h3>
                  <p className="text-gray-600">
                    {features[activeFeature as keyof typeof features].subtitle}
                  </p>
                </div>
              </div>
              
              {/* Tool Interface Mockup */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-2 text-xs text-gray-500 font-mono">
                      {features[activeFeature as keyof typeof features].title}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {(() => {
                    if (activeFeature === 'search') {
                      return (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-sm text-gray-600 mb-2">Search Query</div>
                            <div className="font-mono text-blue-600">Electronics • China → USA • Last 30 days</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Results Found</span>
                              <span className="text-green-600 font-medium">2,847 shipments</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Top Importer</span>
                              <span className="text-gray-900">TechCorp Solutions</span>
                            </div>
                          </div>
                        </>
                      );
                    } else if (activeFeature === 'contacts') {
                      return (
                        <>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="text-sm text-gray-600 mb-2">Contact Verification</div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-mono text-green-600">94% verified accuracy</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Sarah Chen</span>
                              <span className="text-green-600">✓ Verified</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Supply Chain Director</span>
                              <span className="text-gray-900">TechFlow Corp</span>
                            </div>
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-sm text-gray-600 mb-2">Analysis Results</div>
                            <div className="font-mono text-blue-600">Real-time market data</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Status</span>
                              <span className="text-green-600 font-medium">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Coverage</span>
                              <span className="text-gray-900">Global</span>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* Right Side - Key Features */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                <div className="space-y-4">
                  {features[activeFeature as keyof typeof features].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-gray-600 leading-relaxed mb-6">
                  {features[activeFeature as keyof typeof features].description}
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 shadow-lg">
                    {features[activeFeature as keyof typeof features].cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    <Play className="w-4 h-4 mr-2" />
                    Watch demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureGrid;
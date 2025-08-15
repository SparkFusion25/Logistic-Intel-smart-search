import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Search, Contact, TrendingUp, Calculator, FileText } from "lucide-react";

export const ProductStrip = () => {
  const [activeTab, setActiveTab] = useState("Search");

  const tabs = [
    { 
      id: "Search", 
      label: "Search", 
      icon: Search,
      content: {
        title: "Advanced Trade Intelligence Search",
        description: "Find any company's shipping activity with precision filters for HS codes, routes, and trade patterns.",
        features: ["Real-time shipment data", "Advanced filtering", "Export capabilities", "API access"]
      }
    },
    { 
      id: "Contacts", 
      label: "Contacts", 
      icon: Contact,
      content: {
        title: "Verified Decision-Maker Contacts",
        description: "Access verified contact information for procurement managers, supply chain directors, and trade decision-makers.",
        features: ["Email verification", "Direct phone numbers", "LinkedIn profiles", "Enrichment tools"]
      }
    },
    { 
      id: "Benchmarks", 
      label: "Benchmarks", 
      icon: TrendingUp,
      content: {
        title: "Market Rate Benchmarks",
        description: "Compare freight rates across routes and modes with comprehensive market intelligence.",
        features: ["Rate comparisons", "Historical trends", "Market analysis", "Competitive insights"]
      }
    },
    { 
      id: "Tariffs", 
      label: "Tariffs", 
      icon: Calculator,
      content: {
        title: "Instant Tariff Calculator",
        description: "Calculate duties and tariffs for any product and destination instantly.",
        features: ["Real-time rates", "HS code lookup", "Duty calculations", "Trade agreements"]
      }
    },
    { 
      id: "Quotes", 
      label: "Quotes", 
      icon: FileText,
      content: {
        title: "Professional Quote Generator",
        description: "Generate branded freight quotes with market rates and comprehensive documentation.",
        features: ["PDF export", "Custom branding", "Rate calculations", "Terms integration"]
      }
    }
  ];

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <section className="py-20 bg-canvas">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-h2 text-text-on-dark mb-4">
            Everything you need to win in global trade
          </h2>
          <p className="text-xl text-text-on-dark/70 max-w-3xl mx-auto">
            From prospecting to closing, our integrated platform powers your entire sales process.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 text-base transition-all duration-200
                  ${activeTab === tab.id 
                    ? "cta-gradient text-white shadow-lg" 
                    : "border-border-glass text-text-on-dark hover:bg-surface/10"
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <Card className="card-enterprise max-w-4xl mx-auto">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-semibold text-text-dark">
                {activeContent?.title}
              </h3>
              <p className="text-xl text-text-dark/70 max-w-2xl mx-auto">
                {activeContent?.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {activeContent?.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <Badge className="bg-brand/10 text-brand border-brand/20">
                      {feature}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};
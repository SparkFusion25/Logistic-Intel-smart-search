import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Users, TrendingUp, FileText, BarChart3, Play } from "lucide-react";

const FeatureGrid = () => {
  const [activeFeature, setActiveFeature] = useState("search");

  const features = {
    search: {
      icon: Search,
      title: "Advanced Search",
      subtitle: "Find any company's shipping activity",
      description: "Search by company, HS code, origin, destination, and mode with precision filters.",
      benefits: ["2.5M+ global shipments", "Real-time data updates", "Advanced filtering"],
      cta: "Start searching",
      preview: (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-brand/10 text-brand border-brand/30">Ocean</Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">Air</Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">Cross-border</Badge>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-surface/20 rounded-full">
              <div className="h-3 bg-brand w-3/4 rounded-full"></div>
            </div>
            <div className="h-3 bg-surface/20 rounded-full">
              <div className="h-3 bg-accent w-1/2 rounded-full"></div>
            </div>
            <div className="h-3 bg-surface/20 rounded-full">
              <div className="h-3 bg-success w-2/3 rounded-full"></div>
            </div>
          </div>
        </div>
      )
    },
    contacts: {
      icon: Users,
      title: "Contact Discovery",
      subtitle: "Reach real decision-makers",
      description: "Verified contacts, enrichment, and outreach automation—all built in.",
      benefits: ["94% contact accuracy", "Decision-maker targeting", "Automated enrichment"],
      cta: "Find contacts",
      preview: (
        <div className="space-y-3">
          {["Sarah Chen - Supply Chain Director", "Marcus Rodriguez - Logistics Manager", "Lisa Wang - Procurement Head"].map((contact, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-surface/10 rounded-lg">
              <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-brand" />
              </div>
              <div className="flex-1 text-sm text-text-on-dark/80">{contact}</div>
              <Badge className="bg-success/20 text-success border-success/30 text-xs">Verified</Badge>
            </div>
          ))}
        </div>
      )
    },
    intelligence: {
      icon: TrendingUp,
      title: "Market Intelligence",
      subtitle: "Win with data-driven insights",
      description: "Tariffs, quotes, and market benchmarks for every trade lane.",
      benefits: ["Real-time benchmarks", "Tariff calculations", "Quote generation"],
      cta: "Get insights",
      preview: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-surface/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">$2,450</div>
              <div className="text-xs text-text-on-dark/60">Avg Rate</div>
            </div>
            <div className="text-center p-3 bg-surface/10 rounded-lg">
              <div className="text-2xl font-bold text-success">12.5%</div>
              <div className="text-xs text-text-on-dark/60">Tariff</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-on-dark/60">Market Position</span>
            <Badge className="bg-brand/20 text-brand border-brand/30">Competitive</Badge>
          </div>
        </div>
      )
    }
  };

  const tabs = [
    { id: "search", label: "Search", icon: Search },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "intelligence", label: "Intelligence", icon: TrendingUp }
  ];

  return (
    <section className="py-20 bg-elevated">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-h2 text-text-on-dark mb-4">
            Everything you need to dominate global trade
          </h2>
          <p className="text-xl text-text-on-dark/70 max-w-3xl mx-auto">
            From intelligent search to contact discovery and market analysis—all in one powerful platform.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeFeature === tab.id ? "default" : "outline"}
                className={`px-6 py-3 ${
                  activeFeature === tab.id 
                    ? "cta-gradient text-white" 
                    : "border-border-glass text-text-on-dark hover:bg-surface/10"
                }`}
                onClick={() => setActiveFeature(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Active Feature Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {(() => {
                const Icon = features[activeFeature as keyof typeof features].icon;
                return <Icon className="w-12 h-12 text-brand" />;
              })()}
              <div>
                <h3 className="text-2xl font-semibold text-text-on-dark">
                  {features[activeFeature as keyof typeof features].title}
                </h3>
                <p className="text-text-on-dark/60">
                  {features[activeFeature as keyof typeof features].subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-lg text-text-on-dark/80">
              {features[activeFeature as keyof typeof features].description}
            </p>
            
            <div className="space-y-2">
              {features[activeFeature as keyof typeof features].benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                  <span className="text-text-on-dark/80">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button className="cta-gradient text-white px-8 hover:scale-105 transition-transform">
                {features[activeFeature as keyof typeof features].cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-border-glass text-text-on-dark hover:bg-surface/10">
                <Play className="w-4 h-4 mr-2" />
                Watch demo
              </Button>
            </div>
          </div>

          <Card className="card-enterprise bg-surface/5 border-border-glass backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-4">
                <Badge className="bg-brand/20 text-brand border-brand/30 mb-2">
                  Live Preview
                </Badge>
                <h4 className="text-lg font-semibold text-text-on-dark mb-2">
                  {features[activeFeature as keyof typeof features].title} Interface
                </h4>
              </div>
              <div className="bg-canvas/50 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                {features[activeFeature as keyof typeof features].preview}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
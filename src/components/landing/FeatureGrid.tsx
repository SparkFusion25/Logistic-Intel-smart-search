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
    <section className="py-16 lg:py-24 bg-surface">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-20">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-dark mb-6">
            Everything you need to dominate global trade
          </h2>
          <p className="text-lg lg:text-xl text-text-dark/70 max-w-4xl mx-auto leading-relaxed">
            From intelligent search to contact discovery and market analysis—all in one powerful platform.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-12 lg:mb-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeFeature === tab.id ? "default" : "outline"}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base ${
                  activeFeature === tab.id 
                    ? "cta-gradient text-white shadow-lg" 
                    : "border-border text-text-dark hover:bg-surface/50 bg-white"
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

        {/* Active Feature Display */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {(() => {
                const Icon = features[activeFeature as keyof typeof features].icon;
                return (
                  <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                );
              })()}
              <div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-text-dark mb-2">
                  {features[activeFeature as keyof typeof features].title}
                </h3>
                <p className="text-text-dark/60 text-lg">
                  {features[activeFeature as keyof typeof features].subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-lg lg:text-xl text-text-dark/80 leading-relaxed">
              {features[activeFeature as keyof typeof features].description}
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-text-dark text-lg">Key Benefits:</h4>
              <div className="grid sm:grid-cols-1 gap-3">
                {features[activeFeature as keyof typeof features].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-border/50 shadow-sm">
                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                    <span className="text-text-dark font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="cta-gradient text-white px-8 py-3 text-lg hover:scale-105 transition-transform shadow-lg">
                {features[activeFeature as keyof typeof features].cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-border text-text-dark hover:bg-surface/30 bg-white px-8 py-3 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch demo
              </Button>
            </div>
          </div>

          <Card className="bg-white border border-border/20 shadow-xl hover:shadow-2xl transition-all duration-300 order-1 lg:order-2">
            <CardContent className="p-6 lg:p-8">
              <div className="mb-6">
                <Badge className="bg-brand/10 text-brand border-brand/30 mb-3">
                  Live Preview
                </Badge>
                <h4 className="text-xl font-semibold text-text-dark mb-2">
                  {features[activeFeature as keyof typeof features].title} Interface
                </h4>
                <p className="text-text-dark/60">See how it works in real-time</p>
              </div>
              <div className="bg-canvas/30 rounded-xl p-6 min-h-[250px] lg:min-h-[300px] flex items-center justify-center border border-border/10">
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
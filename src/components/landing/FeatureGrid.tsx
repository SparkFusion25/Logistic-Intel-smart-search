import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Users, 
  Mail, 
  BarChart3, 
  Globe, 
  Zap, 
  Shield, 
  Target,
  Database,
  MessageSquare,
  Calculator,
  FileText
} from "lucide-react";

export const FeatureGrid = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Unified Search",
      description: "Search across BTS air data and US Census ocean shipments in one platform",
      highlight: "2.5M+ Records"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Intelligence",
      description: "Confidence scoring, air-shipper detection, and high-activity lane surfacing",
      highlight: "AI-Powered"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "CRM Integration",
      description: "Apollo enrichment with automated contact discovery and verification",
      highlight: "94% Success"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Automation",
      description: "Gmail/Outlook integration with open/click tracking and sequence management",
      highlight: "Multi-Channel"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Tariff Calculator",
      description: "Real-time tariff rates with HS code lookup and country-specific rules",
      highlight: "Live Rates"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Quote Generator",
      description: "Automated freight quotes with PDF export and customer delivery",
      highlight: "Professional"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Market Benchmark",
      description: "P25/P50/P75 rate analysis with lane-specific market intelligence",
      highlight: "New Feature"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Lead Scoring",
      description: "Confidence indicators and BTS route matching for prospect prioritization",
      highlight: "Smart AI"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Coverage",
      description: "Worldwide trade data with country, port, and city-level granularity",
      highlight: "150+ Countries"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Sync",
      description: "Live data updates with webhook notifications and API integrations",
      highlight: "Instant"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 compliance, RBAC, and audit logging for enterprise teams",
      highlight: "Secure"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Custom dashboards, export capabilities, and performance metrics",
      highlight: "Insights"
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Complete Freight Intelligence Platform
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Everything you need to find prospects, analyze trade data, and automate outreach 
            in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-card group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {feature.highlight}
                  </div>
                </div>
                <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Building2 } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Unified Freight Intelligence Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-semibold text-card-foreground leading-tight">
                Everything you need to 
                <span className="text-primary"> dominate</span> global trade
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Merge BTS air data, US Census ocean data, and CRM enrichment into one 
                powerful platform. Find prospects, analyze trade lanes, and automate outreach.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-border text-card-foreground hover:bg-muted text-lg px-8"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-card-foreground">2.5M+</div>
                <div className="text-sm text-muted-foreground">Shipments Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-card-foreground">150K+</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-card-foreground">94%</div>
                <div className="text-sm text-muted-foreground">Enrichment Rate</div>
              </div>
            </div>
          </div>

          {/* Right: Tool Preview */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-enterprise-lg">
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Advanced Search</h3>
                <Badge className="bg-success/10 text-success">Live Data</Badge>
              </div>

              {/* Search Interface Mockup */}
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-card-foreground font-medium">Electronics • China → USA • Last 30 days</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Air Freight</Badge>
                    <Badge variant="secondary" className="text-xs">HS 8517</Badge>
                    <Badge variant="secondary" className="text-xs">$50M+</Badge>
                  </div>
                </div>

                {/* Results Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-card-foreground">2,847 shipments found</span>
                    <span className="text-muted-foreground">Sorted by volume</span>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">TechCorp Solutions</h4>
                        <p className="text-sm text-muted-foreground">8,750 shipments • $124M value</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <button className="flex-1 py-2 px-3 bg-card text-card-foreground rounded-md text-sm font-medium">
                    Search
                  </button>
                  <button className="flex-1 py-2 px-3 text-muted-foreground text-sm font-medium">
                    Contacts
                  </button>
                  <button className="flex-1 py-2 px-3 text-muted-foreground text-sm font-medium">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plane, Ship, Globe } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-accent/30">
                Unified Freight Intelligence Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-semibold text-foreground leading-tight">
                Search, Analyze & 
                <span className="text-accent"> Connect</span> with
                Global Trade Data
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/80 max-w-lg">
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
                className="border-white/20 text-foreground hover:bg-white/10 text-lg px-8"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-foreground">2.5M+</div>
                <div className="text-sm text-foreground/60">Shipments Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-foreground">150K+</div>
                <div className="text-sm text-foreground/60">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-foreground">94%</div>
                <div className="text-sm text-foreground/60">Enrichment Rate</div>
              </div>
            </div>
          </div>

          {/* Right: Globe Visual */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Central Globe */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/10">
                  <Globe className="w-40 h-40 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60" />
                  
                  {/* Floating Icons */}
                  <div className="absolute top-8 right-8 bg-white rounded-lg p-3 shadow-card animate-pulse">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="absolute bottom-12 left-6 bg-white rounded-lg p-3 shadow-card animate-pulse" style={{ animationDelay: '1s' }}>
                    <Ship className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div className="absolute top-16 left-12 bg-white rounded-lg p-2 shadow-card animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="text-xs font-medium text-card-foreground">BTS Air</div>
                  </div>
                  
                  <div className="absolute bottom-8 right-16 bg-white rounded-lg p-2 shadow-card animate-pulse" style={{ animationDelay: '1.5s' }}>
                    <div className="text-xs font-medium text-card-foreground">US Census</div>
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
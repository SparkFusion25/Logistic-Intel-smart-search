import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Users, Mail, BarChart3, Globe, Plane, Ship, MessageSquare } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { SearchDemo } from "@/components/landing/SearchDemo";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PricingSection } from "@/components/landing/PricingSection";

const Index = () => {
  const [activeDemo, setActiveDemo] = useState<'search' | 'crm' | 'widgets'>('search');

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white rotate-45" />
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">LOGISTIC</div>
                <div className="text-sm font-medium text-accent">INTEL</div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
              <a href="#demo" className="text-foreground/80 hover:text-foreground transition-colors">Demo</a>
              <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10">
                Sign In
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              See Logistic Intel in Action
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Experience the power of unified freight intelligence and automated CRM workflows
            </p>
          </div>

          {/* Demo Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <Button
                variant={activeDemo === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveDemo('search')}
                className="px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                variant={activeDemo === 'crm' ? 'default' : 'ghost'}
                onClick={() => setActiveDemo('crm')}
                className="px-6"
              >
                <Users className="w-4 h-4 mr-2" />
                CRM
              </Button>
              <Button
                variant={activeDemo === 'widgets' ? 'default' : 'ghost'}
                onClick={() => setActiveDemo('widgets')}
                className="px-6"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Widgets
              </Button>
            </div>
          </div>

          {/* Demo Content */}
          {activeDemo === 'search' && <SearchDemo />}
          {activeDemo === 'crm' && (
            <Card className="max-w-4xl mx-auto shadow-card">
              <CardHeader className="text-center">
                <CardTitle>CRM & Enrichment</CardTitle>
                <CardDescription>
                  Automatically enrich contacts and manage email campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Apollo Enrichment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-sm">Contact Enrichment</span>
                        <Badge variant="secondary">94% Success Rate</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-sm">Email Verification</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Campaigns</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-sm">Open Rate</span>
                        <Badge className="bg-accent">42%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-sm">Response Rate</span>
                        <Badge className="bg-accent">18%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {activeDemo === 'widgets' && (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Tariff Calculator</CardTitle>
                  <CardDescription>Real-time tariff rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">HS Code 8471.60</span>
                      <Badge>12.5%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Country: China</span>
                      <Badge variant="outline">MFN</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quote Generator</CardTitle>
                  <CardDescription>Automated freight quotes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">LAX → SHA</span>
                      <Badge className="bg-primary">$2,340</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transit Time</span>
                      <Badge variant="outline">3-5 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Market Benchmark</CardTitle>
                  <CardDescription>Lane rate analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Median Rate</span>
                      <Badge className="bg-accent">$1,560</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sample Size</span>
                      <Badge variant="outline">948 shipments</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <FeatureGrid />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <ArrowRight className="w-2.5 h-2.5 text-white rotate-45" />
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">LOGISTIC INTEL</div>
              </div>
            </div>
            <div className="text-sm text-foreground/60">
              © 2025 Logistic Intel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "@/components/landing/ContactCard";
import { ArrowRight, Search, Users, TrendingUp, Globe, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contactCards = [
    {
      name: "Sarah Chen",
      title: "Supply Chain Director",
      company: "Global Electronics Corp",
      email: "s.chen@globalelectronics.com",
      phone: "+1 (555) 123-4567",
      status: "verified" as const,
      style: { animationDelay: '0ms' }
    },
    {
      name: "Marcus Rodriguez",
      title: "Logistics Manager", 
      company: "Pacific Imports Ltd",
      email: "m.rodriguez@pacificimports.com",
      location: "Los Angeles, CA",
      status: "active" as const,
      style: { animationDelay: '200ms' }
    },
    {
      name: "Lisa Wang",
      title: "Procurement Head",
      company: "TechFlow Solutions",
      email: "l.wang@techflow.com",
      phone: "+1 (555) 987-6543",
      status: "high-value" as const,
      style: { animationDelay: '400ms' }
    },
    {
      name: "David Kumar",
      title: "Trade Operations",
      company: "Asia Bridge Logistics",
      email: "d.kumar@asiabridge.com",
      location: "Singapore",
      status: "verified" as const,
      style: { animationDelay: '600ms' }
    }
  ];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation */}
      <nav className="relative z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cta-gradient rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-semibold text-text-on-dark">LOGISTIC INTEL</div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#solutions" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Solutions</a>
              <a href="#who-we-serve" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Who We Serve</a>
              <a href="#resources" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Resources</a>
              <a href="#company" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Company</a>
              <Button variant="ghost" className="text-text-on-dark/80 hover:text-text-on-dark hover:bg-surface/10">
                Login
              </Button>
              <Button className="cta-gradient text-white px-6 hover:scale-105 transition-transform">
                Get Demo
              </Button>
            </div>
            <button 
              className="lg:hidden text-text-on-dark"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  Discover • Analyze • Connect
                </Badge>
                <h1 className="text-h1 text-text-on-dark leading-tight">
                  Navigate freight 
                  <span className="text-accent"> intelligence</span> with
                  confidence
                </h1>
                <p className="text-xl text-text-on-dark/80 max-w-xl leading-relaxed">
                  Discover every air, ocean, and cross‑border importer, find decision‑makers, and supercharge your sales.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="cta-gradient text-white px-8 py-3 text-lg hover:scale-105 transition-transform">
                  Get a demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-border-glass text-text-on-dark hover:bg-surface/10 px-8 py-3 text-lg">
                  Explore solutions
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-text-on-dark">2.5M+</div>
                  <div className="text-sm text-text-on-dark/60">Global Shipments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-text-on-dark">150K+</div>
                  <div className="text-sm text-text-on-dark/60">Active Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-text-on-dark">94%</div>
                  <div className="text-sm text-text-on-dark/60">Contact Accuracy</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {contactCards.map((contact, index) => (
                  <ContactCard
                    key={index}
                    {...contact}
                    className={`animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 ${
                      index % 2 === 1 ? 'mt-8' : ''
                    }`}
                    style={contact.style}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-20 bg-elevated">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-text-on-dark mb-4">
              The complete freight intelligence platform
            </h2>
            <p className="text-xl text-text-on-dark/70 max-w-3xl mx-auto">
              From trade data analysis to contact enrichment and outreach automation.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="card-enterprise hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">Find the right companies fast</h3>
                <p className="text-text-dark/70">Search by company, HS code, origin, destination, and mode.</p>
              </CardContent>
            </Card>
            <Card className="card-enterprise hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">Reach real decision‑makers</h3>
                <p className="text-text-dark/70">Verified contacts, enrichment, and outreach—built in.</p>
              </CardContent>
            </Card>
            <Card className="card-enterprise hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">Win with intelligence</h3>
                <p className="text-text-dark/70">Tariffs, quotes, and market benchmarks for every lane.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-canvas">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-h2 text-text-on-dark mb-6">Ready to see it live?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cta-gradient text-white px-8 py-3 text-lg hover:scale-105 transition-transform">
              Get a demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="border-border-glass text-text-on-dark hover:bg-surface/10 px-8 py-3 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
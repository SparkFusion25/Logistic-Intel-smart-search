import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import FeatureGrid from "@/components/landing/FeatureGrid";
import { ResourcesHighlight } from "@/components/landing/ResourcesHighlight";
import { ProductStrip } from "@/components/landing/ProductStrip";
import { HeroContactChip } from "@/components/marketing/HeroContactChip";
import { ArrowRight, Search, Users, TrendingUp, Menu, X } from "lucide-react";
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
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
                alt="LOGISTIC INTEL"
                className="h-12 w-auto"
              />
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
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden xeneta-hero-bg">
        <Container className="py-16 sm:py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  Discover • Analyze • Connect
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-text-on-dark leading-tight font-semibold">
                  Navigate freight 
                  <span className="text-accent"> intelligence</span> with
                  confidence
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-text-on-dark/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover every air, ocean, and cross‑border importer, find decision‑makers, and supercharge your sales.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="cta-gradient text-white px-8 py-4 text-lg hover:scale-105 transition-transform shadow-lg">
                  Get a demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-border-glass text-text-on-dark hover:bg-surface/10 px-8 py-4 text-lg bg-white/10 backdrop-blur-sm">
                  Explore solutions
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-6 lg:pt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-on-dark">2.5M+</div>
                  <div className="text-sm lg:text-base text-text-on-dark/60">Global Shipments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-on-dark">150K+</div>
                  <div className="text-sm lg:text-base text-text-on-dark/60">Active Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-on-dark">94%</div>
                  <div className="text-sm lg:text-base text-text-on-dark/60">Contact Accuracy</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start max-w-lg mx-auto lg:mx-0">
                {contactCards.slice(0, 6).map((contact, index) => (
                  <HeroContactChip
                    key={index}
                    name={contact.name}
                    title={contact.title}
                    company={contact.company}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Product Strip */}
      <ProductStrip />

      {/* Resources Highlight */}
      <ResourcesHighlight />

      {/* Final CTA */}
      <section className="py-20 bg-canvas">
        <Container className="text-center">
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
        </Container>
      </section>
    </div>
  );
};

export default Index;
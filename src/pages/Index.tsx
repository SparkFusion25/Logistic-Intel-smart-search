import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import FeatureGrid from "@/components/landing/FeatureGrid";
import { ResourcesHighlight } from "@/components/landing/ResourcesHighlight";
import { ProductStrip } from "@/components/landing/ProductStrip";
import { HeroSection } from "@/components/landing/HeroSection";
import { SearchDemo } from "@/components/landing/SearchDemo";
import { PricingSection } from "@/components/landing/PricingSection";
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
              <Link to="/blog" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Blog</Link>
              <a href="#company" className="text-text-on-dark/80 hover:text-text-on-dark font-medium">Company</a>
              <Button variant="ghost" className="text-text-on-dark/80 hover:text-text-on-dark hover:bg-surface/10">
                Login
              </Button>
              <Link to="/dashboard" className="cta-gradient text-white px-6 hover:scale-105 transition-transform">
                Get Demo
              </Link>
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
      <HeroSection />

      {/* Search Demo */}
      <SearchDemo />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Product Strip */}
      <ProductStrip />

      {/* Pricing Section */}
      <PricingSection />

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
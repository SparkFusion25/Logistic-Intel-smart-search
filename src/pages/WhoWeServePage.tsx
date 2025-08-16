import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/ui/Container";
import { Link } from "react-router-dom";
import { ArrowRight, Building, Truck, Ship, Package, Factory, Store } from "lucide-react";

const WhoWeServePage = () => {
  const industries = [
    {
      icon: Building,
      title: "Import/Export Companies",
      description: "Comprehensive trade intelligence for international trading firms",
      benefits: ["Market opportunity identification", "Supplier discovery", "Risk assessment"]
    },
    {
      icon: Truck,
      title: "Logistics Providers", 
      description: "Data-driven insights for freight forwarders and logistics companies",
      benefits: ["Route optimization", "Capacity planning", "Customer intelligence"]
    },
    {
      icon: Ship,
      title: "Shipping Companies",
      description: "Maritime trade intelligence and port analytics",
      benefits: ["Port performance metrics", "Trade lane analysis", "Cargo forecasting"]
    },
    {
      icon: Package,
      title: "Supply Chain Managers",
      description: "End-to-end visibility and optimization tools",
      benefits: ["Supplier monitoring", "Disruption alerts", "Cost optimization"]
    },
    {
      icon: Factory,
      title: "Manufacturers",
      description: "Raw material sourcing and export market intelligence",
      benefits: ["Supplier verification", "Market expansion", "Competitive analysis"]
    },
    {
      icon: Store,
      title: "Retailers",
      description: "Product sourcing and market trend analysis",
      benefits: ["Product discovery", "Price benchmarking", "Trend forecasting"]
    }
  ];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation */}
      <nav className="relative z-50">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
                alt="LOGISTIC INTEL"
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-text-on-dark/80 hover:text-text-on-dark">Home</Link>
              <Link to="/dashboard" className="cta-gradient text-white px-6 py-2 rounded-md">Dashboard</Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-h1 text-text-on-dark mb-6">
              Built for Global Trade Professionals
            </h1>
            <p className="text-xl text-text-on-dark/80 mb-8">
              From import/export companies to supply chain managers, our platform serves every role in international trade
            </p>
          </div>
        </Container>
      </section>

      {/* Industries Grid */}
      <section className="pb-20">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="bg-surface border-border-glass hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <industry.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-h3 text-text-on-dark mb-3">{industry.title}</h3>
                  <p className="text-text-on-dark/70 mb-4">{industry.description}</p>
                  <ul className="space-y-2">
                    {industry.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-text-on-dark/60 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-h2 text-text-on-dark mb-6">Ready to Transform Your Trade Operations?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="cta-gradient text-white px-8 py-3 text-lg">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default WhoWeServePage;
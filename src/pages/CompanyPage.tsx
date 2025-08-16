import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/ui/Container";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Award, Globe } from "lucide-react";

const CompanyPage = () => {
  useEffect(() => {
    document.title = "About Logistic Intel | Our Mission & Team | Global Trade Intelligence";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Logistic Intel\'s mission to democratize global trade intelligence. Meet our leadership team and discover our journey in transforming international trade data.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about Logistic Intel\'s mission to democratize global trade intelligence. Meet our leadership team and discover our journey in transforming international trade data.';
      document.head.appendChild(meta);
    }
  }, []);
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50M+", label: "Trade Records Analyzed" },
    { number: "150+", label: "Countries Covered" },
    { number: "99.9%", label: "Uptime" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      background: "Former McKinsey Partner with 15+ years in international trade",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      background: "Ex-Google engineer specializing in data analytics and AI",
    },
    {
      name: "Lisa Wang",
      role: "Head of Product",
      background: "Product leader from Amazon with deep logistics expertise",
    }
  ];

  const milestones = [
    { year: "2020", event: "Company founded with mission to democratize trade intelligence" },
    { year: "2021", event: "Launched first trade data platform serving 100 companies" },
    { year: "2022", event: "Expanded to global coverage with AI-powered insights" },
    { year: "2023", event: "Reached 5,000+ active users across 50 countries" },
    { year: "2024", event: "Introduced advanced analytics and automation tools" }
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
      <header className="pt-20 pb-16">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-h1 text-text-on-dark mb-6">
              About Logistic Intel
            </h1>
            <p className="text-xl text-text-on-dark/80 mb-8">
              We're on a mission to democratize global trade intelligence and empower businesses worldwide to make data-driven decisions in international markets.
            </p>
          </div>
        </Container>
      </header>

      {/* Stats */}
      <main>
        <section className="pb-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-text-on-dark/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="pb-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 text-text-on-dark mb-6">Our Mission</h2>
            <p className="text-lg text-text-on-dark/80 mb-8">
              We believe that access to comprehensive trade intelligence should not be limited to large corporations. 
              Our platform democratizes global trade data, making it accessible and actionable for businesses of all sizes.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-surface border-border-glass">
                <CardContent className="p-6 text-center">
                  <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-on-dark mb-2">Global Reach</h3>
                  <p className="text-text-on-dark/70">Comprehensive data coverage across 150+ countries</p>
                </CardContent>
              </Card>
              <Card className="bg-surface border-border-glass">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-on-dark mb-2">Quality First</h3>
                  <p className="text-text-on-dark/70">AI-powered data validation and accuracy verification</p>
                </CardContent>
              </Card>
              <Card className="bg-surface border-border-glass">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-on-dark mb-2">Customer Focus</h3>
                  <p className="text-text-on-dark/70">Building tools that solve real trade challenges</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="pb-16">
        <Container>
          <h2 className="text-h2 text-text-on-dark mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-surface border-border-glass">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-on-dark mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-text-on-dark/70">{member.background}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="pb-20">
        <Container>
          <h2 className="text-h2 text-text-on-dark mb-8 text-center">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 mb-8">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium min-w-fit">
                  {milestone.year}
                </div>
                <p className="text-text-on-dark/80 pt-1">{milestone.event}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-h2 text-text-on-dark mb-6">Join Our Mission</h2>
            <p className="text-lg text-text-on-dark/80 mb-8 max-w-2xl mx-auto">
              Ready to transform your approach to global trade? Experience the power of comprehensive trade intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="cta-gradient text-white px-8 py-3 text-lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
      </main>
    </div>
  );
};

export default CompanyPage;
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/ui/Container";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, Video, Download, Calendar, Users } from "lucide-react";

const ResourcesPage = () => {
  useEffect(() => {
    document.title = "Resources & Learning Center | Guides, Reports & Training | Logistic Intel";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Master global trade intelligence with our comprehensive learning center. Access guides, research reports, video tutorials, templates, webinars & community resources.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Master global trade intelligence with our comprehensive learning center. Access guides, research reports, video tutorials, templates, webinars & community resources.';
      document.head.appendChild(meta);
    }
  }, []);
  const resources = [
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Comprehensive guides and documentation",
      items: ["Platform tutorials", "Best practices", "API documentation"]
    },
    {
      icon: FileText,
      title: "Research Reports", 
      description: "Industry insights and market analysis",
      items: ["Market trends", "Trade statistics", "Regional analysis"]
    },
    {
      icon: Video,
      title: "Video Library",
      description: "Training videos and product demos",
      items: ["Platform walkthroughs", "Feature highlights", "Case studies"]
    },
    {
      icon: Download,
      title: "Downloads",
      description: "Templates and tools for trade professionals",
      items: ["Excel templates", "Checklists", "Industry tools"]
    },
    {
      icon: Calendar,
      title: "Webinars",
      description: "Live and recorded educational sessions",
      items: ["Weekly insights", "Expert panels", "Q&A sessions"]
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other trade professionals",
      items: ["Discussion forums", "Networking events", "User groups"]
    }
  ];

  const featuredResources = [
    {
      title: "Complete Guide to Trade Intelligence",
      description: "Everything you need to know about leveraging data for international trade success",
      category: "Guide"
    },
    {
      title: "2024 Global Trade Trends Report",
      description: "Annual analysis of worldwide trade patterns and emerging opportunities",
      category: "Report"
    },
    {
      title: "Platform Demo: Advanced Search Features",
      description: "Learn how to maximize your search capabilities with our advanced tools",
      category: "Video"
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

      {/* Hero Banner */}
      <header className="relative py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>
        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Resources & 
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Learning Center
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Everything you need to master global trade intelligence and maximize your platform usage
            </p>
          </div>
        </Container>
      </header>

      {/* Featured Resources */}
      <main>
        <section className="pb-16">
        <Container>
          <h2 className="text-h2 text-text-on-dark mb-8 text-center">Featured Resources</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="bg-surface border-border-glass hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    {resource.category}
                  </div>
                  <h3 className="text-lg font-semibold text-text-on-dark mb-3">{resource.title}</h3>
                  <p className="text-text-on-dark/70 mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Access Resource
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Resource Categories */}
      <section className="pb-20">
        <Container>
          <h2 className="text-h2 text-text-on-dark mb-8 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-surface border-border-glass hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <resource.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-h3 text-text-on-dark mb-3">{resource.title}</h3>
                  <p className="text-text-on-dark/70 mb-4">{resource.description}</p>
                  <ul className="space-y-2">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-text-on-dark/60 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                        {item}
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
            <h2 className="text-h2 text-text-on-dark mb-6">Need Help Getting Started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="cta-gradient text-white px-8 py-3 text-lg">
                  Explore Platform
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-border-glass text-text-on-dark px-8 py-3 text-lg">
                Contact Support
              </Button>
            </div>
          </div>
        </Container>
      </section>
      </main>
    </div>
  );
};

export default ResourcesPage;
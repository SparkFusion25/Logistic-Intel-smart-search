import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Search, Users, Mail, Calculator, FileText, Shield, Globe, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import LandingMobileMenu from '@/components/layout/LandingMobileMenu';

export default function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Search Intelligence',
      description: 'Discover global trade patterns and business opportunities with advanced search capabilities.',
      href: '/dashboard/search'
    },
    {
      icon: Users,
      title: 'CRM Intelligence',
      description: 'Manage contacts and leads with powerful relationship management tools.',
      href: '/dashboard/crm'
    },
    {
      icon: Mail,
      title: 'Email Intelligence',
      description: 'Create and manage sophisticated email campaigns for your prospects.',
      href: '/dashboard/email'
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Analyze market trends and benchmark your performance against competitors.',
      href: '/dashboard/benchmark'
    },
    {
      icon: Calculator,
      title: 'Tariff Calculator',
      description: 'Calculate import duties and tariffs for international trade planning.',
      href: '/dashboard/widgets/tariff'
    },
    {
      icon: FileText,
      title: 'Quote Generator',
      description: 'Generate professional quotes and proposals for your logistics services.',
      href: '/dashboard/widgets/quote'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LogisticIntel</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Intelligence Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/auth">
                      <Button variant="outline">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Navigation */}
              <LandingMobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              AI-Powered Trade Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Unlock Global Trade
              <br />
              <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your logistics business with comprehensive trade data analysis, 
              CRM intelligence, and market insights powered by artificial intelligence.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Intelligence Suite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze trade data, manage relationships, and grow your logistics business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <Link to={feature.href}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Access Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-glass p-12 rounded-2xl">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of logistics professionals who trust LogisticIntel for their trade intelligence needs.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">LogisticIntel</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 LogisticIntel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
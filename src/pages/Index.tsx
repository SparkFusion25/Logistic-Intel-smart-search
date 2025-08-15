import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Users, Mail, BarChart3, Globe, Plane, Ship, MessageSquare, Menu, X, Building, Phone, MapPin, TrendingUp, Database, Shield } from "lucide-react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation - Xeneta Style */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-gray-900">LOGISTIC INTEL</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Solutions</a>
              <a href="#who-we-serve" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Who We Serve</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Resources</a>
              <a href="#company" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Company</a>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Get Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Xeneta Inspired */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-white">
              <div className="space-y-6">
                <div className="text-sm font-medium text-blue-200 uppercase tracking-wider">
                  DISCOVER, ANALYZE, CONNECT
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Navigate freight 
                  <span className="text-blue-300"> intelligence</span> with
                  confidence
                </h1>
                
                <p className="text-xl text-blue-100 max-w-xl">
                  Discover every air, ocean, and cross-border importer, find their contact information, and supercharge your sales with comprehensive freight market intelligence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Get a demo
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  Explore solutions
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white">2.5M+</div>
                  <div className="text-sm text-blue-200">Global Shipments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">150K+</div>
                  <div className="text-sm text-blue-200">Active Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">94%</div>
                  <div className="text-sm text-blue-200">Data Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Cards Demo */}
            <div className="relative">
              <div className="space-y-4">
                {/* Contact Card 1 */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Sarah Chen</div>
                            <div className="text-sm text-gray-600">Supply Chain Director</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>Global Electronics Corp</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>s.chen@globalelectronics.com</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>+1 (555) 123-4567</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card 2 */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-300 ml-8">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Ship className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Marcus Rodriguez</div>
                            <div className="text-sm text-gray-600">Logistics Manager</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>Pacific Imports Ltd</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>m.rodriguez@pacificimports.com</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Los Angeles, CA</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card 3 */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Plane className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Lisa Wang</div>
                            <div className="text-sm text-gray-600">Procurement Head</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>TechFlow Solutions</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>l.wang@techflow.com</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>+1 (555) 987-6543</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">High Value</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The complete freight intelligence platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From trade data analysis to contact enrichment and email automation, 
              everything you need to identify, connect, and convert prospects.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trade Intelligence</h3>
                <p className="text-gray-600 mb-4">
                  Search and analyze global trade flows with comprehensive shipment data 
                  across air, ocean, and cross-border movements.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time shipment tracking</li>
                  <li>• Trade lane analysis</li>
                  <li>• Market trend insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Discovery</h3>
                <p className="text-gray-600 mb-4">
                  Find and enrich key decision-makers with verified contact information 
                  and company intelligence for targeted outreach.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 94% contact accuracy rate</li>
                  <li>• Email & phone verification</li>
                  <li>• Decision-maker mapping</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sales Automation</h3>
                <p className="text-gray-600 mb-4">
                  Automate your sales process with intelligent email campaigns, 
                  lead scoring, and CRM integration for maximum conversion.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automated email sequences</li>
                  <li>• Lead scoring & routing</li>
                  <li>• CRM synchronization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your freight sales?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading freight forwarders and logistics companies who trust our platform 
            to drive growth and streamline their sales operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Get a demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              View pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-xl font-bold text-white">LOGISTIC INTEL</div>
              <p className="text-gray-400">
                The leading freight intelligence platform for sales teams worldwide.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trade Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Discovery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sales Automation</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400">
              © 2025 Logistic Intel. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
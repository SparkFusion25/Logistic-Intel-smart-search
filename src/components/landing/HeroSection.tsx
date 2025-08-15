import { ArrowRight, Shield, Zap, Globe, BarChart3, Users, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const HeroSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Live trade data and market intelligence"
    },
    {
      icon: Globe,
      title: "Global Coverage", 
      description: "200+ countries and territories"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade data protection"
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center hero-streaks overflow-hidden">
      {/* Overlay for content readability */}
      <div className="absolute inset-0 bg-slate-900/40" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <Badge className="bg-accent/20 text-accent border-accent/30">
                <Zap className="w-4 h-4 mr-2" />
                Powered by AI & Big Data
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-on-dark leading-tight">
                Global Trade
                <span className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  Intelligence
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl text-text-on-dark/80">
                  Simplified
                </span>
              </h1>
              
              <p className="text-xl text-text-on-dark/80 leading-relaxed max-w-xl">
                Transform your logistics operations with AI-powered insights from 50M+ trade records. 
                Make data-driven decisions that drive growth and reduce costs.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link to="/dashboard">
                <Button className="cta-gradient text-white px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button variant="outline" className="border-border-glass text-text-on-dark hover:bg-surface/10 px-8 py-4 text-lg font-bold bg-white/10 backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8">
              <p className="text-sm text-text-on-dark/60 mb-4">Trusted by 10,000+ logistics professionals</p>
              <div className="flex items-center gap-8 opacity-60">
                <div className="text-lg font-bold text-text-on-dark">DHL</div>
                <div className="text-lg font-bold text-text-on-dark">Maersk</div>
                <div className="text-lg font-bold text-text-on-dark">FedEx</div>
                <div className="text-lg font-bold text-text-on-dark">UPS</div>
              </div>
            </div>
          </div>

          {/* 3D Cards Animation */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-700 hover:scale-105 animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Trade Analytics</h3>
                  <p className="text-muted-foreground mb-6">
                    Real-time insights from global shipping data
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ocean freight</span>
                      <span className="text-sm font-semibold text-emerald-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Air cargo</span>
                      <span className="text-sm font-semibold text-blue-600">+8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Port efficiency</span>
                      <span className="text-sm font-semibold text-purple-600">+15.7%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
                <Users className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-semibold text-foreground">50M+</div>
                <div className="text-xs text-muted-foreground">Trade Records</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-pulse-slow">
                <Globe className="w-6 h-6 text-accent mb-2" />
                <div className="text-sm font-semibold text-foreground">200+</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/60 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
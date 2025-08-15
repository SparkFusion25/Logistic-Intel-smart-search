import { ArrowRight, Shield, Zap, Globe, BarChart3, Users, TrendingUp, Play, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const HeroSection = () => {
  const kpis = [
    { label: 'Ocean freight', value: '+12.5%', color: 'text-emerald-500' },
    { label: 'Air cargo', value: '+8.2%', color: 'text-blue-500' },
    { label: 'Port efficiency', value: '+15.7%', color: 'text-purple-500' },
    { label: 'Trade volume', value: '+23.1%', color: 'text-green-500' }
  ]

  const partnerLogos = ['DHL', 'Maersk', 'UPS', 'FedEx', 'MSC']

  return (
    <section className="relative min-h-screen flex items-center hero-enterprise-bg overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
      
      {/* Animated Gradient Lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content (45%) */}
          <div className="space-y-8 animate-fade-in lg:pr-8">
            {/* Pre-header */}
            <div className="text-sm tracking-wider text-slate-400 uppercase font-medium">
              POWERED BY AI & GLOBAL DATA
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Navigate </span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Global Trade
              </span>
              <span className="block text-white mt-2">with Confidence</span>
            </h1>
            
            {/* Subheader */}
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Unlock actionable insights from 50M+ trade records. Make data-driven decisions 
              that accelerate growth and optimize your supply chain operations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white px-8 py-4 text-lg font-bold rounded-xl bg-transparent backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Data Card (55%) */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Main Data Card with Glassmorphism */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 max-w-lg w-full">
              <div className="space-y-6">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Trade Analytics</h3>
                    <p className="text-slate-400">Real-time market insights</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-end justify-between h-24 space-x-2">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 75, 85].map((height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t flex-1 opacity-80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 text-center">Global Trade Volume (Last 30 Days)</div>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {kpis.map((kpi, index) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                      <div className="text-xs text-slate-400 mb-1">{kpi.label}</div>
                      <div className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 animate-bounce-slow">
              <Package className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-lg font-bold text-white">50M+</div>
              <div className="text-xs text-slate-400">Records</div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 animate-pulse-slow">
              <Globe className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="text-lg font-bold text-white">200+</div>
              <div className="text-xs text-slate-400">Countries</div>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-20 pt-12 border-t border-slate-700/50">
          <p className="text-sm text-slate-500 text-center mb-8">Trusted by industry leaders worldwide</p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-slate-300 hover:text-white hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
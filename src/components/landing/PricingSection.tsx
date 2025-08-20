import { Check, Star, ArrowRight, Zap, Crown, Building } from 'lucide-react'
import { Link } from 'next/router'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: 49,
      description: "Perfect for small freight forwarders",
      icon: Zap,
      features: [
        "5,000 search queries/month",
        "Basic trade analytics",
        "Email support",
        "Standard data refresh",
        "Export to CSV",
        "1 user account"
      ],
      limitations: [
        "Limited to ocean freight",
        "No API access",
        "Basic reporting only"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-slate-400 to-slate-500"
    },
    {
      name: "Professional",
      price: 199,
      description: "Ideal for growing logistics companies",
      icon: Crown,
      features: [
        "50,000 search queries/month",
        "Advanced analytics & forecasting",
        "Priority email & chat support",
        "Real-time data updates",
        "Export to Excel, PDF",
        "Up to 5 user accounts",
        "Ocean & air freight data",
        "Basic API access",
        "Custom reports",
        "Market intelligence alerts"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      color: "from-primary to-accent"
    },
    {
      name: "Enterprise",
      price: null,
      description: "For large logistics operations",
      icon: Building,
      features: [
        "Unlimited search queries",
        "AI-powered predictive analytics",
        "24/7 phone & email support",
        "Real-time data feeds",
        "All export formats",
        "Unlimited user accounts",
        "All transportation modes",
        "Full API access",
        "White-label reporting",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "from-purple-400 to-purple-500"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligence Level
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From growing freight forwarders to global logistics giants, we have the right plan 
            to power your trade intelligence needs.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md">
              Monthly
            </button>
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground">
              Annual
              <Badge className="ml-2 bg-emerald-100 text-emerald-700 text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'ring-2 ring-primary scale-105 z-10' 
                  : 'hover:scale-105'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-6`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>

              {/* Plan Info */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="flex items-baseline mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-foreground">Custom</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Not included:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <span className="w-5 h-5 text-red-400 mr-3 mt-0.5">×</span>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                to={plan.cta === "Contact Sales" ? "/contact" : "/dashboard"}
                className={`w-full py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 shadow-lg'
                    : 'bg-gray-100 text-foreground hover:bg-gray-200'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              {plan.price && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  14-day free trial • No credit card required
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
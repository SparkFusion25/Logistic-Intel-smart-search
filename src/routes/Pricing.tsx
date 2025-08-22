import { useState } from "react";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { Check, X } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 79, annual: 79 },
    description: "Perfect for small freight forwarders",
    features: [
      "Basic search",
      "100 company views/mo",
      "Email alerts"
    ],
    limitations: ["No CRM access", "No bulk exports"],
    cta: "Start Starter",
    popular: false
  },
  {
    id: "pro",
    name: "Pro", 
    price: { monthly: 179, annual: 149 },
    description: "Advanced features for growing companies",
    features: [
      "Full search",
      "1,500 company views/mo",
      "New shipper alerts",
      "CRM sync",
      "Contact enrichment"
    ],
    limitations: [],
    cta: "Start Pro",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description: "Unlimited access with enterprise features",
    features: [
      "SAML SSO",
      "Bulk import API", 
      "Custom models",
      "Dedicated support"
    ],
    limitations: [],
    cta: "Talk to Sales",
    popular: false
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <SeoHelmet
        title="Pricing - Logistic Intel"
        description="Choose the perfect plan for your logistics business. From starter to enterprise solutions."
        canonical="https://logisticintel.com/pricing"
      />

      <main style={{ background: 'var(--bg-muted)' }}>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6" 
              style={{ color: 'var(--text)' }}>
            Choose Your Intelligence Level
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8" 
             style={{ color: 'var(--text-muted)' }}>
            From startups to enterprises, we have a plan that scales with your business needs.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="card inline-flex items-center p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                !isAnnual ? 'gradient-cta shadow' : 'hover:bg-gray-50'
              }`}
              style={!isAnnual ? {} : { color: 'var(--text-muted)' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isAnnual ? 'gradient-cta shadow' : 'hover:bg-gray-50'
              }`}
              style={isAnnual ? {} : { color: 'var(--text-muted)' }}
            >
              Annual
              <span className="ml-2 text-xs px-2 py-1 rounded"
                    style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                Save 20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative card p-8 ${
                  plan.popular ? 'ring-2 scale-105' : ''
                }`}
                style={plan.popular ? { borderColor: 'var(--brand-500)' } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="gradient-cta px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-4">
                    {typeof plan.price.monthly === 'number' ? (
                      <>
                        <span className="text-4xl font-bold" style={{ color: 'var(--text)' }}>
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Contact us</span>
                    )}
                  </div>

                  <button
                    className={`w-full rounded-xl px-6 py-3 font-semibold transition ${
                      plan.popular ? 'gradient-cta hover:brightness-110' : 'hover:brightness-95'
                    }`}
                    style={plan.popular ? {} : { 
                      background: 'var(--card)',
                      border: '2px solid var(--brand-500)',
                      color: 'var(--brand-700)'
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>
                      What's included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Not included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start gap-3">
                            <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
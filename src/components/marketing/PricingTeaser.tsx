import { Link } from "react-router-dom";

export default function PricingTeaser() {
  const plans = [
    { 
      name: "Free", 
      price: "$0", 
      features: ["Basic search", "100 company views/mo", "Email alerts"],
      cta: "Start Free",
      href: "/auth/signup"
    },
    { 
      name: "Pro", 
      price: "$149", 
      period: "/mo",
      features: ["Full search", "1,500 company views/mo", "CRM sync", "Apollo enrichment"], 
      popular: true,
      cta: "Upgrade to Pro",
      href: "/auth/signup"
    },
    { 
      name: "Enterprise", 
      price: "Custom", 
      features: ["Unlimited access", "SAML SSO", "Dedicated support", "Custom integrations"],
      cta: "Request Demo",
      href: "/demo/request"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-[#F7F8FA]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39] mb-4">
          Plans that scale with your pipeline
        </h2>
        <p className="text-lg text-slate-600">
          From startups to enterprises, we have a plan that scales with your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl p-6 shadow-lg border relative ${plan.popular ? 'ring-2 ring-[#0F4C81] scale-105' : 'border-slate-100'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#0B1E39] mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#0F4C81]">{plan.price}</span>
                {plan.period && <span className="text-slate-600">{plan.period}</span>}
              </div>
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to={plan.href}
                className={`block w-full py-3 px-6 rounded-xl font-semibold transition ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] text-white hover:brightness-110' 
                    : 'border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          to="/pricing" 
          className="inline-flex items-center rounded-xl px-6 py-3 text-white font-semibold shadow-lg transition
                     bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110"
        >
          See All Plans
        </Link>
      </div>
    </section>
  );
}
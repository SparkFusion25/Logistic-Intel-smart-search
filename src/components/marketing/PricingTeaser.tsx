import { Link } from "react-router-dom";

export default function PricingTeaser() {
  const plans = [
    { name: "Starter", price: "$79", features: ["Basic search", "100 company views/mo"] },
    { name: "Pro", price: "$179", features: ["Full search", "1,500 company views/mo", "CRM sync"], popular: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited access", "Custom integrations"] }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39]">
          Choose your intelligence level
        </h2>
        <p className="mt-4 text-lg text-slate-700">
          From startups to enterprises, we have a plan that scales with your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl p-6 shadow relative ${plan.popular ? 'ring-2 ring-[#0F4C81]' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#0B1E39] mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-[#0F4C81] mb-4">{plan.price}</div>
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          to="/pricing" 
          className="inline-flex items-center rounded-xl px-6 py-3 text-white font-semibold shadow transition
                     bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110"
        >
          View All Plans
        </Link>
      </div>
    </section>
  );
}
import { useState } from "react";
import SeoHelmet from "@/components/seo/SeoHelmet";
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

const faqs = [
  {
    question: "What's included in the free trial?",
    answer: "The 7-day free trial includes 100 search queries, access to basic shipment data, and 5 CRM contacts. No credit card required."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. Annual plans are refunded on a pro-rata basis for unused months."
  },
  {
    question: "How accurate is the trade data?",
    answer: "Our data comes from official customs sources and is updated continuously. We maintain 95%+ accuracy with automated quality checks."
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SeoHelmet
        title="Pricing - Logistic Intel"
        description="Choose the perfect plan for your logistics business. From starter to enterprise solutions."
        canonical="https://logisticintel.com/pricing"
      />

      <main className="bg-[#F7F8FA]">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1E39] mb-6">
            Choose Your Intelligence Level
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            From startups to enterprises, we have a plan that scales with your business needs.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="bg-white rounded-xl p-1 inline-flex items-center shadow">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                !isAnnual ? 'bg-[#0F4C81] text-white shadow' : 'text-slate-700 hover:text-[#0F4C81]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isAnnual ? 'bg-[#0F4C81] text-white shadow' : 'text-slate-700 hover:text-[#0F4C81]'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
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
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-[#0F4C81] scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-[#0B1E39] mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    {typeof plan.price.monthly === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-[#0B1E39]">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-slate-600 text-sm">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-[#0B1E39]">Contact us</span>
                    )}
                  </div>

                  <button
                    className={`w-full rounded-xl px-6 py-3 font-semibold transition ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] text-white hover:brightness-110'
                        : 'bg-white border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#0B1E39] mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-500 mb-3 text-sm">Not included:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start gap-3">
                            <X className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-500 text-sm">{limitation}</span>
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

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39] mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 rounded-xl transition"
                >
                  <span className="font-semibold text-[#0B1E39]">{faq.question}</span>
                  <span className="text-[#0F4C81] text-xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
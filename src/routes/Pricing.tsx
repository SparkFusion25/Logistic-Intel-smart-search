import { useState } from "react";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd, createProductSchema } from "@/components/seo/JsonLd";
import { Check, X } from "lucide-react";

const plans = [
  {
    id: "trial",
    name: "Free Trial",
    price: { monthly: 0, annual: 0 },
    description: "Explore our platform with limited access",
    features: [
      "100 search queries/month",
      "Basic shipment data",
      "5 CRM contacts", 
      "Email support",
      "7-day access"
    ],
    limitations: [
      "No bulk exports",
      "No AI insights",
      "No integrations"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 99, annual: 79 },
    description: "Perfect for small freight forwarders and brokers",
    features: [
      "1,000 search queries/month",
      "Full shipment history",
      "100 CRM contacts",
      "Basic AI insights",
      "Email & chat support",
      "CSV exports",
      "Mobile app access"
    ],
    limitations: [
      "No API access",
      "No custom integrations"
    ],
    cta: "Start Starter Plan", 
    popular: false
  },
  {
    id: "pro",
    name: "Professional", 
    price: { monthly: 299, annual: 239 },
    description: "Advanced features for growing logistics companies",
    features: [
      "5,000 search queries/month",
      "Advanced AI insights",
      "1,000 CRM contacts", 
      "Email campaigns (5,000/month)",
      "Priority support",
      "API access (1,000 calls/month)",
      "Custom reports",
      "Tariff calculator",
      "Market intelligence"
    ],
    limitations: [],
    cta: "Start Pro Plan",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description: "Unlimited access with white-glove support",
    features: [
      "Unlimited queries",
      "Full API access",
      "Unlimited CRM contacts",
      "Unlimited email campaigns",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "Custom onboarding",
      "SLA guarantees"
    ],
    limitations: [],
    cta: "Contact Sales",
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
  },
  {
    question: "Do you offer API access?",
    answer: "API access is included with Professional and Enterprise plans. We provide RESTful APIs with comprehensive documentation."
  },
  {
    question: "What countries are covered?",
    answer: "We cover 180+ countries with trade data, including all major shipping routes and inland transportation modes."
  },
  {
    question: "Is there setup or onboarding support?",
    answer: "Professional plans include email/chat onboarding. Enterprise customers get dedicated setup and training sessions."
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const structuredData = plans.slice(0, 3).map(plan => 
    createProductSchema({
      name: `Logistic Intel ${plan.name}`,
      description: plan.description,
      price: typeof plan.price.monthly === 'number' ? plan.price.monthly.toString() : "0",
      currency: "USD", 
      features: plan.features
    })
  );

  return (
    <>
      <SeoHelmet
        title="Pricing - Logistic Intel"
        description="Choose the perfect plan for your logistics business. From free trials to enterprise solutions, get access to global trade intelligence, CRM, and AI insights."
        canonical="https://logisticintel.com/pricing"
        keywords={["logistics pricing", "freight intelligence cost", "trade data subscription", "shipping analytics price"]}
      />
      {structuredData.map((data, idx) => (
        <JsonLd key={idx} data={data} />
      ))}

      <main className="bg-[#F7F8FA]">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1E39] mb-6">
            Choose Your Intelligence Level
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            From startups to enterprises, we have a plan that scales with your business needs.
            Start free, upgrade anytime.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="inline-flex items-center bg-white rounded-xl p-1 shadow">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                !isAnnual 
                  ? 'bg-[#0F4C81] text-white shadow' 
                  : 'text-slate-700 hover:text-[#0F4C81]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isAnnual 
                  ? 'bg-[#0F4C81] text-white shadow' 
                  : 'text-slate-700 hover:text-[#0F4C81]'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                        {isAnnual && typeof plan.price.annual === 'number' && typeof plan.price.monthly === 'number' && plan.price.annual < plan.price.monthly && (
                          <p className="text-sm text-green-600 mt-1">
                            Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                          </p>
                        )}
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
            <p className="text-lg text-slate-700">
              Everything you need to know about our pricing and plans
            </p>
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

        {/* Enterprise CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Large enterprises with specific requirements can work with our team to create 
              a tailored plan with custom integrations, dedicated support, and volume pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact-sales" className="inline-flex items-center rounded-xl px-6 py-3 bg-white text-[#0F4C81] 
                                                 font-semibold shadow hover:bg-slate-50 transition">
                Contact Sales Team
              </a>
              <a href="/demo" className="inline-flex items-center rounded-xl px-6 py-3 border-2 border-white 
                                        text-white font-semibold hover:bg-white hover:text-[#0F4C81] transition">
                Schedule Demo
              </a>
            </div>
          </div>
        </section>

        {/* Compliance Note */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl p-8 shadow text-center">
            <h3 className="text-lg font-semibold text-[#0B1E39] mb-4">Enterprise Security & Compliance</h3>
            <p className="text-slate-700 mb-4">
              All plans include SOC 2 Type II certification, GDPR compliance, and enterprise-grade security. 
              Enterprise plans add SSO, custom data retention, and dedicated infrastructure.
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-slate-500">
              <span>SOC 2 Certified</span>
              <span>GDPR Compliant</span>
              <span>99.9% Uptime SLA</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
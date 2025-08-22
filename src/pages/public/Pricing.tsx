import { Helmet } from 'react-helmet-async';

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing - Logistic Intel</title>
        <meta name="description" content="Choose the perfect plan for your logistics business." />
      </Helmet>

      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Choose Your Intelligence Level
            </h1>
            <p className="text-xl text-slate-600">
              Plans that scale with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['Basic search', '100 company views/mo', 'Email alerts']
              },
              {
                name: 'Pro',
                price: '$149',
                features: ['Full search', '1,500 company views/mo', 'CRM sync', 'Apollo enrichment'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited access', 'SAML SSO', 'Dedicated support']
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 ${plan.popular ? 'ring-2 ring-indigo-600' : ''}`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="text-3xl font-bold text-slate-900 mt-2">{plan.price}</div>
                  {plan.price !== 'Custom' && <div className="text-slate-600">/month</div>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
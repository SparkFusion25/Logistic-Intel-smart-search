import { SeoHelmet } from "@/components/seo/SeoHelmet";

export default function RequestDemo() {
  return (
    <>
      <SeoHelmet
        title="Request Demo - Logistic Intel"
        description="Request a personalized demo of Logistic Intel's freight intelligence platform."
        canonical="https://logisticintel.com/demo/request"
      />
      
      <main className="bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0B1E39] mb-6">
              Request a Demo
            </h1>
            <p className="text-xl text-slate-600">
              See how Logistic Intel can transform your logistics business
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1E39] mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1E39] mb-2">Company</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3"
                    placeholder="Company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1E39] mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3"
                    placeholder="work@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1E39] mb-2">Phone (optional)</label>
                  <input 
                    type="tel" 
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#0B1E39] mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3"
                  placeholder="Tell us about your logistics business and what you're looking for..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110 shadow-lg transition min-h-[48px]"
              >
                Request Demo
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                We'll get back to you within 24 hours to schedule your personalized demo.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export default function Testimonials() {
  const testimonials = [
    {
      quote: "Logistic Intel transformed how we find new clients. The company-first approach saves us hours every day.",
      author: "Sarah Chen",
      title: "VP Sales, Global Freight Solutions",
      company: "Global Freight Solutions"
    },
    {
      quote: "The trade lane analytics helped us identify $2M in new business opportunities we never knew existed.",
      author: "Marcus Rodriguez", 
      title: "Business Development Manager",
      company: "Pacific Logistics"
    },
    {
      quote: "Finally, a platform that understands logistics. The CRM integration is seamless and the data is spot-on.",
      author: "Jennifer Park",
      title: "Director of Operations",
      company: "Maritime Express"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39] mb-4">
          Trusted by logistics professionals
        </h2>
        <p className="text-lg text-slate-600">
          See what our customers are saying about their results
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="mb-4">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-slate-700 text-sm leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="font-semibold text-[#0B1E39] text-sm">{testimonial.author}</div>
              <div className="text-xs text-slate-600">{testimonial.title}</div>
              <div className="text-xs text-[#0F4C81] font-medium">{testimonial.company}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
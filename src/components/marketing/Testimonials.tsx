export default function Testimonials() {
  const testimonials = [
    {
      quote: "Logistic Intel transformed how we find new clients. The company-first approach saves us hours every day.",
      author: "Sarah Chen",
      title: "VP Sales, Global Freight Solutions"
    },
    {
      quote: "The trade lane analytics helped us identify $2M in new business opportunities we never knew existed.",
      author: "Marcus Rodriguez", 
      title: "Business Development, Pacific Logistics"
    },
    {
      quote: "Finally, a platform that understands logistics. The CRM integration is seamless and the data is spot-on.",
      author: "Jennifer Park",
      title: "Director of Operations, Maritime Express"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39]">
          Trusted by logistics professionals
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow">
            <p className="text-slate-700 mb-4">"{testimonial.quote}"</p>
            <div className="border-t pt-4">
              <div className="font-semibold text-[#0B1E39]">{testimonial.author}</div>
              <div className="text-sm text-slate-600">{testimonial.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
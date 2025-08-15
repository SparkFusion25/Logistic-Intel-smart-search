import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import { Star } from "lucide-react";

export const ProofSection = () => {
  const testimonials = [
    {
      quote: "LOGISTIC INTEL transformed our prospecting process. We're finding high-value prospects 3x faster than before.",
      author: "Sarah Martinez",
      title: "VP of Sales",
      company: "Global Freight Solutions",
      rating: 5
    },
    {
      quote: "The contact accuracy is incredible. 94% of emails are verified and active. Best ROI we've ever had on a sales tool.",
      author: "Michael Chen",
      title: "Business Development Director", 
      company: "Pacific Trade Corp",
      rating: 5
    },
    {
      quote: "Having real-time trade data at our fingertips gives us a massive competitive advantage in negotiations.",
      author: "Emma Thompson",
      title: "Chief Revenue Officer",
      company: "Atlantic Logistics",
      rating: 5
    }
  ];

  const trustedBy = [
    "Fortune 500 Freight Forwarders",
    "Leading 3PL Providers", 
    "Global Shipping Lines",
    "Trade Finance Banks",
    "Customs Brokers",
    "Supply Chain Consultants"
  ];

  return (
    <section className="py-20 bg-elevated">
      <Container>
        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-text-on-dark mb-4">
            Trusted by industry leaders
          </h2>
          <p className="text-xl text-text-on-dark/70 max-w-3xl mx-auto">
            Join thousands of freight professionals who rely on LOGISTIC INTEL for their growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-enterprise">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <blockquote className="text-text-dark/80 mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border-glass pt-4">
                  <div className="font-semibold text-text-dark">{testimonial.author}</div>
                  <div className="text-sm text-muted-text">{testimonial.title}</div>
                  <div className="text-sm text-brand font-medium">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trusted By */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text-on-dark mb-8">
            Trusted by leading organizations across the trade ecosystem
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustedBy.map((category, index) => (
              <Badge 
                key={index}
                className="bg-surface/10 text-text-on-dark border-border-glass hover:bg-surface/20 py-2 px-4"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
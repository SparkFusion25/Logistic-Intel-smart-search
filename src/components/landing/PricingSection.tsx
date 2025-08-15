import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      popular: false,
      features: [
        "Search with basic fields",
        "Masked contact details",
        "Add to CRM (no enrichment)",
        "Campaigns ≤ 10/day",
        "Basic widgets access",
        "Limited benchmark data"
      ],
      limitations: [
        "No enrichment",
        "No quote export",
        "Basic support"
      ]
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      description: "For growing freight teams",
      popular: true,
      features: [
        "Everything in Free",
        "Full contact enrichment",
        "Unlimited search & widgets",
        "Quote generation & export",
        "Email tracking & analytics",
        "Market benchmark access",
        "Priority support",
        "1 team seat"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations",
      popular: false,
      features: [
        "Everything in Pro",
        "Unlimited team seats",
        "Bulk data import/export",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated success manager",
        "SLA guarantees",
        "Custom workflows"
      ],
      limitations: []
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core search and CRM features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative bg-card/80 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-primary/10 hover:bg-primary/20 text-primary'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Included features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-4 h-4 text-accent mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="font-medium text-card-foreground">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <div className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0">
                            <div className="w-1 h-4 bg-muted-foreground/30 rounded-full mx-auto" />
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-foreground/60">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
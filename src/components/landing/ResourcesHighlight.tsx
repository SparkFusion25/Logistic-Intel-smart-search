import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import { ArrowRight, BookOpen, TrendingUp, Users } from "lucide-react";

export const ResourcesHighlight = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Trade Intelligence Guide",
      description: "Complete guide to leveraging trade data for B2B sales success. Learn proven strategies from industry experts.",
      category: "Guide",
      readTime: "15 min read",
      featured: true
    },
    {
      icon: TrendingUp,
      title: "Market Trends Report", 
      description: "Q4 2024 global freight market analysis with key insights and predictions for the coming year.",
      category: "Report",
      readTime: "8 min read",
      featured: false
    },
    {
      icon: Users,
      title: "Customer Success Stories",
      description: "See how leading freight forwarders are using LOGISTIC INTEL to drive 300% growth in new business.",
      category: "Case Study",
      readTime: "12 min read", 
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-canvas">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-h2 text-text-on-dark mb-4">
            Learn from the experts
          </h2>
          <p className="text-xl text-text-on-dark/70 max-w-3xl mx-auto">
            Get insights, strategies, and market intelligence to stay ahead of the competition.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card 
                key={index} 
                className={`card-enterprise hover:scale-105 transition-all duration-300 group cursor-pointer ${
                  resource.featured ? 'ring-2 ring-brand/20' : ''
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-brand" />
                    </div>
                    {resource.featured && (
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-surface/10 text-text-dark border-border-glass text-xs">
                        {resource.category}
                      </Badge>
                      <span className="text-sm text-muted-text">{resource.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-dark group-hover:text-brand transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-text-dark/70">
                      {resource.description}
                    </p>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-brand hover:bg-brand/10 group-hover:bg-brand/20"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-border-glass text-text-on-dark hover:bg-surface/10 px-8 py-3"
          >
            View All Resources
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
};
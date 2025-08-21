import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Mail, Target } from 'lucide-react';

type FeaturedCard = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

export function CRMFeaturedCards() {
  const cards: FeaturedCard[] = [
    {
      title: 'Active Leads',
      value: 127,
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: '24.3%',
      change: '+5.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Emails Sent',
      value: 1847,
      change: '+18%',
      changeType: 'increase',
      icon: Mail,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Qualified Prospects',
      value: 89,
      change: '+7%',
      changeType: 'increase',
      icon: Target,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              {card.change && (
                <div className={`text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 
                  card.changeType === 'decrease' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {card.change}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {card.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import { Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// This would typically come from user metadata or a separate user_plans table
const getCurrentPlan = () => {
  // Placeholder - in real app, this would come from Supabase user metadata
  return 'free'; // 'free' | 'pro' | 'enterprise'
};

export default function PlanBadge() {
  const plan = getCurrentPlan();

  const planConfig = {
    free: {
      name: 'Free',
      icon: Zap,
      bgColor: 'bg-slate-600',
      textColor: 'text-slate-300',
      upgradeText: 'Upgrade to Pro'
    },
    pro: {
      name: 'Pro',
      icon: Crown,
      bgColor: 'bg-indigo-600',
      textColor: 'text-white',
      upgradeText: 'Manage Plan'
    },
    enterprise: {
      name: 'Enterprise',
      icon: Crown,
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      upgradeText: 'Manage Plan'
    }
  };

  const config = planConfig[plan as keyof typeof planConfig];
  const IconComponent = config.icon;

  return (
    <div className="space-y-2">
      {/* Plan badge */}
      <div className={`${config.bgColor} rounded-xl p-3 flex items-center gap-2`}>
        <IconComponent className={`h-4 w-4 ${config.textColor}`} />
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.name} Plan
        </span>
      </div>

      {/* Live data indicator */}
      <div className="bg-green-600 rounded-xl p-2 flex items-center gap-2">
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-white">
          Live Data
        </span>
      </div>

      {/* Upgrade button for free users */}
      {plan === 'free' && (
        <Link
          to="/pricing"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-3 rounded-xl text-sm font-medium transition-colors"
        >
          {config.upgradeText}
        </Link>
      )}
    </div>
  );
}
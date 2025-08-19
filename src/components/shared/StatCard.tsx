import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: LucideIcon
  color?: string
  trend?: 'up' | 'down'
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon, 
  color = 'from-sky-400 to-blue-500',
  trend = 'up' 
}: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-card-border p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {change && (
            <div className="flex items-center">
              {trend === 'up' && (
                <svg className="w-3 h-3 text-emerald-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span className={`text-xs font-medium ${
                changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}
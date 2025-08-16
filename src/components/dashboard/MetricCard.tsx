import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: {
    value: string
    type: 'increase' | 'decrease'
  }
  icon?: React.ReactNode
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
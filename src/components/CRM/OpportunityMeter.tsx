import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target } from "lucide-react";

interface OpportunityMeterProps {
  score: number;
  className?: string;
}

export function OpportunityMeter({ score, className = "" }: OpportunityMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium">Opportunity Score</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">
              {getScoreLabel(score)}
            </span>
          </div>
          
          <Progress value={score} className="h-2" />
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Based on engagement and stage velocity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface LeadScoreChipProps {
  score: number;
  className?: string;
}

export function LeadScoreChip({ score, className = "" }: LeadScoreChipProps) {
  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default"; // Green
    if (score >= 60) return "secondary"; // Yellow  
    return "outline"; // Low score
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🔥";
    if (score >= 60) return "⭐";
    return "💤";
  };

  return (
    <Badge 
      variant={getScoreVariant(score)} 
      className={`flex items-center gap-1 ${className}`}
    >
      <span>{getScoreIcon(score)}</span>
      <span className="text-xs font-medium">{score}</span>
    </Badge>
  );
}
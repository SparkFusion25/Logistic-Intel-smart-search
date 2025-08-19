"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface ConfidenceIndicatorProps {
  score?: number | null; // 0–100 scale
  mode?: "air" | "ocean" | "all";
  label?: string;
  className?: string;
}

export function ConfidenceIndicator({
  score,
  mode = "all",
  label,
  className,
}: ConfidenceIndicatorProps) {
  if (score == null) return null;

  const getColor = (val: number) => {
    if (val >= 80) return "bg-green-500 text-white";
    if (val >= 50) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const getIcon = (val: number) => {
    if (val >= 50) return <ShieldCheck className="w-4 h-4 mr-1" />;
    return <AlertTriangle className="w-4 h-4 mr-1" />;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm",
        getColor(score),
        className
      )}
    >
      {getIcon(score)}
      <span>
        {label
          ? label
          : `Confidence ${mode !== "all" ? mode.toUpperCase() : ""}: ${score}%`}
      </span>
    </div>
  );
}

export default ConfidenceIndicator;

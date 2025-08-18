import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-[var(--container-max)]"
};

export default function Container({ 
  children, 
  className,
  size = "full"
}: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8 w-full",
      containerSizes[size],
      className
    )}>
      {children}
    </div>
  );
}
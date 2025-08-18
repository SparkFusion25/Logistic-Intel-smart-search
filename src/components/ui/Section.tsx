import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Container from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  background?: "default" | "elevated" | "subtle" | "glass";
  spacing?: "sm" | "md" | "lg" | "xl";
}

const backgroundVariants = {
  default: "bg-background",
  elevated: "bg-card",
  subtle: "bg-muted",
  glass: "bg-glass-bg backdrop-blur-[var(--glass-backdrop)] border-y border-border/30"
};

const spacingVariants = {
  sm: "py-12",
  md: "py-16", 
  lg: "py-20",
  xl: "py-24"
};

export function Section({ 
  children, 
  className,
  containerSize = "full",
  background = "default",
  spacing = "lg"
}: SectionProps) {
  return (
    <section className={cn(
      backgroundVariants[background],
      spacingVariants[spacing],
      className
    )}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
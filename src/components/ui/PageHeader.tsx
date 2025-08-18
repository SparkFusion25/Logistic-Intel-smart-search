import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  gradient?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  className,
  actions,
  gradient = false
}: PageHeaderProps) {
  const containerClasses = gradient 
    ? "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 p-6 sm:p-8"
    : "pb-6 border-b border-border";

  return (
    <div className={cn("mb-8", className)}>
      <div className={containerClasses}>
        {gradient && (
          <>
            {/* Background patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
          </>
        )}
        
        <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", gradient ? "relative z-10" : "")}>
          <div className="min-w-0 flex-1">
            <h1 className={cn(
              "text-3xl font-bold tracking-tight",
              gradient ? "text-white" : "text-foreground"
            )}>
              {title}
            </h1>
            {description && (
              <p className={cn(
                "mt-2 text-sm sm:text-base max-w-2xl",
                gradient ? "text-white/80" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
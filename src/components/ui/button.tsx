import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius-button)] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[var(--radius-button)] shadow-md hover:shadow-lg",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-[var(--radius-button)] hover:border-primary/50 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-[var(--radius-button)] shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[var(--radius-button)] hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline rounded-[var(--radius-button)]",
        premium: "bg-gradient-to-r from-brand to-accent-primary text-white hover:from-brand-hover hover:to-accent-muted rounded-[var(--radius-button)] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        glass: "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-[var(--radius-button)] shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base font-semibold",
        xl: "h-14 px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon, 
    onRightIconClick,
    variant = 'default',
    inputSize = 'md',
    ...props 
  }, ref) => {
    const baseClasses = "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      default: "border border-input bg-background hover:border-muted-foreground/50",
      filled: "bg-muted border border-transparent hover:bg-muted/80",
      outline: "border-2 border-border bg-transparent hover:border-muted-foreground/50"
    }
    
    const sizes = {
      sm: "px-3 py-2 text-sm rounded-md",
      md: "px-4 py-2.5 text-sm rounded-lg",
      lg: "px-5 py-3 text-base rounded-xl"
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}
          
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              LeftIcon && "pl-10",
              RightIcon && "pr-10",
              error && "border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          />
          
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
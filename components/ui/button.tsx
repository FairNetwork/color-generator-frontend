import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const variantStyles: Record<
  "default" | "outline" | "secondary" | "ghost",
  string
> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
}

const sizeStyles: Record<"default" | "sm" | "icon", string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3",
  icon: "h-9 w-9 p-0",
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

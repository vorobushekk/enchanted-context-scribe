import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const magicalButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        magical: "bg-gradient-magical text-primary-foreground hover:shadow-sparkle hover:scale-105 active:scale-95 duration-magical",
        enchanted: "bg-primary-glow text-primary-dark border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-magical duration-magical",
        sparkle: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-sparkle duration-magical"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "magical",
      size: "default",
    },
  }
)

export interface MagicalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof magicalButtonVariants> {
  asChild?: boolean
}

const MagicalButton = React.forwardRef<HTMLButtonElement, MagicalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(magicalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
MagicalButton.displayName = "MagicalButton"

export { MagicalButton, magicalButtonVariants }
import * as React from "react"
import { cn } from "@/lib/utils"

// Change 'function Input' to 'const Input = React.forwardRef...'
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("...", className)}
        ref={ref} // Attach the ref here
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }
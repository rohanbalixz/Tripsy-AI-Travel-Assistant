import * as React from "react"
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className="", ...props }, ref) => (
    <input ref={ref} className={`w-full rounded-xl border border-black/10 px-4 py-2 outline-none focus:ring-2 focus:ring-teal ${className}`} {...props}/>
  )
)
Input.displayName = "Input"

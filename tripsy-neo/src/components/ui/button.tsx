import * as React from "react"
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"primary"; size?: "sm"|"md"|"lg" }
export const Button = ({ className="", variant="default", size="md", ...props }: Props) => {
  const v = variant==="primary" ? "bg-teal text-white hover:opacity-90" : "bg-white text-ink hover:bg-white/90"
  const s = size==="sm" ? "px-3 py-2 text-sm rounded-xl" : size==="lg" ? "px-6 py-3 text-base rounded-2xl" : "px-4 py-2 rounded-xl"
  return <button className={`inline-flex items-center justify-center font-medium shadow-soft ${v} ${s} ${className}`} {...props}/>
}

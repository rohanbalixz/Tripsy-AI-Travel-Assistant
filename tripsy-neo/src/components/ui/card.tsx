import * as React from "react"
export const Card = ({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={`rounded-2xl shadow-soft ${className}`} {...props}/>
export const CardContent = ({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={`p-4 ${className}`} {...props}/>

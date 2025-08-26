import clsx from "clsx"
export function Bubble({ children, mine=false }: { children: React.ReactNode; mine?: boolean }) {
  return (
    <div className={clsx("max-w-[80%] rounded-2xl px-4 py-2 text-[15px] leading-snug shadow-soft",
      mine ? "ml-auto bg-chatgreen text-white" : "bg-bubble text-ink")}>
      {children}
    </div>
  )
}

import { cn } from "@/lib/utils"

export function Tag({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode
  className?: string
  tone?: "muted" | "status"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        tone === "status"
          ? "border-status/25 bg-status/10 text-status"
          : "tech-pill border",
        className
      )}
    >
      {children}
    </span>
  )
}

export function SectionChip({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <h2
      id={id}
      className="section-glass relative mb-5 inline-flex items-center overflow-hidden rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight text-foreground"
    >
      <span aria-hidden className="section-glass-base" />
      <span className="relative z-10">{children}</span>
    </h2>
  )
}

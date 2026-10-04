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
          : "border-border bg-muted/70 text-muted-foreground",
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

export function InlineLinkPill({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:")
  return (
    <a
      href={href}
      target={external && !href.startsWith("mailto:") ? "_blank" : undefined}
      rel={external && !href.startsWith("mailto:") ? "noopener noreferrer" : undefined}
      className="mx-0.5 inline-flex -translate-y-px items-center rounded-full border border-border bg-muted/80 px-2 py-0.5 text-[12px] font-medium text-foreground no-underline transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </a>
  )
}

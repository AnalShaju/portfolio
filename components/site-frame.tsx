import { cn } from "@/lib/utils"

export function SiteFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "site-frame relative mx-auto flex min-h-full w-full max-w-4xl flex-col border-x border-dashed border-black/10 dark:border-white/[0.1]",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-7px] left-[-6px] z-20 text-[11px] leading-none text-muted-foreground/50 select-none"
      >
        +
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-7px] right-[-6px] z-20 text-[11px] leading-none text-muted-foreground/50 select-none"
      >
        +
      </span>

      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  )
}

export function SectionRule() {
  return (
    <div
      aria-hidden
      className="w-full border-t border-dashed border-black/10 dark:border-white/[0.1]"
    />
  )
}

/** Swap these anytime — quote section content. */
const QUOTE_LINES = [
  "The best way to predict the future",
  "is to invent it.",
] as const
const ATTRIBUTION = "Alan Kay"
const CLOSING = "Keep building."

export function QuoteSection() {
  return (
    <section
      aria-label="Quote"
      className="flex flex-col items-center px-2 py-10 text-center sm:py-14"
    >
      <blockquote className="m-0 max-w-[22rem] text-[1.25rem] font-medium leading-[1.35] tracking-tight text-foreground sm:max-w-[28rem] sm:text-[1.375rem] sm:leading-[1.32]">
        {QUOTE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </blockquote>

      <cite className="mt-5 block text-[13px] not-italic text-muted-foreground sm:mt-6">
        — {ATTRIBUTION}
      </cite>

      <p className="mt-8 text-[11px] tracking-wide text-muted-foreground/65 sm:mt-10">
        {CLOSING}
      </p>
    </section>
  )
}

/** Swap these anytime — quote section content. */
const QUOTE_LINES = [
  "The best way to predict the future",
  "is to invent it.",
] as const
const ATTRIBUTION = "Alan Kay"

export function QuoteSection() {
  return (
    <section
      aria-label="Quote"
      className="flex flex-col items-center py-12 text-center sm:py-16"
    >
      <blockquote className="m-0 max-w-[48rem] text-[1.75rem] font-medium leading-[1.2] tracking-tight text-foreground min-[380px]:text-[2rem] sm:text-[2.75rem] sm:leading-[1.15] md:text-[3.25rem] md:leading-[1.12]">
        <span className="block">
          <span aria-hidden className="text-foreground/40">
            &ldquo;
          </span>
          {QUOTE_LINES[0]}
        </span>
        <span className="block">
          {QUOTE_LINES[1]}
          <span aria-hidden className="text-foreground/40">
            &rdquo;
          </span>
        </span>
      </blockquote>

      <cite className="mt-6 block text-[14px] not-italic text-muted-foreground sm:mt-7 sm:text-[15px]">
        — {ATTRIBUTION}
      </cite>
    </section>
  )
}

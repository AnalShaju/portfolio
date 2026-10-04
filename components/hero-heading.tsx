"use client"

import { useEffect, useState } from "react"

const PHRASES = ["I build things.", "I build products.", "I build tools."] as const
const LONGEST = "I build products."
const STATIC_FALLBACK = "I build things."

const START_DELAY_MS = 400
const TYPE_MS = 70
const HOLD_MS = 2000
const DELETE_MS = 40
const GAP_MS = 500

export function HeroHeading() {
  const [typed, setTyped] = useState("")
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return

    let cancelled = false
    let timer: number | undefined
    let phraseIndex = 0

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms)
      })

    const run = async () => {
      setShowCursor(true)
      await wait(START_DELAY_MS)
      if (cancelled) return

      while (!cancelled) {
        const phrase = PHRASES[phraseIndex]

        for (let i = 1; i <= phrase.length; i += 1) {
          if (cancelled) return
          setTyped(phrase.slice(0, i))
          await wait(TYPE_MS)
        }

        if (cancelled) return
        await wait(HOLD_MS)
        if (cancelled) return

        for (let i = phrase.length - 1; i >= 0; i -= 1) {
          if (cancelled) return
          setTyped(phrase.slice(0, i))
          await wait(DELETE_MS)
        }

        if (cancelled) return
        await wait(GAP_MS)
        phraseIndex = (phraseIndex + 1) % PHRASES.length
      }
    }

    void run()

    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  return (
    <h1 className="text-[1.75rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.08]">
      Hey, I&apos;m Anal Shaju.
      <br />
      <span className="relative inline-block">
        <span aria-hidden className="invisible select-none">
          {LONGEST}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 whitespace-pre motion-reduce:hidden"
        >
          {typed}
          {showCursor ? (
            <span className="hero-type-cursor ml-[0.06em] inline-block translate-y-px">
              |
            </span>
          ) : null}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 hidden whitespace-pre motion-reduce:inline"
        >
          {STATIC_FALLBACK}
        </span>
        <span className="sr-only">{STATIC_FALLBACK}</span>
      </span>
    </h1>
  )
}

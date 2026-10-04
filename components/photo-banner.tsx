"use client"

import { useRef } from "react"

export function PhotoBanner() {
  const litRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  const place = (e: React.PointerEvent<HTMLDivElement>) => {
    const lit = litRef.current
    if (!lit) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      lit.style.setProperty("--dot-x", `${x}px`)
      lit.style.setProperty("--dot-y", `${y}px`)
      frame.current = null
    })
  }

  const handleEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const lit = litRef.current
    if (!lit || e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    // Snap the glow to the entry point so it doesn't sweep in from off-screen.
    lit.style.transition = "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)"
    lit.style.setProperty("--dot-x", `${e.clientX - rect.left}px`)
    lit.style.setProperty("--dot-y", `${e.clientY - rect.top}px`)
    lit.dataset.active = "true"
    requestAnimationFrame(() => {
      lit.style.transition = ""
    })
  }

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    place(e)
  }

  const handleLeave = () => {
    if (litRef.current) litRef.current.dataset.active = "false"
  }

  return (
    <div
      aria-hidden
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="dot-banner relative mx-auto h-[140px] w-full overflow-hidden rounded-lg border sm:h-[160px]"
    >
      <div className="dot-banner-grid" />
      <div ref={litRef} data-active="false" className="dot-banner-lit" />
    </div>
  )
}

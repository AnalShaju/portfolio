"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import type { MotionProps, MotionStyle } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_MAX_SCALE = 1.5
/* Movement (px) before a touch press counts as a scrub rather than a tap */
const DRAG_THRESHOLD = 8
/* Window after a scrub ends during which the trailing click is swallowed */
const CLICK_SUPPRESS_MS = 400

/* Apple critically-damped springs — settle smoothly, no bounce (response ~0.35s) */
const iconSpring = { stiffness: 420, damping: 38, mass: 0.7, restDelta: 0.001 }
const lensSpring = { stiffness: 380, damping: 36, mass: 0.75 }
const lensFade = { stiffness: 280, damping: 34, mass: 0.6 }

/*
 * Inline backdrop-filter as a Chromium/embed fallback (some hosts strip
 * prefixed rules from stylesheets). Theme-specific blur still wins via
 * CSS !important on .dock-glass-base / .dark .dock-glass-base.
 */
const glassStyle: React.CSSProperties = {
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  backdropFilter: "blur(28px) saturate(180%)",
}

export interface DockProps {
  className?: string
  /** Scale of the icon nearest the pointer. */
  maxScale?: number
  /** Pointer/touch magnification and lens. Disable for reduced motion. */
  interactive?: boolean
  /** Press-down scale on click. */
  pressable?: boolean
  children: React.ReactNode
}

type TouchPress = { id: number; startX: number; dragged: boolean }

function Dock({
  className,
  children,
  maxScale = DEFAULT_MAX_SCALE,
  interactive = true,
  pressable = true,
}: DockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(Infinity)
  const lensX = useMotionValue(0)
  const lensXSpring = useSpring(lensX, lensSpring)
  const lensOpacity = useSpring(0, lensFade)
  const [lensOn, setLensOn] = useState(false)
  const offTimer = useRef<number | undefined>(undefined)
  const press = useRef<TouchPress | null>(null)
  const suppressClickUntil = useRef(0)

  useEffect(() => () => window.clearTimeout(offTimer.current), [])

  const engage = () => {
    window.clearTimeout(offTimer.current)
    if (!lensOn) setLensOn(true)
    lensOpacity.set(1)
  }

  const track = (clientX: number) => {
    pointerX.set(clientX)
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    if (lensOpacity.get() < 0.05) lensXSpring.jump(x)
    lensX.set(x)
  }

  const release = () => {
    pointerX.set(Infinity)
    lensOpacity.set(0)
    window.clearTimeout(offTimer.current)
    offTimer.current = window.setTimeout(() => setLensOn(false), 320)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType === "mouse") return
    press.current = { id: e.pointerId, startX: e.clientX, dragged: false }
    engage()
    track(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    if (e.pointerType === "mouse") {
      engage()
      track(e.clientX)
      return
    }
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    if (!p.dragged && Math.abs(e.clientX - p.startX) > DRAG_THRESHOLD) {
      p.dragged = true
    }
    track(e.clientX)
  }

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    if (p.dragged) suppressClickUntil.current = performance.now() + CLICK_SUPPRESS_MS
    press.current = null
    release()
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") release()
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (performance.now() < suppressClickUntil.current) {
      e.preventDefault()
      e.stopPropagation()
      suppressClickUntil.current = 0
    }
  }

  const rendered = React.Children.map(children, (child) => {
    if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
      return React.cloneElement(child, {
        ...child.props,
        pointerX,
        maxScale,
        disableMagnification: !interactive,
        pressable,
      })
    }
    return child
  })

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerLeave}
      onClickCapture={handleClickCapture}
      className={cn(
        "relative flex touch-none items-center rounded-full select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]",
        className
      )}
    >
      <div aria-hidden className="dock-glass-base" style={glassStyle} />
      {interactive ? (
        <motion.div
          aria-hidden
          data-on={lensOn}
          className="dock-lens"
          style={{ x: lensXSpring, opacity: lensOpacity }}
        />
      ) : null}
      {rendered}
    </div>
  )
}

Dock.displayName = "Dock"

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  maxScale?: number
  disableMagnification?: boolean
  pointerX?: MotionValue<number>
  pressable?: boolean
  active?: boolean
  className?: string
  children?: React.ReactNode
}

function DockIcon({
  maxScale = DEFAULT_MAX_SCALE,
  disableMagnification,
  pointerX,
  pressable = true,
  active = false,
  className,
  children,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const idleX = useMotionValue(Infinity)

  // Halves with every slot-width of distance: ~1.5 → ~1.25 → ~1.1 → 1.
  const scaleTarget = useTransform(pointerX ?? idleX, (x: number) => {
    if (disableMagnification || !Number.isFinite(x) || !ref.current) return 1
    const { left, width } = ref.current.getBoundingClientRect()
    if (width === 0) return 1
    const falloff = Math.pow(0.5, Math.abs(x - left - width / 2) / width)
    return falloff < 0.04 ? 1 : 1 + (maxScale - 1) * falloff
  })

  const iconScale = useSpring(scaleTarget, iconSpring)

  return (
    <motion.div
      ref={ref}
      style={{ "--dock-icon-scale": iconScale } as unknown as MotionStyle}
      whileTap={pressable ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className={cn(
        "dock-item relative z-[2] flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full",
        disableMagnification &&
          "hover:bg-black/[0.05] dark:hover:bg-white/[0.07]",
        className
      )}
      {...props}
    >
      {active ? <span aria-hidden className="dock-active-pill" /> : null}
      <div className="flex size-full items-center justify-center">{children}</div>
    </motion.div>
  )
}

DockIcon.displayName = "DockIcon"

export { Dock, DockIcon }

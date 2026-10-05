"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
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
/* Falloff per slot of distance — neighbours get a small lift, the rest none */
const FALLOFF_BASE = 0.3
/* Boost below this fraction fades to zero so far icons rest at exactly 1 */
const FALLOFF_FLOOR = 0.05
/* Movement (px) before a press becomes a selector drag rather than a tap */
const DRAG_THRESHOLD = 8
/* Vertical slack (px) around the dock where a release still selects */
const RELEASE_SLACK = 16
/* Window after a drag ends during which the trailing native click is swallowed */
const CLICK_SUPPRESS_MS = 400

/* Apple critically-damped springs — settle smoothly, no bounce */
const iconSpring = { stiffness: 380, damping: 34, mass: 0.6, restDelta: 0.001 }
const selectorSpring = { stiffness: 520, damping: 40, mass: 0.6 }
const selectorFade = { stiffness: 320, damping: 32, mass: 0.6 }

/*
 * Inline backdrop-filter as a Chromium/embed fallback (some hosts strip
 * prefixed rules from stylesheets). Theme-specific blur still wins via
 * CSS !important on .dock-glass-base / .dark .dock-glass-base.
 */
const glassStyle: React.CSSProperties = {
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  backdropFilter: "blur(28px) saturate(180%)",
}

type ScaleAt = (index: number, x: number) => number

export interface DockProps {
  className?: string
  /** Scale of the icon under the selector / pointer. */
  maxScale?: number
  /** Drag selector and magnification. Disable for reduced motion. */
  interactive?: boolean
  /** Press-down scale on click. */
  pressable?: boolean
  children: React.ReactNode
}

type Press = {
  id: number
  pointerType: string
  startX: number
  dragged: boolean
}

function Dock({
  className,
  children,
  maxScale = DEFAULT_MAX_SCALE,
  interactive = true,
  pressable = true,
}: DockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(Infinity)
  const selectorX = useMotionValue(0)
  const selectorXSpring = useSpring(selectorX, selectorSpring)
  const selectorOpacity = useSpring(0, selectorFade)
  const selectorScale = useSpring(0.9, selectorFade)
  const [selecting, setSelecting] = useState(false)
  const offTimer = useRef<number | undefined>(undefined)
  const press = useRef<Press | null>(null)
  const suppressClickUntil = useRef(0)
  const allowClick = useRef(false)
  const centers = useRef<number[]>([])
  const pitch = useRef(0)

  useEffect(() => () => window.clearTimeout(offTimer.current), [])

  const items = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-dock-item]") ?? [])

  const measure = () => {
    const els = items()
    if (!els.length) return
    centers.current = els.map((el) => {
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2
    })
    const c = centers.current
    pitch.current =
      c.length > 1 ? (c[c.length - 1] - c[0]) / (c.length - 1) : els[0].offsetWidth
  }

  const scaleAt = useCallback<ScaleAt>(
    (index, x) => {
      const center = centers.current[index]
      if (!Number.isFinite(x) || center === undefined || pitch.current <= 0) return 1
      const f = Math.pow(FALLOFF_BASE, Math.abs(x - center) / pitch.current)
      const boost = Math.max(0, (f - FALLOFF_FLOOR) / (1 - FALLOFF_FLOOR))
      return 1 + (maxScale - 1) * boost
    },
    [maxScale]
  )

  /* Keep the selector fully on the dock's glass. */
  const clampX = (clientX: number, rect: DOMRect) => {
    const half = (selectorRef.current?.offsetWidth ?? 0) / 2 + 4
    return Math.min(Math.max(clientX, rect.left + half), rect.right - half)
  }

  const isOverDock = (e: React.PointerEvent, rect: DOMRect) =>
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top - RELEASE_SLACK &&
    e.clientY <= rect.bottom + RELEASE_SLACK

  const nearestIndex = (x: number) => {
    let best = -1
    let bestD = Infinity
    centers.current.forEach((c, i) => {
      const d = Math.abs(x - c)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  }

  const showSelector = (x: number) => {
    window.clearTimeout(offTimer.current)
    setSelecting(true)
    selectorXSpring.jump(x)
    selectorX.set(x)
    selectorOpacity.set(1)
    selectorScale.set(1)
  }

  const hideSelector = () => {
    selectorOpacity.set(0)
    selectorScale.set(0.9)
    window.clearTimeout(offTimer.current)
    offTimer.current = window.setTimeout(() => setSelecting(false), 320)
  }

  const activate = (index: number) => {
    const target = items()[index]?.querySelector<HTMLElement>("a, button")
    if (!target) return
    allowClick.current = true
    target.click()
    allowClick.current = false
  }

  const endPress = (e: React.PointerEvent<HTMLDivElement>, commit: boolean) => {
    const p = press.current
    if (!p || p.id !== e.pointerId) return
    press.current = null
    if (ref.current?.hasPointerCapture(e.pointerId)) {
      ref.current.releasePointerCapture(e.pointerId)
    }
    if (!p.dragged) return

    suppressClickUntil.current = performance.now() + CLICK_SUPPRESS_MS
    hideSelector()
    const rect = ref.current?.getBoundingClientRect()
    const over = rect ? isOverDock(e, rect) : false
    pointerX.set(over && p.pointerType === "mouse" ? e.clientX : Infinity)
    if (commit && over && rect) activate(nearestIndex(clampX(e.clientX, rect)))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !e.isPrimary) return
    if (e.pointerType === "mouse" && e.button !== 0) return
    press.current = {
      id: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      dragged: false,
    }
    measure()
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    const p = press.current
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    if (p && p.id === e.pointerId) {
      if (!p.dragged) {
        if (Math.abs(e.clientX - p.startX) <= DRAG_THRESHOLD) return
        p.dragged = true
        // Own the gesture from here on, whichever item received the press.
        ref.current?.setPointerCapture(e.pointerId)
        showSelector(clampX(e.clientX, rect) - rect.left)
      }
      const x = clampX(e.clientX, rect)
      const over = isOverDock(e, rect)
      selectorX.set(x - rect.left)
      selectorOpacity.set(over ? 1 : 0.45)
      pointerX.set(over ? x : Infinity)
      return
    }

    if (e.pointerType === "mouse" && !press.current) {
      if (!centers.current.length) measure()
      pointerX.set(e.clientX)
    }
  }

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactive && e.pointerType === "mouse") measure()
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && !press.current) pointerX.set(Infinity)
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (allowClick.current) return
    if (performance.now() < suppressClickUntil.current) {
      e.preventDefault()
      e.stopPropagation()
      suppressClickUntil.current = 0
    }
  }

  // Long-press menus and native link drags would cancel the pointer mid-drag.
  const preventDuringPress = (e: React.SyntheticEvent) => {
    if (press.current || e.type === "dragstart") e.preventDefault()
  }

  let index = 0
  const rendered = React.Children.map(children, (child) => {
    if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
      return React.cloneElement(child, {
        ...child.props,
        index: index++,
        pointerX,
        scaleAt,
        disableMagnification: !interactive,
        pressable,
      })
    }
    return child
  })

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => endPress(e, true)}
      onPointerCancel={(e) => endPress(e, false)}
      onPointerLeave={handlePointerLeave}
      onClickCapture={handleClickCapture}
      onContextMenu={preventDuringPress}
      onDragStart={preventDuringPress}
      className={cn(
        "dock relative flex touch-none items-center rounded-full select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]",
        className
      )}
    >
      <div aria-hidden className="dock-glass-base" style={glassStyle} />
      {rendered}
      {interactive ? (
        <motion.div
          ref={selectorRef}
          aria-hidden
          data-active={selecting}
          className="dock-selector"
          style={{ x: selectorXSpring, scale: selectorScale, opacity: selectorOpacity }}
        />
      ) : null}
    </div>
  )
}

Dock.displayName = "Dock"

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  index?: number
  scaleAt?: ScaleAt
  disableMagnification?: boolean
  pointerX?: MotionValue<number>
  pressable?: boolean
  active?: boolean
  className?: string
  children?: React.ReactNode
}

const restScale: ScaleAt = () => 1

function DockIcon({
  index = 0,
  scaleAt = restScale,
  disableMagnification,
  pointerX,
  pressable = true,
  active = false,
  className,
  children,
  ...props
}: DockIconProps) {
  const idleX = useMotionValue(Infinity)
  const scaleTarget = useTransform(pointerX ?? idleX, (x: number) =>
    disableMagnification ? 1 : scaleAt(index, x)
  )
  const iconScale = useSpring(scaleTarget, iconSpring)

  return (
    <motion.div
      data-dock-item
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

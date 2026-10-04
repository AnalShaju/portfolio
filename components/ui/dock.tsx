"use client"

import React, { useEffect, useRef, useState, type PropsWithChildren } from "react"
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import type { MotionProps, MotionStyle } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_SIZE = 34
const DEFAULT_MAGNIFICATION = 46
const DEFAULT_DISTANCE = 110
const LENS_SIZE = 50

/* Apple critically-damped springs — settle smoothly, no bounce (response ~0.35s) */
const iconSpring = { stiffness: 420, damping: 38, mass: 0.7 }
const lensSpring = { stiffness: 380, damping: 36, mass: 0.75 }
const lensFade = { stiffness: 280, damping: 34, mass: 0.6 }

/*
 * Inline backdrop-filter as a Chromium/embed fallback (some hosts strip
 * prefixed rules from stylesheets). Theme-specific blur still wins via
 * CSS !important on .dock-glass-base / .dark .dock-glass-base.
 */
const glassStyle: React.CSSProperties = {
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  backdropFilter: "blur(20px) saturate(180%)",
}

export interface DockProps {
  className?: string
  iconSize?: number
  iconMagnification?: number
  iconDistance?: number
  /** Cursor magnification, lens and refraction. Disable for touch / reduced motion. */
  interactive?: boolean
  /** Press-down scale on tap/click. */
  pressable?: boolean
  children: React.ReactNode
}

function Dock({
  className,
  children,
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
  interactive = true,
  pressable = true,
}: DockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(Infinity)
  const lensTarget = useMotionValue(0)
  const lensX = useSpring(lensTarget, lensSpring)
  const lensOffset = useTransform(lensX, (v) => v - LENS_SIZE / 2)
  const lensOpacity = useSpring(0, lensFade)
  const [lensOn, setLensOn] = useState(false)
  const offTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(offTimer.current), [])

  const handleEnter = () => {
    if (!interactive) return
    window.clearTimeout(offTimer.current)
    setLensOn(true)
    lensOpacity.set(1)
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    if (!lensOn) handleEnter()
    mouseX.set(e.clientX)
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    if (lensOpacity.get() < 0.05) lensX.jump(x)
    lensTarget.set(x)
  }

  const handleLeave = () => {
    mouseX.set(Infinity)
    lensOpacity.set(0)
    window.clearTimeout(offTimer.current)
    offTimer.current = window.setTimeout(() => setLensOn(false), 320)
  }

  const rendered = React.Children.map(children, (child) => {
    if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
      return React.cloneElement(child, {
        ...child.props,
        mouseX,
        size: iconSize,
        magnification: iconMagnification,
        distance: iconDistance,
        disableMagnification: !interactive,
        pressable,
      })
    }
    return child
  })

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "relative flex h-[52px] w-max items-center rounded-full px-1.5",
        className
      )}
    >
      <div aria-hidden className="dock-glass-base" style={glassStyle} />
      {interactive ? (
        <motion.div
          aria-hidden
          data-on={lensOn}
          className="dock-lens"
          style={{ x: lensOffset, opacity: lensOpacity }}
        />
      ) : null}
      {rendered}
    </div>
  )
}

Dock.displayName = "Dock"

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number
  magnification?: number
  disableMagnification?: boolean
  distance?: number
  mouseX?: MotionValue<number>
  pressable?: boolean
  active?: boolean
  className?: string
  children?: React.ReactNode
  props?: PropsWithChildren
}

function DockIcon({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  pressable = true,
  active = false,
  className,
  children,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const defaultMouseX = useMotionValue(Infinity)
  const targetSize = disableMagnification ? size : magnification

  // Cosine falloff: hovered icon reaches the target, neighbours ease off smoothly.
  const sizeTransform = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    const d = Math.abs(val - bounds.x - bounds.width / 2)
    const t = Math.min(d / distance, 1)
    const falloff = (Math.cos(t * Math.PI) + 1) / 2
    return size + (targetSize - size) * falloff
  })

  const width = useSpring(sizeTransform, iconSpring)
  const iconScale = useTransform(width, (w) => w / size)

  const style = {
    width,
    height: width,
    "--dock-icon-scale": iconScale,
  } as unknown as MotionStyle

  return (
    <motion.div
      ref={ref}
      style={style}
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
